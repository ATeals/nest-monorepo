import { registerDecorator } from 'class-validator';
import { DECORATORS_NAME_PRIMARYKEY } from './constant';

export const PrimaryKey = () => (object: object, propertyName: string) =>
  registerDecorator({
    name: DECORATORS_NAME_PRIMARYKEY,
    target: object.constructor,
    propertyName: propertyName,
    validator: {
      validate: (value) => value,
    },
  });
