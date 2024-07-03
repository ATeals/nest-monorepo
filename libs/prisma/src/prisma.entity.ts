export class PrismaEntity<T> {
  constructor(data: Partial<T>) {
    Object.assign(this, data);
  }
}
