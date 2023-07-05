import { PartialType } from '@nestjs/swagger';
import { CreateWaitForDoDto } from './create-wait-for-do.dto';

export class UpdateWaitForDoDto extends PartialType(CreateWaitForDoDto) {}
