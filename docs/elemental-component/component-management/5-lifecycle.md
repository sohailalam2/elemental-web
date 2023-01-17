# Component Lifecycle

## Lifecycle Hooks

### connectedCallback()

The `connectedCallback()` is invoked when the custom element is first connected to the DOM. `ElementalComponent` registers
all event listeners in this callback by default. To ensure proper cleanup, it is important to register event listeners here
and unregister them in the `disconnectedCallback()`. Once the component is connected, the `render()` method will be executed,
which provides a centralized location for organizing all DOM rendering.

```ts
class MyComponent extends ElementalComponent {
  protected connectedCallback() {
    super.connectedCallback();
  }
}
```

::: danger 👺 Use `isConnected`
It is important to exercise caution when working with the `connectedCallback()` as it may execute more frequently than anticipated.
It will fire any time the element is moved, and in some cases, it may run even after the node is no longer connected.

To determine the connection status of the element, use the `this.isConnected` property.
:::

### disconnectedCallback()

The `disconnectedCallback()` is invoked when the custom element is disconnected from the DOM. `ElementalComponent` automatically
unregisters all event listeners in this callback by default. To ensure proper management of event listeners,
it is important to register them in the connectedCallback and unregister them in this method.

```ts
class MyComponent extends ElementalComponent {
  protected disconnectedCallback() {
    super.disconnectedCallback();
  }
}
```

### adoptedCallback()

Invoked when the custom element is moved to a new document.

```ts
class MyComponent extends ElementalComponent {
  protected adoptedCallback() {
    super.adoptedCallback();
  }
}
```

### attributeChangedCallback()

The `attributeChangedCallback()` is invoked when an attribute of the custom element is added, removed, or modified.
`ElementalComponent` manages a comprehensive set of functions during this lifecycle hook, including triggering a re-rendering
of the component's DOM tree.

::: danger 👺 Call `super.attributeChangedCallback(...)`
If you choose to override this method in your child class, it is important to remember to call the super method.
:::

```ts
class MyComponent extends ElementalComponent {
  protected attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null) {
    super.attributeChangedCallback(name, oldVal, newVal);
  }
}
```
