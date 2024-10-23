import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import * as process from 'process';
import * as path from 'path';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { CategoriesModule } from './categories/categories.module';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { BrandsModule } from './brands/brands.module';
import { CPropertiesModule } from './c-properties/c-properties.module';
import { DevicesModule } from './devices/devices.module';
import { CPropertiesGroupsModule } from './c-properties-groups/c-properties-groups.module';
import { CommonModule } from './common/common.module';
import { CommentsModule } from './comments/comments.module';
import { RatingsModule } from './ratings/ratings.module';

@Module({
  imports: [
    PassportModule.register({ session: true }),
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_DB}.ig26m8z.mongodb.net/?retryWrites=true&w=majority`,
    ),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: path.join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    CategoriesModule,
    FilesModule,
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, '..', 'static'),
    }),
    BrandsModule,
    CPropertiesModule,
    DevicesModule,
    CPropertiesGroupsModule,
    CommonModule,
    CommentsModule,
    RatingsModule,
  ],
})
export class AppModule {}
