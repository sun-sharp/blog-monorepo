import { PartialType } from '@nestjs/swagger';
import { CreateUricDto } from './create-uric.dto';

export class UpdateUricDto extends PartialType(CreateUricDto) {}
