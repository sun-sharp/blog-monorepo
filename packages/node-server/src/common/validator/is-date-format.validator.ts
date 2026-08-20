import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsDateFormatConstraint implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    if (typeof value !== 'string') return false;
    // 检查格式
    const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    if (!regex.test(value)) return false;
    // 检查日期是否真实存在（如 2月30日 会返回 false）
    const date = new Date(value);
    if (isNaN(date.getTime())) return false;
    // 确保转换后的字符串能完全匹配原值（防止类似 2026-08-21 15:08:03 被误解析）
    const parts = value.split(/[- :]/);
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const hour = parseInt(parts[3], 10);
    const minute = parseInt(parts[4], 10);
    const second = parseInt(parts[5], 10);
    const d = new Date(year, month, day, hour, minute, second);
    return (
      d.getFullYear() === year &&
      d.getMonth() === month &&
      d.getDate() === day &&
      d.getHours() === hour &&
      d.getMinutes() === minute &&
      d.getSeconds() === second
    );
  }

  defaultMessage(): string {
    return '测量时间格式必须为 yyyy-MM-dd HH:mm:ss 且为有效日期时间';
  }
}

export function IsDateFormat(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsDateFormatConstraint,
    });
  };
}
