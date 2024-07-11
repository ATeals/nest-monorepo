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

type Constructor = new (...args: any[]) => any;

export class PrismaRepository<D extends PrismaDelegate> implements PrismaDelegate {
  protected runner: D | null = null;

  constructor(protected delegate: D, protected entity?: Constructor) {
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

  aggregate(data: Parameters<D['aggregate']>[0], runner?: D): ReturnType<D['aggregate']> {
    return (runner || this.getDelegate()).aggregate(data);
  }

  count(data: Parameters<D['count']>[0], runner?: D): ReturnType<D['count']> {
    return (runner || this.getDelegate()).count(data);
  }

  create(data: Parameters<D['create']>[0], runner?: D): ReturnType<D['create']> {
    return (runner || this.getDelegate()).create(data);
  }

  delete(data: Parameters<D['delete']>[0], runner?: D): ReturnType<D['delete']> {
    return (runner || this.getDelegate()).delete(data);
  }

  deleteMany(data: Parameters<D['deleteMany']>[0], runner?: D): ReturnType<D['deleteMany']> {
    return (runner || this.getDelegate()).deleteMany(data);
  }

  findFirst(data: Parameters<D['findFirst']>[0], runner?: D): ReturnType<D['findFirst']> {
    return (runner || this.getDelegate()).findFirst(data);
  }

  async findMany(data: Parameters<D['findMany']>[0], runner?: D): Promise<ReturnType<D['findMany']>> {
    return await (runner || this.getDelegate()).findMany(data);
  }

  findUnique(data: Parameters<D['findUnique']>[0], runner?: D): ReturnType<D['findUnique']> {
    return (runner || this.getDelegate()).findUnique(data);
  }

  update(data: Parameters<D['update']>[0], runner?: D): ReturnType<D['update']> {
    return (runner || this.getDelegate()).update(data);
  }

  updateMany(data: Parameters<D['updateMany']>[0], runner?: D): ReturnType<D['updateMany']> {
    return (runner || this.getDelegate()).updateMany(data);
  }

  upsert(data: Parameters<D['upsert']>[0], runner?: D): ReturnType<D['upsert']> {
    return (runner || this.getDelegate()).upsert(data);
  }
}
