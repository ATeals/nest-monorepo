import { Global, Module, DynamicModule } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaRepository } from './prisma.repository';

@Global()
@Module({
  providers: [PrismaService, PrismaRepository],
  exports: [PrismaService, PrismaRepository],
})
export class PrismaModule {
  static forRoot({ service }: { service: new () => PrismaService }): DynamicModule {
    return {
      module: PrismaModule,
      providers: [
        {
          provide: PrismaService,
          useValue: new service(),
        },
        PrismaRepository,
      ],
      exports: [PrismaService, PrismaRepository],
    };
  }
}
