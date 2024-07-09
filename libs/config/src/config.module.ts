import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeSafeConfigService } from './config.service';

interface DynamicModuleOptions {
  config: () => Record<string, any>;
  isGlobal?: boolean;
}
@Global()
@Module({})
export class TypeSafeConfigModule {
  static forRoot({ config, isGlobal = true }: DynamicModuleOptions): DynamicModule {
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
      global: isGlobal,
    };
  }
}
