import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
import { Model } from 'mongoose';

@Injectable()
export class RolesService {
  public constructor(
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
  ) {}

  public async findRoleByName(roleName: string): Promise<RoleDocument> {
    const role = await this.roleModel.findOne({ role: roleName }).exec();
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return role;
  }
}
