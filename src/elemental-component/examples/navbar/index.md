# Navbar Example

In this example, we use a 3rd party CSS framework [Bulma](https://bulma.io)

![Navbar Example](docs/assets/example-navbar.png)

## template.html

```html
<style media="screen"></style>
<nav class="navbar is-black is-fixed-top" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <a class="navbar-item" href="https://github.com/sohailalam2/elemental-web">
      <img src="/docs/assets/navbar-logo.png" alt="brand logo" />
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
@import 'bulma/sass/utilities/controls';
@import 'bulma/sass/utilities/extends';
@import 'bulma/sass/utilities/initial-variables';
@import 'bulma/sass/base/minireset';
@import 'bulma/sass/components/navbar';

a {
  text-decoration: none;
}
```

## Navbar.ts

```ts
import { debug, Exception, ValueObject, toKebabCase, randomId } from '@sohailalam2/abu';
import { ElementalComponent, EventListenerRegistration } from '@/elemental-component';

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

export class NavbarTemplateIsInvalidException extends Exception {}

export class Navbar extends ElementalComponent<NavbarMenu> {
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

  render() {
    if (!this.$template) {
      return;
    }

    const style = this.$root.querySelector('style') as HTMLStyleElement;
    const start = this.$root.querySelector('.navbar-start') as HTMLDivElement;
    const end = this.$root.querySelector('.navbar-end') as HTMLDivElement;

    if (!style || !start || !end) {
      throw new NavbarTemplateIsInvalidException();
    }
    style.textContent = styles;

    debug(this.$state);

    (this.$state?.start ?? []).forEach(menu => this.appendItem(menu, start));
    (this.$state?.end ?? []).forEach(menu => this.appendItem(menu, end));
  }

  private appendItem(item: NavbarItem, position: Element) {
    const a = document.createElement('a');

    a.id = randomId();
    a.className = 'navbar-item';
    a.textContent = item.toString();
    a.href = toKebabCase(item.toString());

    position.appendChild(a);
  }

  private onItemClickHandler(e: Event): void {
    e.preventDefault();
    alert((e.target as HTMLAnchorElement).href);
  }
}

ElementalComponent.register(Navbar, { template });
```

## index.ts

```ts
import { NavbarItem, Navbar, NavbarMenu } from './Navbar';

const menu: NavbarMenu = {
  start: [NavbarItem.from('Batman🦇'), NavbarItem.from('Robin🐦'), NavbarItem.from('Cat Woman🐱')],
  end: [NavbarItem.from('Login'), NavbarItem.from('Signup')],
};

export const navbar = new Navbar({ state: menu });

// 👌 add the custom element to the document body to render
document.body.prepend(navbar);
```
