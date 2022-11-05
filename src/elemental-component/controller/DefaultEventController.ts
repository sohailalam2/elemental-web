import { debug, Exception, serialize } from '@sohailalam2/abu';

import { EventListenerRegistration, EventOptions, EventController } from './';

export class ElementalComponentCustomEventHandlerIsNotDefined extends Exception {}

export class DefaultEventController<T extends HTMLElement> implements EventController {
  // map(event-name => handler-function-reference)
  private readonly eventListeners: Map<string, EventListenerRegistration> = new Map();

  constructor(private readonly component: T) {}

  public registerEventListeners(registrations: EventListenerRegistration[]): void {
    registrations.forEach(registration => {
      const { name, isCustomEvent } = registration;
      let { handlerName, handler, options, attachTo } = registration;

      if (!handler && !handlerName) {
        throw new ElementalComponentCustomEventHandlerIsNotDefined(handlerName);
      }

      attachTo = attachTo ?? this.component;
      const eventListenerKey = `[${attachTo.id}][${name}]`;

      if (this.eventListeners.has(eventListenerKey)) {
        this.debug(
          `Skipping duplicate event handler registration ${eventListenerKey} => ${handlerName || handler?.name}`,
        );

        return;
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line security/detect-object-injection
      const methodRef = handler || (this.component[handlerName] as (e: Event) => void)?.bind(this.component);

      if (!methodRef) {
        throw new ElementalComponentCustomEventHandlerIsNotDefined(handlerName);
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
    const event: Event = isCustom
      ? new CustomEvent(name, {
          detail: payload ? serialize(payload) : undefined,
          ...{ bubbles: true, cancelable: true, ...(options ?? options) },
        })
      : new Event(name, { bubbles: true, cancelable: true, composed: true, ...(options ?? options) });

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
