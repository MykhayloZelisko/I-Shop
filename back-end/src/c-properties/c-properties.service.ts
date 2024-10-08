import {
  BadRequestException,
  ConflictException,
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
import { DeletedIds } from '../common/models/deleted-ids.model';

@Injectable()
export class CPropertiesService {
  public constructor(
    @InjectModel(CProperty.name)
    private cPropertyModel: Model<CPropertyDocument>,
  ) {}

  public async getAllCProperties(): Promise<CPropertyGQL[]> {
    const properties = await this.cPropertyModel.find().exec();
    return properties.map((property: CPropertyDocument) => property.toObject());
  }

  public async getCPropertiesByGroupId(
    groupId: string,
  ): Promise<CPropertyGQL[]> {
    const properties = await this.cPropertyModel.find({ groupId }).exec();
    return properties.map((property: CPropertyDocument) => property.toObject());
  }

  public async createCProperties(
    createCPropertyInputs: CreateCPropertyInput[],
  ): Promise<CPropertyGQL[]> {
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
    return createdProperties.map((property: CPropertyDocument) =>
      property.toObject(),
    );
  }

  public async updateCProperty(
    id: string,
    updateCPropertyInput: UpdateCPropertyInput,
  ): Promise<CPropertyGQL> {
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
      return updatedProperty.toObject();
    }
    throw new BadRequestException('A property is not updated');
  }

  public async deleteCProperty(id: string): Promise<DeletedIds> {
    // TODO: check products. If a property cannot be deleted you should throw ForbiddenException
    const property = await this.cPropertyModel.findByIdAndDelete(id).exec();
    if (property) {
      return {
        categoriesIds: [],
        groupsIds: [],
        propertiesIds: [id],
      };
    } else {
      throw new NotFoundException('Property not found');
    }
  }

  public async deleteAllCPropertiesByGroupsIds(
    groupsIds: string[],
  ): Promise<DeletedIds> {
    try {
      const properties = await this.cPropertyModel
        .find({
          groupId: { $in: groupsIds },
        })
        .exec();
      const propertiesIds = properties.map((property) => property.id);
      await this.cPropertyModel
        .deleteMany({ groupId: { $in: groupsIds } })
        .exec();
      return {
        groupsIds,
        propertiesIds,
        categoriesIds: [],
      };
    } catch {
      throw new InternalServerErrorException('Something is wrong');
    }
  }
}
