import { PartialType } from '@nestjs/swagger';
import { CreateArticlePolicyDto } from './create-article-policy.dto';

export class UpdateArticlePolicyDto extends PartialType(CreateArticlePolicyDto) {}
