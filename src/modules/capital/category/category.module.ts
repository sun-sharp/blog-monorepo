import { Module, forwardRef } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from 'src/schemas/capital/category.schema';
import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';
import { JwtStrategy } from 'src/jwt/jwt.strategy';

const CATEGORY_MONGO_MODULE = MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }], 'capital');

@Module({
  imports: [CATEGORY_MONGO_MODULE, UserModule, forwardRef(() => RoleModule)],
  controllers: [CategoryController],
  providers: [CategoryService, JwtStrategy],
  exports: [CategoryService],
})
export class CategoryModule {}
