import { UnprocessableEntityException, mixin } from '@nestjs/common';
import { PickType } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CRUDInterceptor } from './crud.interceptor';
import { CRUDOptions } from '../crud.type';

export function OnlyParamsRouteInterceptor(crudOptions?: CRUDOptions, primaryKey?: string) {
  class Interceptor extends CRUDInterceptor {
    constructor() {
      super();
    }

    override async validateBody(body: object) {
      const transformd = plainToInstance(PickType(crudOptions?.entity, [primaryKey]), body);

      const errorList = await validate(transformd, { whitelist: true });

      const error = errorList.map((e) => ({ property: e.property, error: [...Object.values(e.constraints)] }));

      if (error.length > 0) {
        throw new UnprocessableEntityException(error);
      }

      return transformd;
    }
  }

  return mixin(Interceptor);
}
