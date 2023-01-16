# Navbar Example

In this example, we use a 3rd party CSS framework [Bulma](https://bulma.io)

![navbar-example.png](/assets/elemental-component/navbar-example.png)

## template.html

```html
<style media="screen"></style>
<nav class="navbar is-black is-fixed-top" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <a class="navbar-item" href="https://github.com/sohailalam2/elemental-web">
      <img src="logo.svg" alt="Logo" />
    </a>
    <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="main-navbar">
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </a>
  </div>
  <div id="main-navbar" class="navbar-menu">
    <div class="navbar-start"></div>
    <div class="navbar-end"></div>
  </div>
</nav>
```

## styles.scss

```scss
@import 'node_modules/bulma/sass/utilities/controls';
@import 'node_modules/bulma/sass/utilities/extends';
@import 'node_modules/bulma/sass/utilities/initial-variables';
@import 'node_modules/bulma/sass/base/minireset';
@import 'node_modules/bulma/sass/components/navbar';

a {
  text-decoration: none;
}
```

## Navbar.ts

```ts
import { Exception, ValueObject, toKebabCase, randomId, hasValue } from '@sohailalam2/abu';
import {
  EventListenerRegistration,
  StatefulElementalComponent,
  ElementalComponentState,
  StateIsNotConsistentException,
} from '@sohailalam2/elemental-web';

import styles from './styles.scss?inline';
import template from './template.html?raw';

export class NavbarItemDataCanNotBeThisLarge extends Exception {}

export class NavbarItem extends ValueObject {
  validate() {
    super.validate();
    const MAX_LENGTH = 15;

    if (this.value.length > MAX_LENGTH) {
      throw new NavbarItemDataCanNotBeThisLarge();
    }
  }
}

export interface NavbarMenu {
  start: NavbarItem[];
  end: NavbarItem[];
}

export class State extends ElementalComponentState<NavbarMenu> {
  static defaultState<Type, K extends ValueObject<Type>>(): K {
    return State.from({
      start: [],
      end: [],
    }) as K;
  }

  validate() {
    super.validate();
    const isConsistent = hasValue(this.value) && Array.isArray(this.value.start) && Array.isArray(this.value.end);

    if (!isConsistent) {
      throw new StateIsNotConsistentException(this.constructor.name);
    }
  }
}

export class NavbarTemplateIsInvalidException extends Exception {}

export class Navbar extends StatefulElementalComponent<State> {
  private readonly menuRenderedMap: Map<string, boolean> = new Map<string, boolean>();

  connectedCallback() {
    super.connectedCallback();
    const eventListeners: EventListenerRegistration[] = [];

    // attach click handler to all navbar items individually
    this.$root.querySelectorAll('.navbar-item').forEach((el: Element) => {
      if (el.id) {
        // 💡 Note how we are registering click handler for the anchor
        // element and NOT to the Navbar custom element
        eventListeners.push({
          name: 'click',
          handler: this.onItemClickHandler,
          attachTo: el as HTMLElement,
        });
      }
    });

    this.registerEventListeners(eventListeners);
  }

  protected disconnectedCallback() {
    super.disconnectedCallback();
    this.menuRenderedMap.clear();
  }

  render() {
    if (!this.isConnected) {
      return;
    }

    const start = this.$root.querySelector('.navbar-start') as HTMLDivElement;
    const end = this.$root.querySelector('.navbar-end') as HTMLDivElement;

    if (!start || !end) {
      throw new NavbarTemplateIsInvalidException();
    }

    this.$state.value.start.forEach(menu => this.appendItem(menu, start));
    this.$state.value.end.forEach(menu => this.appendItem(menu, end));
  }

  private appendItem(item: NavbarItem, position: Element) {
    const text = item.toString();

    if (this.menuRenderedMap.has(text)) {
      return;
    }
    const a = document.createElement('a');

    a.id = randomId();
    a.className = 'navbar-item';
    a.textContent = text;
    a.href = toKebabCase(text);

    position.appendChild(a);
    this.menuRenderedMap.set(text, true);
  }

  private onItemClickHandler(e: Event): void {
    e.preventDefault();
    // eslint-disable-next-line no-alert
    alert((e.target as HTMLAnchorElement).href);
  }
}

StatefulElementalComponent.register(Navbar, { template, styles });
```

## index.ts

```ts
import { NavbarItem, Navbar, NavbarMenu } from './Navbar';

const menu: NavbarMenu = {
  start: [NavbarItem.from('Batman🦇'), NavbarItem.from('Robin🐦'), NavbarItem.from('Cat Woman🐱')],
  end: [NavbarItem.from('Login'), NavbarItem.from('Signup')],
};

const navbar = new Navbar({ state: State.from<NavbarMenu, State>(menu) });

// 👌 add the custom element to the document body to render
document.body.prepend(navbar);
```
