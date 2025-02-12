import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserInput } from './inputs/create-user.input';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { ClientSession, Model } from 'mongoose';
import { User as UserGQL } from './models/user.model';
import { RolesService } from '../roles/roles.service';
import { CartsService } from '../carts/carts.service';
import { TransactionsService } from '../common/services/transactions/transactions.service';

@Injectable()
export class UsersService {
  public constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private rolesService: RolesService,
    private cartsService: CartsService,
    private transactionsService: TransactionsService,
  ) {}

  public async createUser(createUserInput: CreateUserInput): Promise<UserGQL> {
    const userRole = await this.rolesService.getRoleByName('user');

    const newUser = await this.userModel.create({
      ...createUserInput,
      roles: [userRole.id],
    });
    await newUser.populate('roles');
    return newUser.toObject<UserGQL>();
  }

  public async getUserByEmail(email: string): Promise<UserGQL | null> {
    return this.transactionsService.execute(async (session) => {
      const user = await this.userModel
        .findOne({ email })
        .populate([
          { path: 'roles' },
          {
            path: 'cart',
            populate: {
              path: 'devices',
              populate: { path: 'device' },
            },
          },
        ])
        .session(session)
        .exec();

      if (!user) {
        return null;
      }

      const userGQL: UserGQL = user.toObject<UserGQL>();
      if (userGQL.cart) {
        userGQL.cart = await this.cartsService.updateCartPrices(
          userGQL.cart.id,
          session,
        );
      }
      return userGQL;
    });
  }

  public async getUserById(
    id: string,
    session: ClientSession,
  ): Promise<UserDocument> {
    const user = await this.userModel.findById(id).session(session).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  public async getUserObjectById(id: string): Promise<UserGQL> {
    const user = await this.userModel
      .findById(id)
      .populate([
        { path: 'roles' },
        {
          path: 'cart',
          populate: {
            path: 'devices',
            populate: { path: 'device' },
          },
        },
      ])
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.toObject<UserGQL>();
  }
}
