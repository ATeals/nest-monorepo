# CRUD

Nest에서 `@module/prisma`에서 제공하는 `PrismaRepository`와 `PrismaEntity`를 이용해 자동으로 CRUD에 해당하는 메서드를 생성해줍니다.

### 의존성

- `@module/prisma`
- `@nestjs/swagger`
- `class-transformer`
- `class-validator`

### 기능

```ts
@CRUD({
  entity: TodoEntity,
})
@Controller('/todo')
export class TodoController {
  constructor(private readonly service: TodoRepository) {}
}
```

`@CRUD()` 데코레이터는 옵션으로 entity를 받습니다. entity는 Prisma Model을 구현한 `class`입니다.

`@CRUD()` 데코레이터를 적용한 contoroller는 해당 Entity의 Repository class인 `service`를 주입받아야 합니다. (! 이때 해당 프로퍼티의 이름은 꼭 `service`이어야 합니다.)
