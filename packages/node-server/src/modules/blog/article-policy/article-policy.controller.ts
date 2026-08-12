import { Controller } from '@nestjs/common';
import { ArticlePolicyService } from './article-policy.service';

@Controller('article-policy')
export class ArticlePolicyController {
  constructor(private readonly articlePolicyService: ArticlePolicyService) {}
}
