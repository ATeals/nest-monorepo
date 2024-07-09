# generateDispatchTableFn

generateDispatchTableFn은 함수 디스패치 테이블을 생성하고, 이를 통해 동적으로 함수를 호출할 수 있도록 하는 유틸리티 함수입니다. 이 함수는 타입스크립트를 사용하여 함수의 타입 안전성을 보장합니다.

> [디스패치 테이블](https://ko.wikipedia.org/wiki/%EB%94%94%EC%8A%A4%ED%8C%A8%EC%B9%98_%ED%85%8C%EC%9D%B4%EB%B8%94)이란?

```ts
const [
  // 디스패치 테이블 함수
  dispatchTableFn,
  // 디스패치 테이블의 key를 검증하는 함수
  isDispatchTableKey,
] = generateDispatchTableFn(table);

dispatchTableFn(
  key, // table의 key
  ...args, // table의 key에 해당하는 function의 매개변수
);

isDispatchTableKey(key);
```

## 예제

계산을 위한 disPatchTable을 선언한 뒤 `generateDispatchTableFn`의 인자로 넘겨줍니다.

```ts
const calculator = {
  add: (a: number, b: number) => a + b,
  sub: (a: number, b: number) => a - b,
  mul: (a: number, b: number) => a * b,
  div: (a: number, b: number) => a / b,
};

const [cal, isCalKey] = generateDispatchTableFn(calculator);
```

이제 타입 안정성을 보장하는 cal함수와 key를 검증하는 isCalKey함수를 사용할 수 있습니다.

```ts
cal('add', 1, 2); // 3
cal('sub', 1, 2); // -1
cal('mul', 1, 2); // 2
cal('div', 1, 2); // 0.5
```

조건문을 추가할때는 다음과 같이 사용할 수 있습니다.

```ts
const result = { add: 0, sub: 0, mul: 0, div: 0 };

for (const key in Object.keys(result)) {
  if (isCalcKey(key)) {
    result[key] = calc(key, 1, 2);
  }
}
```
