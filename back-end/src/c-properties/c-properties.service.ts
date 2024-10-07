import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCPropertyInput } from './inputs/create-c-property.input';
import { UpdateCPropertyInput } from './inputs/update-c-property.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CProperty, CPropertyDocument } from './schemas/c-property.schema';
import { CategoriesService } from '../categories/categories.service';
import { Category } from '../categories/models/category.model';
import { CPropertiesGroupsService } from '../c-properties-groups/c-properties-groups.service';
import { DeleteResult } from 'mongodb';

@Injectable()
export class CPropertiesService {
  public constructor(
    @InjectModel(CProperty.name)
    private cPropertyModel: Model<CPropertyDocument>,
    @Inject(forwardRef(() => CategoriesService))
    private categoriesService: CategoriesService,
    @Inject(forwardRef(() => CPropertiesGroupsService))
    private cPropertiesGroupsService: CPropertiesGroupsService,
  ) {}

  public async createCProperties(
    createCPropertyInputs: CreateCPropertyInput[],
  ): Promise<Category> {
    const groupId = createCPropertyInputs[0].groupId;
    const propertyNames = createCPropertyInputs.map(
      (input) => input.propertyName,
    );

    const hasDuplicates = new Set(propertyNames).size !== propertyNames.length;

    const existedProperties = await this.cPropertyModel
      .find({
        groupId,
        propertyName: { $in: propertyNames },
      })
      .exec();

    if (existedProperties.length || hasDuplicates) {
      throw new ConflictException(
        'A group of properties cannot have two properties with the same name',
      );
    }

    const createdProperties = await this.cPropertyModel.insertMany(
      createCPropertyInputs,
    );
    const propertyIds = createdProperties.map(
      (property: CPropertyDocument) => property.id,
    );
    return this.cPropertiesGroupsService.addPropertiesToGroup(
      groupId,
      propertyIds,
    );
  }

  public async updateCProperty(
    id: string,
    updateCPropertyInput: UpdateCPropertyInput,
  ): Promise<Category> {
    const property = await this.cPropertyModel
      .findOne({ propertyName: updateCPropertyInput.propertyName })
      .exec();
    if (property && property.id !== id) {
      throw new ConflictException(
        'A group cannot have two properties with the same name',
      );
    }
    const updatedProperty = await this.cPropertyModel
      .findByIdAndUpdate(
        id,
        { propertyName: updateCPropertyInput.propertyName },
        { new: true },
      )
      .exec();
    if (updatedProperty) {
      const group = await this.cPropertiesGroupsService.findGroupByPropertyId(
        updatedProperty.id,
      );
      return this.categoriesService.getCategoryById(group.categoryId);
    }
    throw new BadRequestException('A property is not updated');
  }

  public async deleteCProperty(id: string): Promise<Category> {
    // TODO: check products. If a property cannot be deleted you should throw ForbiddenException
    const property = await this.cPropertyModel.findByIdAndDelete(id).exec();
    if (property) {
      const group = await this.cPropertiesGroupsService.findGroupByPropertyId(
        property.id,
      );
      return this.categoriesService.getCategoryById(group.categoryId);
    } else {
      throw new NotFoundException('Property not found');
    }
  }

  public async deleteAllCPropertiesByGroupIds(
    groupIds: string[],
  ): Promise<DeleteResult> {
    try {
      return await this.cPropertyModel
        .deleteMany({ groupId: { $in: groupIds } })
        .exec();
    } catch {
      throw new InternalServerErrorException('Something is wrong');
    }
  }
}
