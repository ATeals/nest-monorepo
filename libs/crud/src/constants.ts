import { Delete, Get, Patch, Post, RequestMethod } from '@nestjs/common';
import { CRUDOptions, METHOD_POLITYS } from './crud.type';
import {
  CreateRouteArgInterceptor,
  CRUDRouteArgsInterceptor,
  OnlyParamsRouteInterceptor,
  UpdateRouteArgInterceptor,
} from './interceptor';

export const CRUD_ROUTE_ARGS = 'CRUD_ROUTE_ARGS';

export const METHODS = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  READ_ONE: 'READ_ONE',
  READ_MANY: 'READ_MANY',
} as const;

export const CRUD_POLITY: METHOD_POLITYS = {
  [METHODS.READ_MANY]: {
    method: RequestMethod.GET,
    getPath: () => '/',
    decorators: [Get()],
    hasBody: false,
    interceptor: () => CRUDRouteArgsInterceptor(),
  },
  [METHODS.CREATE]: {
    method: RequestMethod.POST,
    getPath: () => '/',
    decorators: [Post()],
    hasBody: true,
    interceptor: (crudOptions: CRUDOptions) => CreateRouteArgInterceptor(crudOptions),
  },
  [METHODS.UPDATE]: {
    method: RequestMethod.PATCH,
    getPath: (parmas) => `/:${parmas}`,
    decorators: [Patch()],
    hasBody: true,
    interceptor: (crudOptions: CRUDOptions) => UpdateRouteArgInterceptor(crudOptions),
  },
  [METHODS.DELETE]: {
    method: RequestMethod.DELETE,
    getPath: (parmas) => `/:${parmas}`,
    decorators: [Delete()],
    hasBody: false,
    interceptor: (crudOptions: CRUDOptions, primaryKey?: string) => OnlyParamsRouteInterceptor(crudOptions, primaryKey),
  },
  [METHODS.READ_ONE]: {
    method: RequestMethod.GET,
    getPath: (parmas) => `/:${parmas}`,
    decorators: [Get()],
    hasBody: false,
    interceptor: (crudOptions: CRUDOptions, primaryKey?: string) => OnlyParamsRouteInterceptor(crudOptions, primaryKey),
  },
};
