/*
 * @Author: YangRuiRui
 * @LastEditTime: 2021-12-03 16:55:06
 * @Description: 请填写简介
 */
// import { PartialType } from '@nestjs/swagger';
// import { CreateUserDto } from './create-user.dto';

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateRoleCodeUserDto {
  @ApiProperty({
    description: '用户id',
  })
  @IsString({ message: '用户id必须是字符串' })
  @IsNotEmpty({ message: '用户id不能为空' })
  readonly userId: string;

  @ApiProperty({
    description: '角色标识',
  })
  @IsString({ message: '角色标识必须是字符串' })
  @IsNotEmpty({ message: '角色标识不能为空' })
  readonly roleCode: string;
}
