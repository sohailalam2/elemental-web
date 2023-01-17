import { debug, Exception, serialize } from '@sohailalam2/abu';

import { EventController, EventListenerRegistration, EventOptions } from './';

export class ElementalComponentCustomEventHandlerIsNotDefined extends Exception {}

export class DefaultEventController<T extends HTMLElement> implements EventController {
  // map(event-name => handler-function-reference)
  private readonly eventListeners: Map<string, EventListenerRegistration> = new Map();

  constructor(private readonly component: T) {}

  public registerEventListeners(registrations: EventListenerRegistration[]): void {
    registrations.forEach(this.registerEventListener.bind(this));
  }

  public deregisterEventListeners(): void {
    for (const [eventListenerKey, reg] of this.eventListeners.entries()) {
      if (!reg || !reg.name || !reg.handler) {
        return;
      }
      const elementForEventListener = reg.isCustomEvent ? document : this.component;

      elementForEventListener.removeEventListener(reg.name, reg.handler, reg.options);
      this.eventListeners.delete(eventListenerKey);
      this.debug(`Removed EventListener ${eventListenerKey} => ${reg.handler.name}`);
    }
  }

  public raiseEvent<Payload = undefined>(name: string, isCustom?: boolean, payload?: Payload, options?: EventOptions) {
    const defaultOptions: EventOptions = { bubbles: true, cancelable: true, composed: true };

    const event: Event = isCustom
      ? new CustomEvent(name, {
          detail: payload ? serialize(payload) : undefined,
          ...{ ...defaultOptions, ...(options ?? options) },
        })
      : new Event(name, { ...defaultOptions, ...(options ?? options) });

    this.debug('Dispatching Event', event);
    this.component.dispatchEvent(event);
  }

  private registerEventListener(registration: EventListenerRegistration) {
    const { attachTo, handler, handlerName, isCustomEvent, name, options } = registration;

    const methodRef = this.validateAndGetBoundMethodHandler(handler, handlerName);

    const attachToElement = attachTo ?? this.component;
    const eventListenerKey = `[${attachToElement.tagName}][${attachToElement.id}][${name}][${methodRef.name}]`;

    if (this.eventListeners.has(eventListenerKey)) {
      this.debug(`Skipping duplicate registration ${eventListenerKey} => ${methodRef.name}`);

      return;
    }

    const eventOptions = { capture: true, ...(options || {}) };
    const elementForEventListener = isCustomEvent ? document : attachToElement;

    elementForEventListener.addEventListener(name, methodRef, eventOptions);

    this.eventListeners.set(eventListenerKey, {
      name,
      isCustomEvent,
      options: eventOptions,
      handler: methodRef,
      handlerName: methodRef.name,
    });

    this.debug(`Added EventListener ${eventListenerKey} => ${methodRef.name}`);
  }

  private validateAndGetBoundMethodHandler(handler: ((e: Event) => void) | undefined, handlerName: string | undefined) {
    if (!handler && !handlerName) {
      throw new ElementalComponentCustomEventHandlerIsNotDefined(handlerName);
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line security/detect-object-injection
    const methodRef = handler || (this.component[handlerName] as (e: Event) => void);

    if (!methodRef) {
      throw new ElementalComponentCustomEventHandlerIsNotDefined(handlerName);
    }

    return this.bindMethodIfNotBound(methodRef);
  }

  private bindMethodIfNotBound(func: (e: Event) => void) {
    const isBound = func.name.startsWith('bound ') && !Object.hasOwn(func, 'prototype');

    if (!isBound) {
      return func.bind(this.component);
    }

    return func;
  }

  private debug(message?: string, ...optionalParams: unknown[]) {
    debug(
      `[elemental-component][controller][${this.component.constructor.name}][id=${this.component.id}] ${message}`,
      ...optionalParams,
    );
  }
}
