import { registerDecorator } from 'class-validator';
import { DECORATORS_NAME_HASDEFALUT } from './constant';

export const HasDefault = () => (object: object, propertyName: string) =>
  registerDecorator({
    name: DECORATORS_NAME_HASDEFALUT,
    target: object.constructor,
    propertyName: propertyName,
    validator: {
      validate: (value) => value,
    },
  });
