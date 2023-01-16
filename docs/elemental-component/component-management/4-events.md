# Component Events

## Register Event Listeners

Registration of event listeners can be done using two ways:

### Call `this.registerEventListeners(...)` from `connectedCallback()`

```ts
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

### Auto register by passing configurations in `super()` controller

```ts
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
and the `disconnectedCallback()` is invoked.

## Raise Events

You can raise events from the component as follows:

```ts
// raise a CustomEvent named `button-clicked` and with a string payload
this.raiseEvent(
  'button-clicked', // event name
  true, // isCustomEvent
  `You have clicked my button ${count} times`, // payload
);
```
