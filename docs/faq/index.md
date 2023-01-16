# FAQ

## Enable Debugging

Debug logs can be enabled by globally exposing a truthy value for `__ABU_DEBUG__`

## Failing Tests - TypeError `webcrypto`

> My tests are failing because of a cryptic error message:
> `TypeError: Cannot read properties of undefined (reading 'webcrypto')`

Abu uses 'webcrypto' implementation to generate random numbers that are then used by the [id-generators](https://sohailalam2.github.io/abu/id-generators/).
Unfortunately, many test environments do not provide an implementation for the same. However, we can easily define it as follows:

```ts
// in some spec.ts file

import crypto from 'crypto';

Object.defineProperty(globalThis, 'crypto', {
  value: { webcrypto: crypto.webcrypto },
});
```
