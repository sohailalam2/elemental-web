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
    // eslint-disable-next-line no-alert
    alert((e.target as HTMLAnchorElement).href);
  }
}

ElementalComponent.register(Navbar, { template });
