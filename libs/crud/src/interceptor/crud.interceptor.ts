import { CallHandler, ExecutionContext, mixin, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { CRUD_ROUTE_ARGS } from '../constants';

export function CRUDRouteArgsInterceptor() {
  return mixin(CRUDInterceptor);
}
export class CRUDInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const req = context.switchToHttp().getRequest<Request>();

    const body = { ...req?.body, ...req?.query, ...req?.params };

    req[CRUD_ROUTE_ARGS] = await this.validateBody(body);

    return next.handle();
  }

  async validateBody(body: object) {
    return body;
  }

  parseError(error) {
    return error
      .filter((e) => !Object.keys(e.constraints).some((key) => ['hasDefault', 'primaryKey'].includes(key)))
      .map((e) => ({ property: e.property, error: [...Object.values(e.constraints)] }));
  }
}
