import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TypeSafeConfigService } from './config.service';
import { config } from './config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
  ],
  providers: [TypeSafeConfigService],
  exports: [TypeSafeConfigService],
})
export class TypeSafeConfigModule {}
