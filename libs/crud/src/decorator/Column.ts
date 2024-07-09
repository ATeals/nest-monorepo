import { applyDecorators } from '@nestjs/common';
import { Transform, TransformFnParams } from 'class-transformer';
import { HasDefault } from './HasDefault';
import { PrimaryKey } from './PrimaryKey';

export interface ColumnOptions {
  transFormFn?: (params: TransformFnParams) => void;
  decorators?: Array<PropertyDecorator | MethodDecorator>;
  isPrimaryKey?: boolean;
  hasDefalut?: boolean;
}

export const Column = (columnOptions?: ColumnOptions) => {
  const decorators = [...(columnOptions.decorators || [])];

  if (columnOptions?.transFormFn) decorators.push(Transform(columnOptions.transFormFn));
  if (columnOptions?.isPrimaryKey) decorators.push(PrimaryKey());
  if (columnOptions?.hasDefalut) decorators.push(HasDefault());

  return applyDecorators(...decorators);
};
