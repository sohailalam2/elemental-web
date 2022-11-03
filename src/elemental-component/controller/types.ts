export interface EventOptions {
  /**
   * A boolean value indicating whether the event bubbles.
   * The default is `true`
   */
  bubbles?: boolean;

  /**
   * A boolean value indicating whether the event can be cancelled.
   * The default is `true`
   */
  cancelable?: boolean;

  /**
   * A boolean value indicating whether the event will trigger listeners
   * outside of a shadow root. The default is `true`
   *
   * @link Event.composed for more details
   * https://developer.mozilla.org/en-US/docs/Web/API/Event/composed
   */
  composed?: boolean;
}

export interface EventListenerRegistration {
  /**
   * A string with the name of the event. It is case-sensitive
   */
  name: string;

  /**
   * The handler name as text
   */
  handlerName?: string;

  /**
   * The handler as a method reference. The callback accepts a single parameter:
   * @param e   an object based on Event describing the event that has occurred,
   *            and it returns nothing.
   */
  handler?: (e: Event) => void;

  /**
   * The element this listener should be bound to. By default, the listener
   * is bound to the component instance
   */
  attachTo?: HTMLElement;

  /**
   * Indicates whether this listener is meant to capture normal events or
   * CustomEvents
   */
  isCustomEvent?: boolean;

  /**
   * @link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
   */
  options?: {
    /**
     * A boolean value indicating that events of this type will be
     * dispatched to the registered listener before being dispatched
     * to any EventTarget beneath it in the DOM tree. If not specified,
     * defaults to `true`.
     */
    capture?: boolean;

    /**
     * A boolean value that, if true, indicates that the function specified
     * by listener will never call preventDefault(). If a passive listener
     * does call preventDefault(), the user agent will do nothing other than
     * generate a console warning. If not specified, defaults to false –
     * except that in browsers other than Safari and Internet Explorer,
     * defaults to true for the wheel, mousewheel, touchstart and touchmove
     * events.
     */
    passive?: boolean;

    /**
     * A boolean value indicating that the listener should be invoked at most
     * once after being added. If true, the listener would be automatically
     * removed when invoked. If not specified, defaults to false.
     */
    once?: boolean;

    /**
     * An AbortSignal. The listener will be removed when the given AbortSignal
     * object's abort() method is called. If not specified, no AbortSignal is
     * associated with the listener.
     */
    signal?: AbortSignal;
  };
}

export interface EventController {
  registerEventListeners: (registrations: EventListenerRegistration[]) => void;

  deregisterEventListeners: () => void;

  raiseEvent: <Payload = undefined>(
    /**
     * A string with the name of the event. It is case-sensitive.
     */
    name: string,
    isCustom?: boolean,
    /**
     * The read-only detail property of the CustomEvent interface returns any
     * data passed when initializing the event via this payload property
     */
    payload?: Payload,
    options?: EventOptions,
  ) => void;
}
