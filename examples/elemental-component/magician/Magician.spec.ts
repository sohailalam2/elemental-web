import { beforeEach, describe, expect, it } from 'vitest';
import * as crypto from 'crypto';

Object.defineProperty(globalThis, 'crypto', { value: { webcrypto: crypto.webcrypto } });

import { Magician, MagicianName, State, MagicianSuperPower } from './index';

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
    const html = `
<section>
  <p slot="name" part="name">${state.value.name.value}</p>
  <p slot="superpower" part="superpower">${state.value.superpower.value}</p>
</section>`;

    expect(magician.$root.innerHTML.trim()).toEqual(html.trim());
  });
});
