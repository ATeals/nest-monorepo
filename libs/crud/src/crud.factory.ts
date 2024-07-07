import { Request } from 'express';
import { CRUD_POLITY, CRUD_ROUTE_ARGS, METHODS } from './constants';
import { Constructor, CRUDOptions } from './crud.type';
import { CRUDRouteArgsInterceptor } from './crud.interceptor';

import {
  CUSTOM_ROUTE_ARGS_METADATA,
  INTERCEPTORS_METADATA,
  METHOD_METADATA,
  PARAMTYPES_METADATA,
  PATH_METADATA,
  ROUTE_ARGS_METADATA,
} from '@nestjs/common/constants';

import { ExecutionContext } from '@nestjs/common';

export class CRUDFactory {
  constructor(private target: Constructor, private options: CRUDOptions) {}

  init() {
    for (const method of Object.values(METHODS)) {
      if (this.isEnableMethod(method)) this.createMethod(method);
    }
  }

  private get targetPrototype() {
    return this.target.prototype;
  }

  isEnableMethod(method: string) {
    if (this.options.enableMethods && this.options.enableMethods.length < 1) {
      return true;
    }

    return this.options.enableMethods.includes(method as any);
  }

  protected [METHODS.CREATE](name: string) {
    this.targetPrototype[name] = function (req: Request) {
      const { body } = req;

      return this.service.create({ data: { ...body } });
    };
  }

  protected [METHODS.UPDATE](name: string) {
    this.targetPrototype[name] = function (req: Request) {
      const {
        params: { id },
        body,
      } = req;

      return this.service.update({ where: { id }, data: { ...body } });
    };
  }

  protected [METHODS.DELETE](name: string) {
    this.targetPrototype[name] = function (req: Request) {
      const {
        params: { id },
      } = req;

      return this.service.delete({ where: { id } });
    };
  }

  protected [METHODS.READ_ONE](name: string) {
    this.targetPrototype[name] = function (req: Request) {
      const {
        params: { id },
      } = req;

      return this.service.findUnique({ where: { id: Number(id) } });
    };
  }

  protected [METHODS.READ_MANY](name: string) {
    this.targetPrototype[name] = function (req: Request) {
      return this.service.findMany({});
    };
  }

  private getMethodName(method: string) {
    const name = `_${method}`;

    this[method](name);

    return name;
  }

  // private initSwagger(method: string, targetMethod: object) {
  //   Reflect.defineMetadata(DECORATORS.API_OPERATION, { summary: method, description: '아무튼 api' }, targetMethod);
  // }

  createMethod(method: string) {
    const { method: httpMethod, path, decorators: defaultDecorators } = CRUD_POLITY[method];

    const methodName = this.getMethodName(method);
    const targetMethod = this.targetPrototype[methodName];

    if (!this.targetPrototype[methodName]) {
      throw new Error(`Method ${methodName} is not defined`);
    }

    Reflect.defineMetadata(
      INTERCEPTORS_METADATA,
      [CRUDRouteArgsInterceptor(), ...(this.options.methods?.[method]?.interceptors || [])],
      targetMethod,
    );

    const requestArg = this.createCrudRouteArg();

    Reflect.defineMetadata(ROUTE_ARGS_METADATA, requestArg, this.target, methodName);
    Reflect.defineMetadata(PARAMTYPES_METADATA, [Object], this.targetPrototype, methodName);

    const decorators = [...defaultDecorators, ...(this.options.methods?.[method]?.decorators || [])];

    decorators.forEach((decorator) => {
      const descriptor = Reflect.getOwnPropertyDescriptor(this.targetPrototype, methodName);

      decorator(this.targetPrototype, methodName, descriptor);
    });

    Reflect.defineMetadata(PATH_METADATA, path, targetMethod);

    Reflect.defineMetadata(METHOD_METADATA, httpMethod, targetMethod);
  }

  private createCrudRouteArg(index = 0, pipes: unknown[] = [], data = undefined) {
    const obj = {
      [`${CRUD_ROUTE_ARGS}${CUSTOM_ROUTE_ARGS_METADATA}:${index}`]: {
        index,
        factory: (_: unknown, ctx: ExecutionContext) => {
          const req = ctx.switchToHttp().getRequest();

          return req[CRUD_ROUTE_ARGS];
        },
        data,
        pipes,
      },
    };

    return obj;
  }
}
