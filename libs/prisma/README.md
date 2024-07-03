# Prisma

> Prisma 관련 packages

Nestjs에서 Prisma를 쉽게 이용하기 위한 Module입니다.

> ! 해당 패키지는 repository layer를 손쉽게 추가할 수 있도록 지원합니다. 현재 개발중이므로 예기치 못한 이슈가 발생할 수 있습니다. prisma와 repository에 대한 내용은 [여기](https://github.com/prisma/prisma/discussions/10584)를 참고해주세요.

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

Prisma를 RepositoryLayer를 통해 사용하고 싶다면 PrismaRepository를 extends하는 해당 모델의 repository를 선언합니다.

```ts
import { PrismaRepository } from '@/common/prisma/prisma.repository';
import { PrismaService } from '@/common/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserRepository extends PrismaRepository<Prisma.UserDelegate> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.user);
  }
}
```

`class-validator` `class-transformer`와 함께 사용하기 위해서는 `Entity`를 정의하고 Repository 생성자에 주입해줘야 합니다.

Entity는 PrismaEntity를 확장해야 하고 Prisma에서 구현된 User object를 implements 합니다.

```ts
import { PrismaEntity } from '@/common/prisma/prisma.entity';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

import { IsDate, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

@Exclude()
export class UserEntity extends PrismaEntity<User> implements User {
  @ApiProperty({ name: 'id' })
  @IsNotEmpty()
  @IsNumber()
  @Expose()
  id: number;

  @ApiProperty({ name: 'email' })
  @IsNotEmpty()
  @IsEmail()
  @Expose()
  email: string;

  @ApiProperty({ name: 'password' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ name: 'name' })
  @IsOptional()
  @IsString()
  @Expose()
  name: string;

  @ApiProperty({ name: 'createdAt' })
  @IsOptional()
  @IsDate()
  createdAt: Date;

  @ApiProperty({ name: 'updatedAt' })
  @IsOptional()
  @IsDate()
  updatedAt: Date;
}
```

이후 Repository 생성자에 Entity를 넘겨줍니다.

```ts
import { PrismaRepository } from '@/common/prisma/prisma.repository';
import { PrismaService } from '@/common/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserEntity } from './entites/users.entity';

@Injectable()
export class UserRepository extends PrismaRepository<Prisma.UserDelegate> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.user, UserEntity);
  }
}
```

### 참고

자세한 구현 내용은 [블로그 포스트](https://blog.ateals.me/posts/blog/Prisma%EB%A5%BC%20%EC%82%AC%EC%9A%A9%ED%95%B4%20Repository%20%ED%8C%A8%ED%84%B4%EC%9D%84%20%EA%B5%AC%ED%98%84%ED%95%98%EB%A9%B4%EC%84%9C)를 참고해주세요.
