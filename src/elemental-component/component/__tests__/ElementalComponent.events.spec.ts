/* eslint-disable  @typescript-eslint/ban-ts-comment, no-console, max-classes-per-file, no-magic-numbers */
/* eslint-disable  @typescript-eslint/no-unused-vars */
import { describe, expect, it, vi } from 'vitest';

import { ElementalComponentOptions } from '../../types';
import { ElementalComponent } from '../ElementalComponent';

// we need to define webcrypto because Abu uses it to generate the random numbers
// and this is not available in the simulated DOM test environment
import crypto from 'crypto';

Object.defineProperty(globalThis, 'crypto', { value: { webcrypto: crypto.webcrypto } });

describe('ElementalComponent Events', () => {
  abstract class MyComponent extends ElementalComponent {
    constructor(options?: ElementalComponentOptions) {
      super(options);
    }

    protected render() {
      // do nothing
    }
  }

  it('should register event listeners during instantiation', () => {
    class MyComponentInstanceWithEvents extends MyComponent {
      constructor() {
        super({ eventHandlers: [{ name: 'click', handlerName: 'onClick' }] });
      }

      onClick(_: Event): void {
        // do something
      }
    }

    ElementalComponent.register(MyComponentInstanceWithEvents);
    const component = new MyComponentInstanceWithEvents();

    // @ts-ignore
    expect(component.eventController.eventListeners.size).toEqual(1);
  });

  it('should register event listeners explicitly', () => {
    class MyComponentRegistersListenersExplicitly extends MyComponent {
      onClick(_: Event): void {
        // do something
      }
    }

    ElementalComponent.register(MyComponentRegistersListenersExplicitly);
    const component = new MyComponentRegistersListenersExplicitly();

    component.registerEventListeners([{ name: 'click', handlerName: 'onClick' }]);

    // @ts-ignore
    expect(component.eventController.eventListeners.size).toEqual(1);
  });

  it('should be able to handle normal events', () => {
    const mock = vi.fn();

    class MyComponentInstanceWithNormalEvent extends MyComponent {
      constructor() {
        super({ eventHandlers: [{ name: 'click', handlerName: 'onClick' }] });
      }

      onClick(_: Event): void {
        mock.call(vi);
      }
    }

    ElementalComponent.register(MyComponentInstanceWithNormalEvent);
    const component = new MyComponentInstanceWithNormalEvent();

    component.click();

    expect(mock).toHaveBeenCalledOnce();
  });

  it('should be able to raise and handle normal events', () => {
    const mock = vi.fn();

    class MyComponentInstanceWithNormalEventRaised extends MyComponent {
      constructor() {
        super({ eventHandlers: [{ name: 'click', handlerName: 'onClick' }] });
      }

      onClick(_: Event): void {
        mock.call(vi);
      }
    }

    ElementalComponent.register(MyComponentInstanceWithNormalEventRaised);
    const component = new MyComponentInstanceWithNormalEventRaised();

    component.raiseEvent('click');

    expect(mock).toHaveBeenCalledOnce();
  });

  it('should be able to raise and handle normal events with options', () => {
    const mock = vi.fn();

    class MyComponentInstanceWithNormalEventRaisedWithOptions extends MyComponent {
      constructor() {
        super({ eventHandlers: [{ name: 'click', handlerName: 'onClick' }] });
      }

      onClick(_: Event): void {
        mock.call(vi);
      }
    }

    ElementalComponent.register(MyComponentInstanceWithNormalEventRaisedWithOptions);
    const component = new MyComponentInstanceWithNormalEventRaisedWithOptions();

    component.raiseEvent('click', { bubbles: false });

    expect(mock).toHaveBeenCalledOnce();
  });

  it('should be able to raise custom events', () => {
    const mock = vi.fn();

    class MyComponentInstanceWithCustomEvent extends MyComponent {
      constructor() {
        super({ eventHandlers: [{ name: 'custom-event', isCustomEvent: true, handlerName: 'customHandler' }] });
      }

      customHandler(_: Event): void {
        mock.call(vi);
      }
    }

    ElementalComponent.register(MyComponentInstanceWithCustomEvent);
    const component = new MyComponentInstanceWithCustomEvent();

    document.body.appendChild(component);

    component.raiseEvent('custom-event', true);

    expect(mock).toHaveBeenCalled();
  });

  it('should be able to raise custom events with options', () => {
    const mock = vi.fn();

    class MyComponentInstanceWithCustomEventWithOptions extends MyComponent {
      constructor() {
        super({ eventHandlers: [{ name: 'custom-event', isCustomEvent: true, handlerName: 'customHandler' }] });
      }

      customHandler(_: Event): void {
        mock.call(vi);
      }
    }

    ElementalComponent.register(MyComponentInstanceWithCustomEventWithOptions);
    const component = new MyComponentInstanceWithCustomEventWithOptions();

    document.body.appendChild(component);

    component.raiseEvent('custom-event', true, { bubbles: false });

    expect(mock).toHaveBeenCalled();
  });
});
