import { UnprocessableEntityException, mixin } from '@nestjs/common';
import { PartialType } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CRUDInterceptor } from './crud.interceptor';
import { excludeDecoratorsFromErrorFilter } from './utils';
import { DECORATORS_NAME_PRIMARYKEY } from '../decorator';
import { CRUDOptions } from '../crud.type';

export function UpdateRouteArgInterceptor(crudOptions?: CRUDOptions) {
  class Interceptor extends CRUDInterceptor {
    constructor() {
      super();
    }

    override async validateBody(body: object) {
      const transformd = plainToInstance(PartialType(crudOptions?.entity), body);

      const errorList = await validate(transformd, { whitelist: true });

      const error = errorList
        .filter((e) => excludeDecoratorsFromErrorFilter(e, [DECORATORS_NAME_PRIMARYKEY]))
        .map((e) => ({ property: e.property, error: [...Object.values(e.constraints)] }));

      if (error.length > 0) {
        throw new UnprocessableEntityException(error);
      }

      return transformd;
    }
  }

  return mixin(Interceptor);
}
