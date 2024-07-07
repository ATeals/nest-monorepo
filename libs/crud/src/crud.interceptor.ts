import { CallHandler, ExecutionContext, mixin, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CRUD_ROUTE_ARGS } from './constants';
import { Request } from 'express';

export function CRUDRouteArgsInterceptor() {
  class MixinInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
      const req = context.switchToHttp().getRequest<Request>();

      req[CRUD_ROUTE_ARGS] = { body: req?.body, query: req?.query, params: req?.params };

      return next.handle();
    }
  }

  return mixin(MixinInterceptor);
}
