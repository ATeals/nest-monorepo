import { UnprocessableEntityException, mixin } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CRUDInterceptor } from './crud.interceptor';
import { CRUDOptions } from '../crud.type';
import { excludeDecoratorsFromErrorFilter } from './utils';
import { DECORATORS_NAME_HASDEFALUT, DECORATORS_NAME_PRIMARYKEY } from '../decorator';

export function CreateRouteArgInterceptor(crudOptions?: CRUDOptions) {
  class Interceptor extends CRUDInterceptor {
    constructor() {
      super();
    }

    override async validateBody(body: object) {
      const transformd = plainToInstance(crudOptions?.entity, body);

      const errorList = await validate(transformd, { whitelist: true });

      const error = errorList
        .filter((e) => excludeDecoratorsFromErrorFilter(e, [DECORATORS_NAME_HASDEFALUT, DECORATORS_NAME_PRIMARYKEY]))
        .map((e) => ({ property: e.property, error: [...Object.values(e.constraints)] }));

      if (error.length > 0) {
        throw new UnprocessableEntityException(error);
      }

      return transformd;
    }
  }

  return mixin(Interceptor);
}
