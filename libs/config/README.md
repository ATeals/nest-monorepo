# TypeSafeConfigModule

> nestjs에서 제공하는 config 모듈을 TypeSafe하게 래핑한 모듈

기존 `@nestjs/config`의 ConfigService는 리턴값을 제네릭으로, 인자를 string으로 타입추론하기 때문에 휴먼에러가 발생할 수 있습니다.

TypeSafeConfigModule은 래핑한 ConfigService를 사용하며 config의 key를 인자의 타입으로, 해당하는 value의 타입을 반환타입으로 추론합니다.

### 의존성

- `@nestjs/config`

### 기능

[블로그](https://blog.ateals.me/posts/blog/TypeSafe%ED%95%9C%20ConfigModule) TypeSafe한 ConfigModule

### 사용

사용처에서 config 객체를 반환하는 함수와 반환 타입을 선언합니다.

```ts
const config = () => ({
  port: process.env.PORT,
});

export type ENV = ReturnType<typeof config>;
```

TypeSafeConfigModule을 MainModule에 등록합니다.

> 기본적으로 TypeSafeConfigModule은 GlobalModule입니다 설정에서 변경 가능합니다.

```ts
@Module({
  imports: [TypeSafeConfigModule.forRoot({ config, isGlobal: true }), PrismaModule],
  controllers: [MainController],
  providers: [MainService],
})
export class MainModule {}
```

사용하고 싶은 위치에서 TypeSafeService에 ENV 타입을 제네릭으로 주입하여 사용합니다.

```ts
@Controller()
export class MainController {
  constructor(private readonly config: TypeSafeConfigService<ENV>) {}

  @Get('/port')
  getPort() {
    return this.config.get('port');
  }
}
```
