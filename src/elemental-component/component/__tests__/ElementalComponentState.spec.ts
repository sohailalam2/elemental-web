// we need to define webcrypto because Abu uses it to generate the random numbers
// and this is not available in the simulated DOM test environment
import crypto from 'crypto';
import { beforeEach, describe, expect, it } from 'vitest';

Object.defineProperty(globalThis, 'crypto', { value: { webcrypto: crypto.webcrypto } });

import { ElementalComponentState, MustOverrideStaticDefaultStateMethodException } from '../ElementalComponentState';
import { ValueObject } from '@sohailalam2/abu';

describe('ElementalComponentState', () => {
  const MY_STRING_VALUE = 'Hello World!';
  const MY_NUMBER_VALUE = 100;

  interface ComplexStateData {
    message: string;
    value: number;
  }

  class NumberState extends ElementalComponentState<number> {}

  class StateDoesNotOverrideDefault extends ElementalComponentState<ComplexStateData> {}

  class StateOverridesDefault extends ElementalComponentState<ComplexStateData> {
    static defaultState<Type, K extends ValueObject<Type>>(): K {
      return ValueObject.from<ComplexStateData>({
        message: MY_STRING_VALUE,
        value: MY_NUMBER_VALUE,
      }) as K;
    }
  }

  let myNumberState: ElementalComponentState<number>;

  beforeEach(() => {
    myNumberState = NumberState.from(MY_NUMBER_VALUE);
  });

  it('should be defined', () => {
    expect(myNumberState).toBeDefined();
    expect(myNumberState.value).toEqual(MY_NUMBER_VALUE);
  });

  it('should throw MustOverrideStaticDefaultStateMethodException', () => {
    expect(() => StateDoesNotOverrideDefault.deserialize('')).toThrow(MustOverrideStaticDefaultStateMethodException);
  });

  it('should deserialize the default value', () => {
    const state: StateOverridesDefault = StateOverridesDefault.deserialize('');

    expect(state).toBeDefined();
    expect(state.value.message).toEqual(MY_STRING_VALUE);
    expect(state.value.value).toEqual(MY_NUMBER_VALUE);
  });
});
