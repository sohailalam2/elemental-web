import * as crypto from 'crypto';
Object.defineProperty(globalThis, 'crypto', { value: { webcrypto: crypto.webcrypto } });

import { beforeEach, describe, expect, it } from 'vitest';

import { Magician, MagicianName, MagicianSuperPower, State } from './index';

describe('Magician', () => {
  let state: State;
  let magician: Magician;

  beforeEach(() => {
    state = State.from({
      name: MagicianName.from('Dr. Strange'),
      superpower: MagicianSuperPower.from('The Mystic Art'),
    });
    magician = new Magician({ state });
    document.body.appendChild(magician);
  });

  it('should initialize a magician', () => {
    expect(magician).toBeDefined();
    expect(magician.$state).toEqual(state);
  });

  it('should return the name element', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const el = magician.nameElement;

    expect(el).toBeDefined();
    expect(el).instanceof(HTMLParagraphElement);
  });

  it('should return the superpower element', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const el = magician.superpowerElement;

    expect(el).toBeDefined();
    expect(el).instanceof(HTMLParagraphElement);
  });

  it('should render a magician', () => {
    const name = magician.$root.querySelector('p[part=name]') as HTMLParagraphElement;
    const superpower = magician.$root.querySelector('p[part=superpower]') as HTMLParagraphElement;

    expect(name.textContent).toEqual(state.value.name.value);
    expect(superpower.textContent).toEqual(state.value.superpower.value);
  });
});
