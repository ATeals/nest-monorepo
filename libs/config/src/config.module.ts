import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeSafeConfigService } from './config.service';

@Global()
@Module({})
export class TypeSafeConfigModule {
  static forRoot(config: () => { [key: string]: any }): DynamicModule {
    return {
      module: TypeSafeConfigModule,
      providers: [TypeSafeConfigService],
      exports: [TypeSafeConfigService],
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [config],
        }),
      ],
    };
  }
}
