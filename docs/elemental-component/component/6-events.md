# Component Events

Events are a way for different parts of your application to communicate with each other. When an event is triggered,
it sends a message to any listeners that have registered to receive it. This makes it possible for different components
or different parts of the same component to react to changes in the state of your application and update their own views accordingly.

Events are an important part of the web component model because they allow you to create modular,
reusable components that can interact with each other in meaningful ways. By defining clear event interfaces and using
them consistently throughout your application, you can create a robust and flexible architecture that is easy to maintain and extend over time.

## Raising Events

`ElementalComponent` comes with helper method `raiseEvent(...)` to let you dispatch any kind of event, be it native or custom:

```ts
export class MyComponent extends ElementalComponent {
  public raiseEvent<Payload>(
    // The name of the event
    name: string,
    // Whether this is a custom event or a regular native event
    isCustom?: boolean,
    // Custom events lets you add a payload of your choice...
    // The payload will be serialized automatically
    payload?: Payload,
    // Additional Options... see below for details
    options?: EventOptions,
  ): void {}
}
```

### EventOptions

`EventOptions` interface exposes the following properties:

| Option     | Type (default)   | Description                                                                                                                                                                     |
| ---------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bubbles    | boolean (`true`) | A boolean value indicating whether the event bubbles.                                                                                                                           |
| cancelable | boolean (`true`) | A boolean value indicating whether the event can be cancelled.                                                                                                                  |
| composed   | boolean (`true`) | A boolean value indicating whether the event will trigger listeners outside of a shadow root. Read more [here](https://developer.mozilla.org/en-US/docs/Web/API/Event/composed) |

### Example

You can raise events from the component as follows:

```ts
// raise a CustomEvent named `button-clicked` and with a string payload
const payload = `You have clicked my button ${count} times`;

this.raiseEvent('button-clicked', true, payload);
```

## Listening to Events

To listen to events, you can use the [addEventListener()](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) method, which is a native DOM API method.
However, we will show you a much simpler way do the same that requires far less boilerplate code.

`ElementalComponent` exposes multiple ways to register event listeners.
All of these are compatible with each other, can be composed and allows configuration through the options given below:

### EventListenerRegistration Options

| Option          | Type                 | Description                                                                                                                                                                                                                                                                                                                                                                                                                    |
| --------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| name            | `string`             | A string with the name of the event. It is case-sensitive                                                                                                                                                                                                                                                                                                                                                                      |
| handlerName     | `string`             | The handler method name as text                                                                                                                                                                                                                                                                                                                                                                                                |
| handler         | `(e: Event) => void` | The handler as a method reference. The callback accepts a single parameter `e`, an object based on Event describing the event that has occurred, and it returns nothing.                                                                                                                                                                                                                                                       |
| attachTo        | `HTMLElement`        | The element this listener should be bound to. By default, the listener is bound to the component instance                                                                                                                                                                                                                                                                                                                      |
| isCustomEvent   | `boolean`            | Indicates whether this listener is meant to capture normal events or CustomEvents                                                                                                                                                                                                                                                                                                                                              |
| options         | `object`             | [EventListener Options](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#parameters)                                                                                                                                                                                                                                                                                                              |
| options.capture | `boolean`            | A boolean value indicating that events of this type will be dispatched to the registered listener before being dispatched to any EventTarget beneath it in the DOM tree. If not specified, defaults to `true`.                                                                                                                                                                                                                 |
| options.passive | `boolean`            | A boolean value that, if true, indicates that the function specified by listener will never call preventDefault(). If a passive listener does call preventDefault(), the user agent will do nothing other than generate a console warning. If not specified, defaults to false – except that in browsers other than Safari and Internet Explorer, defaults to true for the wheel, mousewheel, touchstart and touchmove events. |
| options.once    | `boolean`            | A boolean value indicating that the listener should be invoked at most once after being added. If true, the listener would be automatically removed when invoked. If not specified, defaults to false.                                                                                                                                                                                                                         |
| options.signal  | `AbortSignal`        | An AbortSignal. The listener will be removed when the given AbortSignal object's abort() method is called. If not specified, no AbortSignal is associated with the listener.                                                                                                                                                                                                                                                   |

## Adding Event Listeners

### Register Using `@EventListener()` decorator

This is by far the easiest and most intuitive way of registering event listeners.
The decorator requires an event name parameter and allows an optional config.

`@EventListener('event-name', options)`

The optional config allows you to pass `attachTo`, `isCustomEvent`, `options` properties as described above.
Compared to the above table, the only difference here is that the `attachTo` property accepts a string that is used as a query parameter to find the HTMLElement.

#### Example

```ts
@Component()
export class Hero extends ElementalComponent {
  render() {
    this.$root.innerHTML = `
      <section>
        <p class="name"></p>
        <button>Send Message</button>
      </section>
      `;
  }

  // Attach a regular event listener to the button in the component's DOM
  @EventListener('click', { attachTo: 'button' })
  protected onButtonClick() {
    this.raiseEvent('TextUpdated', true, 'Hello World');
  }

  // Attach a custom event listener to receive the event named 'TextUpdated'
  @EventListener('TextUpdated', { isCustomEvent: true })
  protected onTextUpdated(e: Event): void {
    const payload = (e as CustomEvent).detail;
    // do something with the payload
  }
}
```

### Register Using `this.registerEventListeners(...)` method

If you are not a fan of decorators or if you are programming in pure JS, this option allows you to simplify event listener registration.

It is important to note that this method should ideally be called inside the `connectedCallback()` lifecycle hook instead of the constructor.

#### Example

```ts
@Component()
class ButtonCounter extends ElementalComponent {
  connectedCallback() {
    // ⚠️ Do not forget to call super method
    super.connectedCallback();

    // 👇 register listeners like so
    this.registerEventListeners([{ name: 'click', handler: this.onClick }]);
  }

  render() {
    this.$root.innerHTML = `<button>Click Me</button>`;
  }

  onClick() {
    // do something
  }
}
```

### Register using `super()` constructor config

Finally, `ElementalComponent` does allow you to register event listeners in the constructor by passing the
configuration via the `super()` constructor.

However, this is rarely used, and you can register event listeners via any of the above methods even if you are
configuring other properties via the super constructor.

#### Example

```ts
@Component()
class ButtonCounter extends ElementalComponent {
  constructor() {
    // 👇 register listeners like so
    super({
      eventHandlers: [
        {
          name: 'custom-event',
          handlerName: 'onClick',
          isCustom: true,
        },
      ],
    });
  }

  render() {
    this.$root.innerHTML = `<button>Click Me</button>`;
  }

  // 👇 The name must match, case-sensitive
  onClick() {
    // do something
  }
}
```

## Deregister Event Listeners

`ElementalComponent` will automatically deregister all event listeners once the component is unmounted
and when the `disconnectedCallback()` lifecycle hook is invoked.

Hence, it is important to note that if you are overriding the `disconnectedCallback()` lifecycle hook,
then do not forget to call the `super.disconnectedCallback()` method in your overridden method.
