export interface PrismaDelegate {
  aggregate(data: any): any;
  count(data: any): any;
  create(data: any): any;
  delete(data: any): any;
  deleteMany(data: any): any;
  findFirst(data: any): any;
  findMany(data: any): any;
  findUnique(data: any): any;
  update(data: any): any;
  updateMany(data: any): any;
  upsert(data: any): any;
}

export class PrismaRepository<D extends PrismaDelegate> implements PrismaDelegate {
  constructor(protected delegate: D, protected entity?: new (data: any) => any) {
    return new Proxy(this, {
      get: function (target, prop) {
        const origMethod = target[prop];

        if (typeof origMethod !== 'function' || prop === 'getDelegate' || !target.entity) {
          return origMethod;
        }

        return async function (...args) {
          const result = await origMethod.apply(target, args);
          return target.responseSerializer(result);
        };
      },
    });
  }

  public responseSerializer(data: any) {
    if (Array.isArray(data)) {
      return data.map((item) => new this.entity(item));
    } else {
      return new this.entity(data);
    }
  }

  public getDelegate(): D {
    return this.delegate;
  }

  aggregate(data: Parameters<D['aggregate']>[0]): ReturnType<D['aggregate']> {
    return this.getDelegate().aggregate(data);
  }

  count(data: Parameters<D['count']>[0]): ReturnType<D['count']> {
    return this.getDelegate().count(data);
  }

  create(data: Parameters<D['create']>[0]): ReturnType<D['create']> {
    return this.getDelegate().create(data);
  }

  delete(data: Parameters<D['delete']>[0]): ReturnType<D['delete']> {
    return this.getDelegate().delete(data);
  }

  deleteMany(data: Parameters<D['deleteMany']>[0]): ReturnType<D['deleteMany']> {
    return this.getDelegate().deleteMany(data);
  }

  findFirst(data: Parameters<D['findFirst']>[0]): ReturnType<D['findFirst']> {
    return this.getDelegate().findFirst(data);
  }

  async findMany(data: Parameters<D['findMany']>[0]): Promise<ReturnType<D['findMany']>> {
    return await this.getDelegate().findMany(data);
  }

  findUnique(data: Parameters<D['findUnique']>[0]): ReturnType<D['findUnique']> {
    return this.getDelegate().findUnique(data);
  }

  update(data: Parameters<D['update']>[0]): ReturnType<D['update']> {
    return this.getDelegate().update(data);
  }

  updateMany(data: Parameters<D['updateMany']>[0]): ReturnType<D['updateMany']> {
    return this.getDelegate().updateMany(data);
  }

  upsert(data: Parameters<D['upsert']>[0]): ReturnType<D['upsert']> {
    return this.getDelegate().upsert(data);
  }
}
