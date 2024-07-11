import { HttpException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

type Constructor = new (...args: any[]) => any;

export type PrismaTransectionRunnerType<T> = T & {
  $commit: () => Promise<void>;
  $rollback: (error: Error | HttpException) => Promise<void>;
};

export function withTransection<T extends Constructor>(prismaClient: T) {
  return class extends prismaClient {
    async $begin() {
      const prisma = Prisma.getExtensionContext(this);

      let setTxClient: (txClient: Prisma.TransactionClient) => void;
      let commit: () => void;
      let rollback: (...arg: any[]) => void;

      // a promise for getting the tx inner client
      const txClient = new Promise<Prisma.TransactionClient>((res) => {
        setTxClient = (txClient) => res(txClient);
      });

      // a promise for controlling the transaction
      const txPromise = new Promise((_res, _rej) => {
        commit = () => _res(undefined);
        rollback = (error) => _rej(error);
      });

      // opening a transaction to control externally
      if ('$transaction' in prisma && typeof prisma.$transaction === 'function') {
        const tx = prisma.$transaction((txClient) => {
          setTxClient(txClient as unknown as Prisma.TransactionClient);

          return txPromise.catch((e) => {
            if (e instanceof HttpException || e instanceof Error) throw e;

            throw new Error(`[Transaction was ROLLBACK]`);
          });
        });

        // return a proxy TransactionClient with `$commit` and `$rollback` methods
        return new Proxy(await txClient, {
          get(target, prop) {
            if (prop === '$commit') {
              return () => {
                commit();
                return tx;
              };
            }
            if (prop === '$rollback') {
              return (error) => {
                console.log(error);
                rollback(error);
                return tx;
              };
            }
            return target[prop as keyof typeof target];
          },
        }) as PrismaTransectionRunnerType<InstanceType<T>>;
      }

      throw new Error('Transactions are not supported by this client');
    }
  };
}
