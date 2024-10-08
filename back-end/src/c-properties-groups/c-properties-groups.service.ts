import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCPropertiesGroupInput } from './inputs/create-c-properties-group.input';
import { UpdateCPropertiesGroupInput } from './inputs/update-c-properties-group.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CPropertiesGroup,
  CPropertiesGroupDocument,
} from './schemas/c-properties-group.schema';
import { CPropertiesGroup as CPropertiesGroupGQL } from './models/c-properties-group.model';
import { CategoriesService } from '../categories/categories.service';
import { DeletedIds } from '../common/models/deleted-ids.model';
import { CPropertiesService } from '../c-properties/c-properties.service';

@Injectable()
export class CPropertiesGroupsService {
  public constructor(
    @InjectModel(CPropertiesGroup.name)
    private cPropertiesGroupModel: Model<CPropertiesGroupDocument>,
    @Inject(forwardRef(() => CategoriesService))
    private categoriesService: CategoriesService,
    private cPropertiesService: CPropertiesService,
  ) {}

  public async getAllCPropertiesGroups(): Promise<CPropertiesGroupGQL[]> {
    const groups = await this.cPropertiesGroupModel.find().exec();
    return groups.map((group: CPropertiesGroupDocument) => group.toObject());
  }

  public async getCPGroupsByCategoryId(
    categoryId: string,
  ): Promise<CPropertiesGroupGQL[]> {
    const groups = await this.cPropertiesGroupModel.find({ categoryId }).exec();
    return groups.map((group: CPropertiesGroupDocument) => group.toObject());
  }

  public async createCPropertiesGroups(
    createCPropertiesGroupInputs: CreateCPropertiesGroupInput[],
  ): Promise<CPropertiesGroupGQL[]> {
    const categoryId = createCPropertiesGroupInputs[0].categoryId;
    const subcategoriesIds =
      await this.categoriesService.findSubCategoriesIds(categoryId);
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
    return createdGroups.map((group: CPropertiesGroupDocument) =>
      group.toObject(),
    );
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
      return updatedGroup.toObject();
    }
    throw new BadRequestException('A group is not updated');
  }

  public async deleteCPropertiesGroup(id: string): Promise<DeletedIds> {
    // TODO: check products. If a property cannot be deleted you should throw ForbiddenException
    const group = await this.cPropertiesGroupModel.findByIdAndDelete(id).exec();
    if (group) {
      const ids = await this.cPropertiesService.deleteAllCPropertiesByGroupsIds(
        [id],
      );
      return {
        ...ids,
        groupsIds: [id],
      };
    } else {
      throw new NotFoundException('Property not found');
    }
  }

  public async deleteAllGroupsByCategoriesIds(
    categoriesIds: string[],
  ): Promise<DeletedIds> {
    try {
      const groups = await this.cPropertiesGroupModel
        .find({ categoryId: { $in: categoriesIds } })
        .exec();
      const groupsIds: string[] = groups.map(
        (group: CPropertiesGroupDocument) => group.id,
      );
      const ids =
        await this.cPropertiesService.deleteAllCPropertiesByGroupsIds(
          groupsIds,
        );
      await this.cPropertiesGroupModel
        .deleteMany({ categoryId: { $in: categoriesIds } })
        .exec();
      return {
        propertiesIds: ids.propertiesIds,
        groupsIds,
        categoriesIds,
      };
    } catch {
      throw new InternalServerErrorException('Something is wrong');
    }
  }

  public async findGroupsIdsByCategoryId(
    categoryId: string,
  ): Promise<string[]> {
    const groups = await this.cPropertiesGroupModel.find({ categoryId }).exec();
    return groups.map((group) => group.id);
  }
}
