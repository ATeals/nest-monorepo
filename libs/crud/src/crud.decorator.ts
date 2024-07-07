import { CRUDFactory } from './crud.factory';
import { Constructor, CRUDOptions } from './crud.type';

export const CRUD =
  (options?: CRUDOptions) =>
  <T extends Constructor>(target: T) => {
    const crudRouteFactory = new CRUDFactory(target, options);

    crudRouteFactory.init();

    const ValidatedController = class extends target {
      constructor(...args: any[]) {
        super(...args);
      }
    };

    Object.defineProperty(ValidatedController, 'name', { value: target.name });

    return ValidatedController;
  };
