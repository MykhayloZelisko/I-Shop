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
import { CProperty as CPropertyGQL } from './models/c-property.model';
import { CategoriesService } from '../categories/categories.service';
import { Category } from '../categories/models/category.model';
import { DeleteResult } from 'mongodb';

@Injectable()
export class CPropertiesService {
  public constructor(
    @InjectModel(CProperty.name)
    private cPropertyModel: Model<CPropertyDocument>,
    @Inject(forwardRef(() => CategoriesService))
    private categoriesService: CategoriesService,
  ) {}

  public async createCProperty(
    createCPropertyInput: CreateCPropertyInput,
  ): Promise<CPropertyGQL> {
    const property = await this.cPropertyModel
      .findOne({ propertyName: createCPropertyInput.propertyName })
      .exec();
    if (property) {
      throw new ConflictException('This property already exists');
    }
    const newProperty = await this.cPropertyModel.create(createCPropertyInput);
    return newProperty.toObject();
  }

  public async createCProperties(
    createCPropertyInputs: CreateCPropertyInput[],
  ): Promise<Category> {
    const subcategoriesIds = await this.categoriesService.findSubCategoriesIds(
      createCPropertyInputs[0].categoryId,
    );
    if (subcategoriesIds.length) {
      throw new ConflictException(
        'A category cannot include properties and subcategories',
      );
    }
    const properties: CPropertyGQL[] = [];
    for (const input of createCPropertyInputs) {
      const property = await this.createCProperty(input);
      properties.push(property);
    }
    return this.categoriesService.getCategoryById(properties[0].categoryId);
  }

  public async updateCProperty(
    id: string,
    updateCPropertyInput: UpdateCPropertyInput,
  ): Promise<Category> {
    const property = await this.cPropertyModel
      .findOne({ propertyName: updateCPropertyInput.propertyName })
      .exec();
    if (property) {
      throw new ConflictException('This property already exists');
    }
    const updatedProperty = await this.cPropertyModel
      .findByIdAndUpdate(
        id,
        { propertyName: updateCPropertyInput.propertyName },
        { new: true },
      )
      .exec();
    if (updatedProperty) {
      return this.categoriesService.getCategoryById(updatedProperty.categoryId);
    }
    throw new BadRequestException('A property is not updated');
  }

  public async deleteCProperty(id: string): Promise<Category> {
    // TODO: check products. If a property cannot be deleted you should throw ForbiddenException
    const property = await this.cPropertyModel.findByIdAndDelete(id).exec();
    if (property) {
      return this.categoriesService.getCategoryById(property.categoryId);
    } else {
      throw new NotFoundException('Property not found');
    }
  }

  public async deleteAllCPropertiesByCategoryId(
    categoryId: string,
  ): Promise<DeleteResult> {
    try {
      return await this.cPropertyModel.deleteMany({ categoryId }).exec();
    } catch {
      throw new InternalServerErrorException('Something is wrong');
    }
  }

  public async findCPropertiesIdsByCategoryId(
    categoryId: string,
  ): Promise<string[]> {
    const properties = await this.cPropertyModel.find({ categoryId }).exec();
    return properties.map((property: CPropertyDocument) =>
      property._id.toString(),
    );
  }
}
