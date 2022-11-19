# Component Lifecycle

## Lifecycle Hooks

### connectedCallback()

Invoked when the custom element is first connected to the document's DOM.

The abstract class `ElementalComponent` by defaults registers all event listeners in this callback hook.

It is important that we register event listeners here, and unregister them in the disconnected callback.

Once the component is connected, then the `render()` method will get called. This method simply exists so that
you can cleanly organize all DOM rendering in one place.

```ts
class MyComponent extends ElementalComponent {
  protected connectedCallback() {
    super.connectedCallback();
  }
}
```

::: danger 👺 Use `isConnected`
Be careful working with connectedCallback. It runs more often than you might realize,
firing any time the element is moved and could even run after the node is no longer connected (strangely).

You can use `this.isConnected` to know whether the element is connected or not.
:::

The abstract class `ElementalComponent` by defaults automatically unregisters all event listeners in this callback hook.

It is important that we register event listeners in the connected callback, and unregister them here.

### disconnectedCallback()

Invoked when the custom element is disconnected from the document's DOM.

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

Invoked when one of the custom element's attributes is added, removed, or changed.

The abstract class `ElementalComponent` manages an elaborate set of functionalities
during this lifecycle hook, including the triggering of re-rendering of the component's DOM tree.

::: danger 👺 Call `super.attributeChangedCallback(...)`
If you do decide to override this method in your child class,
do not forget to call the super method.
:::

```ts
class MyComponent extends ElementalComponent {
  protected attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null) {
    super.attributeChangedCallback(name, oldVal, newVal);
  }
}
```
