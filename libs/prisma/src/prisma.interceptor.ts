import { CallHandler, ExecutionContext, Inject, NestInterceptor } from '@nestjs/common';
import { PRISMA_SERVICE, PRISMA_TRANSECTIONRUNNER } from './constant';
import { PrismaService } from './prisma.service';

import { catchError, tap } from 'rxjs';

export class PrismaTransectionalInterceptor implements NestInterceptor {
  constructor(@Inject(PRISMA_SERVICE) readonly prisma: PrismaService) {}

  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const req = context.switchToHttp().getRequest();

    const runner = await this.prisma.$begin();

    req[PRISMA_TRANSECTIONRUNNER] = runner;

    return next.handle().pipe(
      catchError(async (e) => {
        await runner.$rollback(e);
      }),
      tap(async () => {
        await runner.$commit();
      }),
    );
  }
}
