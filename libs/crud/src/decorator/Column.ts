import { applyDecorators } from '@nestjs/common';
import { Transform, TransformFnParams, Type, TypeHelpOptions } from 'class-transformer';
import { HasDefault } from './HasDefault';
import { PrimaryKey } from './PrimaryKey';
import { generateDispatchTableFn } from '@libs/utils';

type AnyFunction = (...args: any[]) => any;

export interface ColumnOptions {
  transFormFn?: (params: TransformFnParams) => void;
  decorators?: Array<PropertyDecorator | MethodDecorator>;
  isPrimaryKey?: boolean;
  hasDefault?: boolean;
  type?: (type?: TypeHelpOptions) => AnyFunction;
}

const columnOptionMap = {
  isPrimaryKey: () => PrimaryKey(),
  hasDefault: () => HasDefault(),
  type: (arg: ColumnOptions['type']) => Type(arg),
  transFormFn: (arg: ColumnOptions['transFormFn']) => Transform(arg),
};

const [columnOptionFn, isMapsKey] = generateDispatchTableFn(columnOptionMap);

export const Column = (columnOptions?: ColumnOptions) => {
  const decorators = [...(columnOptions.decorators || [])];

  for (const [key, value] of Object.entries(columnOptions)) {
    if (isMapsKey(key) && value !== undefined) {
      decorators.push(columnOptionFn(key, value));
    }
  }

  return applyDecorators(...decorators);
};
