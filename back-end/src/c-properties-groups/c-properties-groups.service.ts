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
    return this.transactionsService.execute<CPropertiesGroupGQL[]>(
      async (session) => {
        const groups = await this.cPropertiesGroupModel
          .find({
            _id: { $nin: ids },
          })
          .session(session)
          .exec();

        return Promise.all(
          groups.map(async (group: CPropertiesGroupDocument) => {
            const hasProperties =
              await this.cPropertiesService.hasGroupProperties(
                group.id,
                session,
              );
            return {
              ...group.toObject<CPropertiesGroupGQL>(),
              hasProperties,
            };
          }),
        );
      },
    );
  }

  public async getCPGroupsByCategoryId(
    categoryId: string,
  ): Promise<CPropertiesGroupGQL[]> {
    return this.transactionsService.execute<CPropertiesGroupGQL[]>(
      async (session) => {
        const groups = await this.cPropertiesGroupModel
          .find({ categoryId })
          .session(session)
          .exec();

        return Promise.all(
          groups.map(async (group: CPropertiesGroupDocument) => {
            const hasProperties =
              await this.cPropertiesService.hasGroupProperties(
                group.id,
                session,
              );
            return {
              ...group.toObject<CPropertiesGroupGQL>(),
              hasProperties,
            };
          }),
        );
      },
    );
  }

  public async getCPropertiesGroupById(
    id: string,
    session: ClientSession,
  ): Promise<CPropertiesGroupGQL> {
    const group = await this.cPropertiesGroupModel
      .findById(id)
      .session(session)
      .exec();
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    const hasProperties = await this.cPropertiesService.hasGroupProperties(
      group.id,
      session,
    );
    return {
      ...group.toObject<CPropertiesGroupGQL>(),
      hasProperties,
    };
  }

  public async hasCategoryGroups(
    categoryId: string,
    session: ClientSession,
  ): Promise<boolean> {
    const countGroups = await this.cPropertiesGroupModel
      .countDocuments({ categoryId })
      .session(session)
      .exec();
    return countGroups > 0;
  }

  public async createCPropertiesGroups(
    createCPropertiesGroupInputs: CreateCPropertiesGroupInput[],
  ): Promise<CPropertiesGroupGQL[]> {
    return this.transactionsService.execute<CPropertiesGroupGQL[]>(
      async (session) => {
        const categoryId = createCPropertiesGroupInputs[0].categoryId;
        const subcategoriesIds =
          await this.categoriesService.getSubCategoriesIds(categoryId, session);
        if (subcategoriesIds.length > 1) {
          throw new ConflictException(
            'A category cannot include properties and subcategories',
          );
        }

        try {
          const createdGroups = await this.cPropertiesGroupModel.insertMany(
            createCPropertiesGroupInputs,
            { session },
          );
          return createdGroups.map((group: CPropertiesGroupDocument) => ({
            ...group.toObject<CPropertiesGroupGQL>(),
            hasProperties: false,
          }));
        } catch (error) {
          if (error.code === 11000) {
            throw new ConflictException(
              'A category cannot have two groups with the same name',
            );
          }
          throw error;
        }
      },
    );
  }

  public async updateCPropertiesGroup(
    id: string,
    updateCPropertiesGroupInput: UpdateCPropertiesGroupInput,
  ): Promise<CPropertiesGroupGQL> {
    return this.transactionsService.execute<CPropertiesGroupGQL>(
      async (session) => {
        try {
          const updatedGroup = await this.cPropertiesGroupModel
            .findByIdAndUpdate(
              id,
              { groupName: updateCPropertiesGroupInput.groupName },
              { new: true },
            )
            .session(session)
            .exec();

          if (updatedGroup) {
            const hasProperties =
              await this.cPropertiesService.hasGroupProperties(
                updatedGroup.id,
                session,
              );
            return {
              ...updatedGroup.toObject<CPropertiesGroupGQL>(),
              hasProperties,
            };
          }

          throw new BadRequestException('A group is not updated');
        } catch (error) {
          if (error.code === 11000) {
            throw new ConflictException(
              'A category cannot have two groups with the same name',
            );
          }
          throw error;
        }
      },
    );
  }

  public async deleteCPropertiesGroup(id: string): Promise<Deleted> {
    return this.transactionsService.execute<Deleted>(async (session) => {
      const isGroupUsed = await this.devicesService.checkGroup(id, session);
      if (isGroupUsed) {
        throw new ForbiddenException(
          'This group is used in devices and cannot be deleted',
        );
      }
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
          session,
        );
        return {
          ...ids,
          groupsIds: [id],
          category,
          group: null,
        };
      } else {
        throw new NotFoundException('Group not found');
      }
    });
  }

  public async deleteAllGroupsByCategoriesIds(
    categoriesIds: string[],
    session: ClientSession,
  ): Promise<Deleted> {
    const groups = await this.cPropertiesGroupModel
      .find({ categoryId: { $in: categoriesIds } })
      .session(session)
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

  public async getGroupsIdsByCategoryId(
    categoryId: string,
    session: ClientSession,
  ): Promise<string[]> {
    const groups = await this.cPropertiesGroupModel
      .find({ categoryId })
      .session(session)
      .exec();
    return groups.map((group) => group.id);
  }

  public async getCategoryId(
    id: string,
    session: ClientSession,
  ): Promise<string> {
    const group = await this.cPropertiesGroupModel
      .findById(id)
      .session(session)
      .exec();
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    return group.categoryId;
  }
}
