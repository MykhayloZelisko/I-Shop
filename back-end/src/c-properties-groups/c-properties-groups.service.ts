import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCPropertiesGroupInput } from './inputs/create-c-properties-group.input';
import { UpdateCPropertiesGroupInput } from './inputs/update-c-properties-group.input';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import {
  CPropertiesGroup,
  CPropertiesGroupDocument,
} from './schemas/c-properties-group.schema';
import { CPropertiesGroup as CPropertiesGroupGQL } from './models/c-properties-group.model';
import { CategoriesService } from '../categories/categories.service';
import { Deleted } from '../common/models/deleted.model';
import { CPropertiesService } from '../c-properties/c-properties.service';
import { DevicesService } from '../devices/devices.service';
import { TransactionsService } from '../common/services/transactions/transactions.service';

@Injectable()
export class CPropertiesGroupsService {
  public constructor(
    @InjectModel(CPropertiesGroup.name)
    private cPropertiesGroupModel: Model<CPropertiesGroupDocument>,
    @Inject(forwardRef(() => CategoriesService))
    private categoriesService: CategoriesService,
    private cPropertiesService: CPropertiesService,
    @Inject(forwardRef(() => DevicesService))
    private devicesService: DevicesService,
    private transactionsService: TransactionsService,
  ) {}

  public async getFilteredCPropertiesGroups(
    ids: string[],
  ): Promise<CPropertiesGroupGQL[]> {
    const groups = await this.cPropertiesGroupModel
      .find({
        _id: { $nin: ids },
      })
      .exec();

    return Promise.all(
      groups.map(async (group: CPropertiesGroupDocument) => {
        const hasProperties = await this.cPropertiesService.hasGroupProperties(
          group.id,
        );
        return {
          ...group.toObject<CPropertiesGroupGQL>(),
          hasProperties,
        };
      }),
    );
  }

  public async getCPGroupsByCategoryId(
    categoryId: string,
  ): Promise<CPropertiesGroupGQL[]> {
    const groups = await this.cPropertiesGroupModel.find({ categoryId }).exec();

    return Promise.all(
      groups.map(async (group: CPropertiesGroupDocument) => {
        const hasProperties = await this.cPropertiesService.hasGroupProperties(
          group.id,
        );
        return {
          ...group.toObject<CPropertiesGroupGQL>(),
          hasProperties,
        };
      }),
    );
  }

  public async getCPropertiesGroupById(
    id: string,
  ): Promise<CPropertiesGroupGQL> {
    const group = await this.cPropertiesGroupModel.findById(id).exec();
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    const hasProperties = await this.cPropertiesService.hasGroupProperties(
      group.id,
    );
    return {
      ...group.toObject<CPropertiesGroupGQL>(),
      hasProperties,
    };
  }

  public async hasCategoryGroups(categoryId: string): Promise<boolean> {
    const countGroups = await this.cPropertiesGroupModel
      .countDocuments({ categoryId })
      .exec();
    return countGroups > 0;
  }

  public async createCPropertiesGroups(
    createCPropertiesGroupInputs: CreateCPropertiesGroupInput[],
  ): Promise<CPropertiesGroupGQL[]> {
    const categoryId = createCPropertiesGroupInputs[0].categoryId;
    const subcategoriesIds =
      await this.categoriesService.getSubCategoriesIds(categoryId);
    if (subcategoriesIds.length > 1) {
      throw new ConflictException(
        'A category cannot include properties and subcategories',
      );
    }

    const groupNames = createCPropertiesGroupInputs.map(
      (input) => input.groupName,
    );

    const hasDuplicates = new Set(groupNames).size !== groupNames.length;

    const existedGroups = await this.cPropertiesGroupModel
      .find({
        categoryId,
        groupName: { $in: groupNames },
      })
      .exec();

    if (existedGroups.length || hasDuplicates) {
      throw new ConflictException(
        'A category cannot have two groups with the same name',
      );
    }

    const createdGroups = await this.cPropertiesGroupModel.insertMany(
      createCPropertiesGroupInputs,
    );
    return createdGroups.map((group: CPropertiesGroupDocument) => ({
      ...group.toObject<CPropertiesGroupGQL>(),
      hasProperties: false,
    }));
  }

  public async updateCPropertiesGroup(
    id: string,
    updateCPropertiesGroupInput: UpdateCPropertiesGroupInput,
  ): Promise<CPropertiesGroupGQL> {
    const group = await this.cPropertiesGroupModel
      .findOne({ groupName: updateCPropertiesGroupInput.groupName })
      .exec();
    if (group && group.id !== id) {
      throw new ConflictException(
        'A category cannot have two groups with the same name',
      );
    }
    const updatedGroup = await this.cPropertiesGroupModel
      .findByIdAndUpdate(
        id,
        { groupName: updateCPropertiesGroupInput.groupName },
        { new: true },
      )
      .exec();
    if (updatedGroup) {
      const hasProperties = await this.cPropertiesService.hasGroupProperties(
        updatedGroup.id,
      );
      return { ...updatedGroup.toObject<CPropertiesGroupGQL>(), hasProperties };
    }
    throw new BadRequestException('A group is not updated');
  }

  public async deleteCPropertiesGroup(id: string): Promise<Deleted> {
    const isGroupUsed = await this.devicesService.checkGroup(id);
    if (isGroupUsed) {
      throw new ForbiddenException(
        'This group is used in devices and cannot be deleted',
      );
    }
    return this.transactionsService.execute<Deleted>(async (session) => {
      const group = await this.cPropertiesGroupModel
        .findByIdAndDelete(id)
        .session(session)
        .exec();
      if (group) {
        const ids =
          await this.cPropertiesService.deleteAllCPropertiesByGroupsIds(
            [id],
            session,
          );
        const category = await this.categoriesService.getCategoryById(
          group.categoryId,
        );
        return {
          ...ids,
          groupsIds: [id],
          category,
          group: null,
        };
      } else {
        throw new NotFoundException('Property not found');
      }
    });
  }

  public async deleteAllGroupsByCategoriesIds(
    categoriesIds: string[],
    session: ClientSession,
  ): Promise<Deleted> {
    const groups = await this.cPropertiesGroupModel
      .find({ categoryId: { $in: categoriesIds } })
      .exec();
    const groupsIds: string[] = groups.map(
      (group: CPropertiesGroupDocument) => group.id,
    );
    const ids = await this.cPropertiesService.deleteAllCPropertiesByGroupsIds(
      groupsIds,
      session,
    );
    await this.cPropertiesGroupModel
      .deleteMany({ categoryId: { $in: categoriesIds } })
      .session(session)
      .exec();
    return {
      propertiesIds: ids.propertiesIds,
      groupsIds,
      categoriesIds,
      group: null,
      category: null,
    };
  }

  public async getGroupsIdsByCategoryId(categoryId: string): Promise<string[]> {
    const groups = await this.cPropertiesGroupModel.find({ categoryId }).exec();
    return groups.map((group) => group.id);
  }

  public async getCategoryId(id: string): Promise<string> {
    const group = await this.cPropertiesGroupModel.findById(id).exec();
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    return group.categoryId;
  }
}
