import { debug, Exception, serialize } from '@sohailalam2/abu';

import { EventListenerRegistration, EventOptions, EventController } from './';

export class ElementalComponentCustomEventHandlerIsNotDefined extends Exception {}

export class DefaultEventController<T extends HTMLElement> implements EventController {
  // map(event-name => handler-function-reference)
  private readonly eventListeners: Map<string, EventListenerRegistration> = new Map();

  constructor(private readonly component: T) {}

  private static isBound(func: unknown): boolean {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return func.name.startsWith('bound ') && !Object.hasOwn(func, 'prototype');
  }

  public registerEventListeners(registrations: EventListenerRegistration[]): void {
    registrations.forEach(registration => {
      const { name, isCustomEvent } = registration;
      let { handlerName, handler, options, attachTo } = registration;

      if (!handler && !handlerName) {
        throw new ElementalComponentCustomEventHandlerIsNotDefined(handlerName);
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line security/detect-object-injection
      let methodRef = handler || (this.component[handlerName] as (e: Event) => void);

      if (!methodRef) {
        throw new ElementalComponentCustomEventHandlerIsNotDefined(handlerName);
      }

      if (!DefaultEventController.isBound(methodRef)) {
        methodRef = methodRef.bind(this.component);
      }

      attachTo = attachTo ?? this.component;
      const eventListenerKey = `[${attachTo.tagName}][${attachTo.id}][${name}][${methodRef.name}]`;

      if (this.eventListeners.has(eventListenerKey)) {
        this.debug(
          `Skipping duplicate event handler registration ${eventListenerKey} => ${handlerName || handler?.name}`,
        );

        return;
      }

      handler = methodRef;
      handlerName = methodRef.name;
      options = { capture: true, ...(options || {}) };
      (isCustomEvent ? document : attachTo).addEventListener(name, methodRef, options);
      this.eventListeners.set(`[${attachTo.id}][${name}]`, { name, isCustomEvent, handlerName, handler, options });
      this.debug(`Added EventListener ${eventListenerKey} => ${methodRef.name}`);
    });
  }

  public deregisterEventListeners(): void {
    for (const [eventListenerKey, reg] of this.eventListeners.entries()) {
      if (!reg || !reg.name || !reg.handler) {
        return;
      }
      (reg.isCustomEvent ? document : this.component).removeEventListener(reg.name, reg.handler, reg.options);
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

  private debug(message?: string, ...optionalParams: unknown[]) {
    debug(
      `[elemental-component][${this.component.constructor.name}][id=${this.component.id}] ${message}`,
      ...optionalParams,
    );
  }
}
