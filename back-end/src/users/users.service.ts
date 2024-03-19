import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './inputs/create-user.input';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { User as UserGQL } from './models/user.model';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UsersService {
  public constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private rolesService: RolesService,
  ) {}

  public async createUser(createUserInput: CreateUserInput): Promise<UserGQL> {
    const userRole = await this.rolesService.findRoleByName('user');

    const newUser = await this.userModel.create({
      ...createUserInput,
      roles: [userRole._id],
    });
    await newUser.populate('roles');
    return newUser.toObject();
  }

  public async getUserById(id: string): Promise<UserGQL | null> {
    const user = await this.userModel.findById(id).populate('roles').exec();
    return user ? user.toObject() : null;
  }

  public async getUserByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).populate('roles').exec();
  }
}
