import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCPropertyInput } from './inputs/create-c-property.input';
import { UpdateCPropertyInput } from './inputs/update-c-property.input';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { CProperty, CPropertyDocument } from './schemas/c-property.schema';
import { CProperty as CPropertyGQL } from './models/c-property.model';
import { Deleted } from '../common/models/deleted.model';
import { CPropertiesGroupsService } from '../c-properties-groups/c-properties-groups.service';
import { CPropertiesGroup } from '../c-properties-groups/models/c-properties-group.model';
import { DevicesService } from '../devices/devices.service';

@Injectable()
export class CPropertiesService {
  public constructor(
    @InjectModel(CProperty.name)
    private cPropertyModel: Model<CPropertyDocument>,
    @Inject(forwardRef(() => CPropertiesGroupsService))
    private cPropertiesGroupsService: CPropertiesGroupsService,
    @Inject(forwardRef(() => DevicesService))
    private devicesService: DevicesService,
  ) {}

  public async getFilteredCProperties(ids: string[]): Promise<CPropertyGQL[]> {
    const properties = await this.cPropertyModel
      .find({
        _id: { $nin: ids },
      })
      .exec();
    return properties.map((property: CPropertyDocument) =>
      property.toObject<CPropertyGQL>(),
    );
  }

  public async getCPropertiesByCategoryId(id: string): Promise<CPropertyGQL[]> {
    const groups =
      await this.cPropertiesGroupsService.getCPGroupsByCategoryId(id);
    const ids = groups.map((group: CPropertiesGroup) => group.id);
    return this.getCPropertiesByGroupsIds(ids);
  }

  public async getCPropertiesByGroupsIds(
    ids: string[],
  ): Promise<CPropertyGQL[]> {
    const properties = await this.cPropertyModel
      .find({
        groupId: { $in: ids },
      })
      .exec();
    return properties.map((property: CPropertyDocument) =>
      property.toObject<CPropertyGQL>(),
    );
  }

  public async getCPropertiesByGroupId(
    groupId: string,
  ): Promise<CPropertyGQL[]> {
    const properties = await this.cPropertyModel.find({ groupId }).exec();
    return properties.map((property: CPropertyDocument) =>
      property.toObject<CPropertyGQL>(),
    );
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
      property.toObject<CPropertyGQL>(),
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
      return updatedProperty.toObject<CPropertyGQL>();
    }
    throw new BadRequestException('A property is not updated');
  }

  public async deleteCProperty(id: string): Promise<Deleted> {
    const isPropertyUsed = await this.devicesService.checkProperty(id);
    if (isPropertyUsed) {
      throw new ForbiddenException(
        'This property is used in devices and cannot be deleted',
      );
    }
    const property = await this.cPropertyModel.findByIdAndDelete(id).exec();
    if (property) {
      const group = await this.cPropertiesGroupsService.getCPropertiesGroupById(
        property.groupId,
      );
      return {
        categoriesIds: [],
        groupsIds: [],
        propertiesIds: [id],
        group,
        category: null,
      };
    } else {
      throw new NotFoundException('Property not found');
    }
  }

  public async deleteAllCPropertiesByGroupsIds(
    groupsIds: string[],
    session: ClientSession,
  ): Promise<Deleted> {
    try {
      const properties = await this.cPropertyModel
        .find({
          groupId: { $in: groupsIds },
        })
        .exec();
      const propertiesIds = properties.map((property) => property.id);
      await this.cPropertyModel
        .deleteMany({ groupId: { $in: groupsIds } })
        .session(session)
        .exec();
      return {
        groupsIds,
        propertiesIds,
        categoriesIds: [],
        group: null,
        category: null,
      };
    } catch {
      throw new InternalServerErrorException('Something is wrong');
    }
  }

  public async hasGroupProperties(groupId: string): Promise<boolean> {
    const countProperties = await this.cPropertyModel
      .countDocuments({ groupId })
      .exec();
    return countProperties > 0;
  }

  public async getGroupId(id: string): Promise<string> {
    const property = await this.cPropertyModel.findById(id).exec();
    if (!property) {
      throw new NotFoundException('Property not found');
    }
    return property.groupId;
  }
}
