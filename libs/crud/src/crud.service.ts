import { PrismaDelegate, PrismaRepository } from '@modules/prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CrudService<T extends PrismaDelegate> {
  constructor(protected repository: PrismaRepository<T>) {}

  create(data: Parameters<T['create']>[0]['data']): ReturnType<T['create']> {
    return this.repository.create({ data });
  }

  findOne(id: number) {
    return this.repository.findUnique({ where: { id } });
  }

  findMany(filter: Parameters<T['create']>[0]['where'], page = 1, limit = 10) {
    const data = this.repository.findMany({
      where: filter,
      take: limit,
      skip: (page - 1) * limit,
    });

    return data;
  }

  update(id: number, data: Parameters<T['update']>[0]['data']) {
    return this.repository.update({
      where: { id },
      data,
    });
  }

  delete(id: number) {
    return this.repository.delete({
      where: { id },
    });
  }

  // bulkInsert(data: Parameters<T['create']>[0]['data'][]) {
  //   const promises = data.map((item) => this.repository.create(item));
  //   return Promise.all(promises);
  // }
}
