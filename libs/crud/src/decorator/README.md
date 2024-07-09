# CRUD Decorator

CRUD 패키지에서 사용하는 데코레이터입니다.

## CRUD

Controller에 `@CRUD()` 데코레이터 선언시 Prisma entity 기준으로 다음 메서드들을 제공합니다.

- `GET /`
- `POST /`
- `PATCH /{param}`
- `DELETE /{param}`
- `GET /{param}`

### 사용법

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

`@CRUD()` 데코레이터의 옵션은 다음과 같습니다.

```ts
export interface CRUDOptions {
  // enableMethods 제공시 enableMethods에 포함된 메서드만 생성됩니다.
  enableMethods?: (keyof typeof METHODS)[];
  // 해당 controller에서 제공할 Entity 입니다.
  entity?: new (...args: any[]) => any;
  // 메서드를 확장 가능합니다.
  methods?: { [P in keyof typeof METHODS]?: MethodOptions };
}

export interface MethodOptions {
  // 메서드에 데코레이터를 추가합니다.
  decorators?: Array<PropertyDecorator | MethodDecorator>;
  // 메서드에 인터셉터를 추가합니다.
  interceptors?: Array<Type<NestInterceptor>>;
}
```

## Entity 데코레이터

Prisma는 다른 ORM들과 다르게 class가 아닌 Object 리터럴로 관리합니다. 따라서 class Entity를 위한 여러 데코레이터를 제공합니다. 이를 통해 dto의 자동 생성, 검증, 변환이 가능합니다.

### @PrimaryKey()

해당 데코레이터는 Prisma에서 id로 제공하는 프로퍼티를 명시합니다. `@PrimaryKey()`를 할당한 프로퍼티가 http method의 파라미터로 적용됩니다.

```prisma
model User {
  id        String   @id @default(cuid())
  name      String
}
```

다음과 같은 모델을 매핑합니다.

```ts
export class UserEntity extends PrismaEntity<User> implements User {
  @PrimaryKey()
  id: string;

  name: string;
}
```

### @HasDefault()

Prisma에서 default값을 제공하는 프로퍼티를 명시합니다.

```prisma
model User {
  id    String @id @default(cuid())
  name  String
  level Int    @default(0)
}
```

다음과 같은 모델을 매핑합니다.

```ts
export class UserEntity extends PrismaEntity<User> implements User {
  @PrimaryKey()
  id: string;

  name: string;

  @HasDefault()
  level: Number;
}
```

`@HasDefault()`가 제공된 프로퍼티는 createDto validation에서 제외됩니다.

### @Column()

위에서 언급한 데코레이터를 함축해 사용할 수 있습니다.

`@Column()` 데코레이터는 다음과 같은 옵션을 받을 수 있습니다.

```ts
export interface ColumnOptions {
  // transFormFn : @TransForm() 데코레이터에 해당하는 callback을 받습니다.
  // 암시적 형변환 대신 사용자가 직접 형변환 할 수 있습니다.
  transFormFn?: (params: TransformFnParams) => void;
  // 다른 데코레이터를 포함합니다.
  decorators?: Array<PropertyDecorator | MethodDecorator>;
  // @PrimaryKey()를 선언합니다.
  isPrimaryKey?: boolean;
  // @HasDefault()를 선언합니다.
  hasDefalut?: boolean;
  // @Type() 데코레이터를 사용합니다.
  type?: (type?: TypeHelpOptions) => AnyFunction;
}
```
