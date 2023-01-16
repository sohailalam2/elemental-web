# Example with Inheritance

In this example, we can see that the `HeroSidekick` component not only inherits
most of the functionalities from `Hero` component but also adds its own flavor.

Notice how `Hero` component uses a complex data as `state`.

![inheritance-example.png](/assets/elemental-component/inheritance-example.png)

## template.html

```html
<section>
  <p class="name"></p>
  <p class="tagline"></p>
  <p class="secret"></p>
  <button>Send Message</button>
</section>
```

## styles.css

```css
:host {
  margin: 0;
  padding: 0;
  color: black;
  font-weight: 400;
}

button {
  border: none;
  border-radius: 5px;
  padding: 10px 25px;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  background-color: black;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.sidekick-tagline {
  color: crimson;
  font-size: 1.5rem;
}

.name {
  font-size: 2.5rem;
  font-weight: 800;
}

.tagline {
  font-size: 1.75rem;
}

.secret {
  font-size: 1.2rem;
  color: #888;
}
```

## Hero.ts

```ts
/* eslint-disable no-magic-numbers */
import { deserialize, hasValue, randomHex, serialize, ValueObject } from '@sohailalam2/abu';
import {
  StatefulElementalComponent,
  ElementalComponentState,
  StateIsNotConsistentException,
} from '@sohailalam2/elemental-web';

import styles from './styles.css?inline';
import template from './template.html?raw';

interface HeroMessage {
  name: string;
  message: string;
}

export class State extends ElementalComponentState<HeroMessage> {
  static defaultState<Type, K extends ValueObject<Type>>(): K {
    return State.from({
      name: 'unknown',
      message: 'unknown',
    }) as K;
  }

  validate() {
    super.validate();
    const isConsistent = hasValue(this.value) && hasValue(this.value.name) && hasValue(this.value.message);

    if (!isConsistent) {
      throw new StateIsNotConsistentException(this.constructor.name);
    }
  }
}

export class Hero extends StatefulElementalComponent<State> {
  static get observedAttributes() {
    return ['name', 'tagline', 'state'];
  }

  name = '';

  tagline = '';

  protected connectedCallback() {
    super.connectedCallback();

    this.registerEventListeners([
      {
        name: 'click',
        handler: this.onButtonClickHandler,
        attachTo: this.$root.querySelector('button') as HTMLButtonElement,
      },
      {
        name: 'UpdateText',
        handler: this.onUpdateTextHandler,
        isCustomEvent: true,
      },
    ]);
  }

  protected render() {
    const name = this.$root.querySelector('.name') as HTMLParagraphElement;
    const tagline = this.$root.querySelector('.tagline') as HTMLParagraphElement;
    const secret = this.$root.querySelector('.secret') as HTMLParagraphElement;

    name.textContent = `I am ${this.name}`;
    tagline.textContent = this.tagline;

    if (this.$state.value.name !== 'unknown') {
      secret.textContent = `
        ${this.$state.value.name} send a secret message.
        ${this.$state.value.message}
      `;
    }
  }

  protected onButtonClickHandler(e: Event) {
    e.preventDefault();

    this.raiseEvent(
      'UpdateText',
      true,
      serialize({
        name: this.name,
        message: `secret code #${randomHex()}`,
      }),
    );
  }

  protected onUpdateTextHandler(e: Event): void {
    const msg: HeroMessage = deserialize((e as CustomEvent).detail);

    if (msg.name !== this.name) {
      this.updateState(State.from(msg));
    }
  }

  protected deserialize(serialized: string | undefined): State {
    return State.deserialize<HeroMessage, State>(serialized);
  }
}

StatefulElementalComponent.register(Hero, { template, styles });
```

## HeroSidekick.ts

```ts
import { ElementalComponent } from '@sohailalam2/elemental-web';

import { Hero } from './Hero';

export class HeroSidekick extends Hero {
  protected connectedCallback() {
    super.connectedCallback();
    const tagline = this.$root.querySelector('.tagline') as HTMLParagraphElement;

    tagline.classList.add('sidekick-tagline');
  }
}

ElementalComponent.register(HeroSidekick);
```

## index.ts

```ts
import './Hero';
import './HeroSidekick';

// 👌 add the custom element to the document body to render
document.body.innerHTML += `
<hr />
<div style="display: flex; justify-content: center; column-gap: 5%">
  <el-hero id="one" name="Batman🦇" tagline="The protector of Gotham!"></el-hero>
  <el-hero-sidekick name="Robin🐦" tagline="I was lost, but now I am found."></el-hero-sidekick>
  <el-hero-sidekick name="Cat Woman🐱" tagline="I ❤ Batman"></el-hero-sidekick>
</div>
`;
```
