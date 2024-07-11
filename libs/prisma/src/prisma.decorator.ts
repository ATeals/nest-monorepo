import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PRISMA_TRANSECTIONRUNNER } from './constant';

export const PrismaTransectionRunner = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();

  const runner = req[PRISMA_TRANSECTIONRUNNER];

  if (!runner) {
    throw new Error('The Prisma Transmission Runner must be used inside the PrismaTransectional Interceptor.');
  }

  return runner;
});
