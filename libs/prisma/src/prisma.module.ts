import { Global, Module, DynamicModule } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaRepository } from './prisma.repository';
import { PrismaModuleForRootOptions } from './interface';
import { PRISMA_SERVICE } from './constant';

@Global()
@Module({
  providers: [PrismaService, PrismaRepository],
  exports: [PrismaService, PrismaRepository],
})
export class PrismaModule {
  static forRoot({ service, global = true }: PrismaModuleForRootOptions): DynamicModule {
    return {
      module: PrismaModule,
      providers: [
        {
          provide: PRISMA_SERVICE,
          useValue: new service(),
        },
        PrismaRepository,
      ],
      exports: [PRISMA_SERVICE, PrismaRepository],
      global,
    };
  }
}
