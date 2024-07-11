# PrismaTransaction

> ! beta 프로덕션에서 사용시 주의해야합니다.

## PrismaTransactionInterceptor : Controller Decorator

Prisma에서 제공하는 [extenstion](https://github.com/prisma/prisma-client-extensions/tree/main/callback-free-itx)을 활용해 구현한 TrasnactionInterCeptor입니다.

인터셉터를 통해 해당 요청 객체에 Transcation을 위한 runner를 제공합니다.

## 사용법

Transaction 확장을 위해 PrismaService가 PrismaClient를 확장하는 대신 withTransaction 함수를 통해 확장합니다.

```ts
import { withTransection } from '@modules/prisma';

@Injectable()
export class PrismaService extends withTransection(PrismaClient) implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({ log: ['query'] });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

Transaction을 사용할 컨트롤러 메서드에서 인터셉터를 선언하고 runner를 받습니다.

```ts
import { PrismaService } from './PrismaService';
import { PRISMA_SERVICE, PrismaTransectionRunner } from '@modules/prisma';
import { PrismaTransectionalInterceptor } from '@modules/prisma/prisma.interceptor';

 @Get('/test')
  @UseInterceptors(PrismaTransectionalInterceptor)
  async test(@PrismaTransectionRunner() tx: PrismaService) {
    const user = await this.userRepository.create({...}, tx.user);

    return user;
  }
```

PrismaRepository에 두번째 인자로 runner를 제공받을 수 있습니다. runner를 전달하면 기존의 PrismaClient대신 runner를 이용해 쿼리를 수행합니다.

컨트롤러에서 에러가 throw되면 transaction이 rollback됩니다.

또한 컨트롤러에 에러 인스턴스 타입에 대해 요청 타입이 달라집니다.

- Nest에서 제공하는 HttpException타입 throw시 => HttpException을 응답으로 제공합니다.
- 기본 Error타입 throw시 => Error를 응답으로 제공합니다.
- 그 외는 500 error를 응답으로 제공합니다.

## Async Local Storage Transcational Decorator

[Async Local Storage](https://docs.nestjs.com/recipes/async-local-storage), [nestjs-cls](https://docs.nestjs.com/recipes/async-local-storage#nestjs-cls) 를 활용해 Service Provider에서 사용가능한 `@Transactional()` 데코레이터를 제공할 예정입니다.
