import { NestInterceptor, RequestMethod, Type } from '@nestjs/common';
import { METHODS } from './constants';

export type Constructor = new (...args: any[]) => any;

export interface CRUDOptions {
  swagger?: {
    title: string;
  };
  enableMethods?: (keyof typeof METHODS)[];
  entity?: any;
  methods?: { [P in keyof typeof METHODS]?: MethodOptions };
}
export interface MethodOptions {
  decorators?: Array<PropertyDecorator | MethodDecorator>;
  interceptors?: Array<Type<NestInterceptor>>;
}

export type METHOD_POLITY = {
  method: RequestMethod;
  path: string;
  decorators: any[];
  hasBody?: boolean;
};

export interface METHOD_POLITYS {
  [METHODS.CREATE]: METHOD_POLITY;
  [METHODS.UPDATE]: METHOD_POLITY;
  [METHODS.DELETE]: METHOD_POLITY;
  [METHODS.READ_ONE]: METHOD_POLITY;
  [METHODS.READ_MANY]: METHOD_POLITY;
}
