import { ValidationError } from '@nestjs/common';

export const excludeDecoratorsFromErrorFilter = (error: ValidationError, excludeDecoratorName: string[]) =>
  !Object.keys(error.constraints).some((key) => excludeDecoratorName.includes(key));
