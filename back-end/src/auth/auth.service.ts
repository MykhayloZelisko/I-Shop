import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserInput } from '../users/inputs/create-user.input';
import * as bcrypt from 'bcryptjs';
import { LoginInput } from './inputs/login.input';
import { User } from '../users/models/user.model';

@Injectable()
export class AuthService {
  public constructor(private usersService: UsersService) {}

  public async registration(createUserInput: CreateUserInput): Promise<void> {
    const candidate = await this.usersService.getUserByEmail(
      createUserInput.email,
    );
    if (candidate) {
      throw new ConflictException('A user with this email already exists');
    }
    const hashPassword = await bcrypt.hash(createUserInput.password, 10);
    await this.usersService.createUser({
      ...createUserInput,
      password: hashPassword,
    });
  }

  public async validateUser(loginInput: LoginInput): Promise<User> {
    const user = await this.usersService.getUserByEmail(loginInput.email);
    if (user) {
      const passwordEquals = await bcrypt.compare(
        loginInput.password,
        user.password,
      );
      if (passwordEquals) {
        return user.toObject();
      }
    }
    throw new UnauthorizedException('Email or password is incorrect');
  }
}
