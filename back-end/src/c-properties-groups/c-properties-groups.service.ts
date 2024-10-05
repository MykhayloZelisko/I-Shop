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
import { Category } from '../categories/models/category.model';
import { DeleteResult } from 'mongodb';
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

  public async createCPropertiesGroups(
    createCPropertiesGroupInputs: CreateCPropertiesGroupInput[],
  ): Promise<Category> {
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
    const groupIds = createdGroups.map(
      (group: CPropertiesGroupDocument) => group.id,
    );
    return this.categoriesService.addGroupsToCategory(categoryId, groupIds);
  }

  public async updateCPropertiesGroup(
    id: string,
    updateCPropertiesGroupInput: UpdateCPropertiesGroupInput,
  ): Promise<Category> {
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
      return this.categoriesService.getCategoryById(updatedGroup.categoryId);
    }
    throw new BadRequestException('A group is not updated');
  }

  public async deleteCPropertiesGroup(id: string): Promise<Category> {
    // TODO: check products. If a property cannot be deleted you should throw ForbiddenException
    const group = await this.cPropertiesGroupModel.findByIdAndDelete(id).exec();
    if (group) {
      await this.cPropertiesService.deleteAllCPropertiesByGroupIds([id]);
      return this.categoriesService.getCategoryById(group.categoryId);
    } else {
      throw new NotFoundException('Property not found');
    }
  }

  public async deleteAllGroupsByCategoryId(
    categoryId: string,
  ): Promise<DeleteResult> {
    try {
      const groups = await this.cPropertiesGroupModel
        .find({ categoryId })
        .exec();
      const groupIds = groups.map((group) => group.id);
      await this.cPropertiesService.deleteAllCPropertiesByGroupIds(groupIds);
      return await this.cPropertiesGroupModel.deleteMany({ categoryId }).exec();
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

  public async findGroupByPropertyId(
    propertyId: string,
  ): Promise<CPropertiesGroupGQL> {
    const group = await this.cPropertiesGroupModel
      .findOne({ properties: propertyId })
      .exec();
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    return group.toObject();
  }

  public async addPropertiesToGroup(
    groupId: string,
    propertyIds: string[],
  ): Promise<Category> {
    const group = await this.cPropertiesGroupModel
      .findByIdAndUpdate(
        groupId,
        { $push: { properties: { $each: propertyIds } } },
        { new: true },
      )
      .populate('properties')
      .exec();
    if (!group) {
      throw new InternalServerErrorException(
        'Properties groups are not added to a category',
      );
    }
    return this.categoriesService.getCategoryById(group.categoryId);
  }
}
