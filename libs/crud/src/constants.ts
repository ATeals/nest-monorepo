import { Delete, Get, Patch, Post, RequestMethod } from '@nestjs/common';
import { METHOD_POLITYS } from './crud.type';

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
    path: '/',
    decorators: [Get()],
    hasBody: false,
  },
  [METHODS.CREATE]: {
    method: RequestMethod.POST,
    path: '/',
    decorators: [Post()],
    hasBody: true,
  },
  [METHODS.UPDATE]: {
    method: RequestMethod.PUT,
    path: '/:id',
    decorators: [Patch()],
    hasBody: true,
  },
  [METHODS.DELETE]: {
    method: RequestMethod.DELETE,
    path: '/:id',
    decorators: [Delete()],
    hasBody: false,
  },
  [METHODS.READ_ONE]: {
    method: RequestMethod.GET,
    path: '/:id',
    decorators: [Get()],
    hasBody: false,
  },
};
