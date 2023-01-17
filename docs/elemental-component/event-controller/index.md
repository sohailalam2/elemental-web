# Event Controller

`EventController` is an interface that outlines methods for registering, deregistering and dispatching events, including
both regular and custom events. The `DefaultEventController` class provides a default implementation of this interface,
and `ElementalComponent` currently uses this default implementation. Currently, there is no method for specifying an alternative implementation.

## EventController Interface

```ts
interface EventController {
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
```

### Event Options

`EventOptions` interface exposes the following properties:

| Option     | Type    | Description                                                                                                                                                                                         |
| ---------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bubbles    | boolean | A boolean value indicating whether the event bubbles. Defaults to `true`                                                                                                                            |
| cancelable | boolean | A boolean value indicating whether the event can be cancelled. Defaults to `true`                                                                                                                   |
| composed   | boolean | A boolean value indicating whether the event will trigger listeners outside of a shadow root. Defaults to `true`. Read more [here](https://developer.mozilla.org/en-US/docs/Web/API/Event/composed) |

### Usage

```ts
class MyComponent extends HTMLElement {
  onClickHandler() {
    // do nothing
  }
}

ElementalComponentRegistry.registerComponent(MyComponent);

const component = new MyComponent();
const controller = new DefaultEventController(component);

const registrations: EventListenerRegistration[] = [
  // creates a regular event handler and provide a handler reference
  { name: 'click', handler: component.clickHandler },

  // creates a custom event handler and proides a handler has its method name
  { name: 'custom-click', handlerName: 'onClickHandler', isCustomEvent: true },
];

controller.registerEventListeners(registrations);

component.click();
```

::: tip 💁 Register event handlers for any `HTMLElement`
It's always fun to discover new things, and you'll be delighted to know that the `registerEventListeners()` method can be
used to register event listeners on any `HTMLElement`, not just those that are instances of `ElementalComponent`.
So, don't be afraid to experiment and see the benefits for yourself! :)
:::

### EventListenerRegistration Interface

```ts
interface EventListenerRegistration {
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
    capture?: boolean;

    passive?: boolean;

    once?: boolean;

    signal?: AbortSignal;
  };
}
```

### EventListenerRegistration Options

| Option  | Type          | Description                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| capture | `boolean`     | A boolean value indicating that events of this type will be dispatched to the registered listener before being dispatched to any EventTarget beneath it in the DOM tree. If not specified, defaults to `true`.                                                                                                                                                                                                                 |
| passive | `boolean`     | A boolean value that, if true, indicates that the function specified by listener will never call preventDefault(). If a passive listener does call preventDefault(), the user agent will do nothing other than generate a console warning. If not specified, defaults to false – except that in browsers other than Safari and Internet Explorer, defaults to true for the wheel, mousewheel, touchstart and touchmove events. |
| once    | `boolean`     | A boolean value indicating that the listener should be invoked at most once after being added. If true, the listener would be automatically removed when invoked. If not specified, defaults to false.                                                                                                                                                                                                                         |
| signal  | `AbortSignal` | An AbortSignal. The listener will be removed when the given AbortSignal object's abort() method is called. If not specified, no AbortSignal is associated with the listener.                                                                                                                                                                                                                                                   |
