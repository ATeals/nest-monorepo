type AnyFunction = (...args: any[]) => any;

type FunctionMap = {
  [key: string]: AnyFunction;
};

export function generateDispatchTableFn<T extends FunctionMap>(dispatchTable: T) {
  function dispatchTableFn<K extends keyof T>(key: K, ...args: Parameters<T[K]>): ReturnType<T[K]> {
    const func = dispatchTable[key];
    return func(...args);
  }

  function isDispatchTableKey(key: PropertyKey): key is keyof T {
    return key in dispatchTable;
  }

  return [dispatchTableFn, isDispatchTableKey] as const;
}

export const isMapsKey = <T extends Record<string, any>>(dispatchTable: T, key: PropertyKey): key is keyof T =>
  key in dispatchTable;
