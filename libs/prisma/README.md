# Prisma

> Prisma 관련 packages

### 의존성

- `@prisma/client`

### 사용

`@prisma/client` 의존성을 추가합니다. 이후 `npx prisma init` 명령어를 실행합니다.

사용처에서 PrismaService를 구현합니다.

> ! 사용처에서 PrismaClient를 extends한 PrismaService를 사용해야 정상적으로 model에 대한 쿼리가 생성됩니다.

```ts
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

Module에 PrismaModule을 추가합니다.

```ts
@Module({
  imports: [PrismaModule.forRoot({ service: PrismaService })],
  controllers: [MainController],
  providers: [MainService],
})
export class MainModule {}
```

자세한 구현 내용은 [블로그 포스트](https://blog.ateals.me/posts/blog/Prisma%EB%A5%BC%20%EC%82%AC%EC%9A%A9%ED%95%B4%20Repository%20%ED%8C%A8%ED%84%B4%EC%9D%84%20%EA%B5%AC%ED%98%84%ED%95%98%EB%A9%B4%EC%84%9C)를 참고해주세요.
