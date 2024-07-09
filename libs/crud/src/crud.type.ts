import { NestInterceptor, RequestMethod, Type } from '@nestjs/common';
import { METHODS } from './constants';

export type Constructor = new (...args: any[]) => any;

export interface CRUDOptions {
  swagger?: {
    title: string;
  };
  enableMethods?: (keyof typeof METHODS)[];
  entity?: new (...args: any[]) => any;
  methods?: { [P in keyof typeof METHODS]?: MethodOptions };
}
export interface MethodOptions {
  decorators?: Array<PropertyDecorator | MethodDecorator>;
  interceptors?: Array<Type<NestInterceptor>>;
}

export type METHOD_POLITY = {
  method: RequestMethod;
  getPath: (parmas?: string) => string;
  decorators: any[];
  hasBody?: boolean;
  interceptor?: (...args: any) => Type<NestInterceptor>;
};

export interface METHOD_POLITYS {
  [METHODS.CREATE]: METHOD_POLITY;
  [METHODS.UPDATE]: METHOD_POLITY;
  [METHODS.DELETE]: METHOD_POLITY;
  [METHODS.READ_ONE]: METHOD_POLITY;
  [METHODS.READ_MANY]: METHOD_POLITY;
}
