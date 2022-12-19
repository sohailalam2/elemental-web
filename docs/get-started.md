<section>
  <br />
  <a href="https://sohailalam2.github.io/elemental-web/" target="_blank" rel="noopener noreferrer">
    <img width="64" src="/logo.svg" alt="Abu Logo">
  </a>
  <h1>Elemental Web</h1>
  <p>Modern web technologies in a nutshell 😍</p>
  <br />
</section>

# Getting Started

## 💻 Installation

```bash
$ npm install @sohailalam2/elemental-web
```

## Debug

Debug logs can be enabled by globally exposing a truthy value for `__ABU_DEBUG__`

## ☝️ Minimum Requirements

### Browsers

- All modern browsers
- NOT Internet Explorer

### NodeJs > v16

`@sohailalam2/abu` uses the `crypto` module and specifically the `crypto.webcrypto` object for its random number
generation.
This is only available on Node v16+.

#### Failing Tests - TypeError `webcrypto`

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
