import { PartialType } from '@nestjs/swagger';
import { CreateAliPayDto } from './create-ali-pay.dto';

export class UpdateAliPayDto extends PartialType(CreateAliPayDto) {}
