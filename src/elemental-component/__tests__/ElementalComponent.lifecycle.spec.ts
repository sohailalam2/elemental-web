/* eslint-disable  @typescript-eslint/ban-ts-comment, no-console, max-classes-per-file */
import { describe, expect, it, vi } from 'vitest';

import { ElementalComponentOptions } from '../types';
import { ElementalComponent } from '../component/ElementalComponent';

// we need to define webcrypto because Abu uses it to generate the random numbers
// and this is not available in the simulated DOM test environment
import crypto from 'crypto';

Object.defineProperty(globalThis, 'crypto', { value: { webcrypto: crypto.webcrypto } });

describe('ElementalComponent Lifecycle Hooks', () => {
  abstract class MyComponent extends ElementalComponent {
    constructor(options?: ElementalComponentOptions) {
      super(options);
    }

    protected render() {
      // do nothing
    }
  }

  it('should invoke lifecycle hook connectedCallback', () => {
    class MyConnectedComponent extends MyComponent {
      public connectedCallback() {
        super.connectedCallback();
      }
    }

    ElementalComponent.register(MyConnectedComponent);
    const component = new MyConnectedComponent();
    const mock = vi.fn();

    vi.spyOn(component, 'connectedCallback').mockImplementation(mock);
    document.body.appendChild(component);

    expect(mock).toHaveBeenCalledOnce();
  });

  it('should invoke lifecycle hook disconnectedCallback', () => {
    class MyDisconnectedComponent extends MyComponent {
      protected disconnectedCallback() {
        super.disconnectedCallback();
        this.doSomething();
      }

      public doSomething() {
        // do something
      }
    }

    ElementalComponent.register(MyDisconnectedComponent);
    const component = new MyDisconnectedComponent();
    const mock = vi.fn();

    vi.spyOn(component, 'doSomething').mockImplementation(mock);
    document.body.appendChild(component);
    component.remove();

    expect(mock).toHaveBeenCalledOnce();
  });

  it('should invoke lifecycle hook attributeChangedCallback', () => {
    class MyComponentAttributeChange extends MyComponent {
      static get observedAttributes(): string[] {
        return super.observedAttributes.concat(['state']);
      }

      public attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null) {
        super.attributeChangedCallback(name, oldVal, newVal);
      }
    }

    ElementalComponent.register(MyComponentAttributeChange);
    const component = new MyComponentAttributeChange();
    const mock = vi.fn();

    vi.spyOn(component, 'attributeChangedCallback').mockImplementation(mock);
    document.body.appendChild(component);
    component.setAttribute('state', 'updated');

    expect(mock).toHaveBeenCalledOnce();
  });
});
