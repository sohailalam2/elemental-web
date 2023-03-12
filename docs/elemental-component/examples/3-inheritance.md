# Example with Inheritance

In this example, we can see that the `HeroSidekick` component not only inherits
most of the functionalities from `Hero` component but also adds its own flavor.

Notice how `Hero` component uses a complex data as `state`.

![inheritance-example.png](/assets/elemental-component/inheritance-example.png)

## Code

### template.html

```html
<section>
  <p class="name"></p>
  <p class="tagline"></p>
  <p class="secret"></p>
  <button>Send Message</button>
</section>
```

### styles.css

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

### Hero.ts

```ts
/* eslint-disable no-magic-numbers */
import { deserialize, randomHex, serialize } from '@sohailalam2/abu';

import { Component, EventListener, ObservedState, StatefulElementalComponent } from '@sohailalam2/elemental-web';

import styles from './styles.css?inline';
import template from './template.html?raw';
import { HeroMessage, State } from './State';

@Component({ template, styles })
export class Hero extends StatefulElementalComponent<State> {
  @ObservedState
  name = '';

  @ObservedState
  tagline = '';

  protected render() {
    const name = this.$('.name');
    const tagline = this.$('.tagline');
    const secret = this.$('.secret');

    if (!name || !tagline || !secret) {
      return;
    }

    name.textContent = `I am ${this.name}`;
    tagline.textContent = this.tagline;

    if (this.$state.value.name !== 'unknown') {
      secret.textContent = `${this.$state.value.name} | ${this.$state.value.message}`;
    }
  }

  @EventListener('click', { attachTo: 'button' })
  protected onButtonClickHandler() {
    const serializedMsg = serialize({ name: this.name, message: `secret code #${randomHex()}` });

    this.raiseEvent('UpdateText', true, serializedMsg);
  }

  @EventListener('UpdateText', { isCustomEvent: true })
  protected onUpdateTextHandler(e: Event): void {
    let msg: HeroMessage = deserialize((e as CustomEvent).detail);

    if (msg) {
      if (msg.name === this.name) {
        msg = { name: this.name, message: '✅ Message Sent' };
      }
      this.updateState(State.from(msg));
    }
  }

  protected deserialize(serialized: string | undefined): State {
    return State.deserialize<HeroMessage, State>(serialized);
  }
}
```

### HeroSidekick.ts

```ts
import { Component } from '@sohailalam2/elemental-web';

import { Hero } from './Hero';

@Component()
export class HeroSidekick extends Hero {
  protected connectedCallback() {
    super.connectedCallback();
    const tagline = this.$('.tagline') as HTMLParagraphElement;

    tagline.classList.add('sidekick-tagline');
  }
}
```

### index.ts

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
