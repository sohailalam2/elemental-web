import { hasValue } from '@sohailalam2/abu';

import { StatefulElementalComponentOptions } from '../types';
import { ElementalComponent } from './ElementalComponent';
import { ElementalComponentState } from './ElementalComponentState';

export abstract class StatefulElementalComponent<
  State extends ElementalComponentState<unknown>,
> extends ElementalComponent {
  static get observedAttributes(): string[] {
    return super.observedAttributes.concat(['state']);
  }

  private state: string | undefined = undefined;

  constructor(options: StatefulElementalComponentOptions = {}) {
    super(options);

    if (hasValue(options?.state)) {
      this.updateState(options?.state as State); // will auto-render when update is done
    }
  }

  protected deserialize(serialized: string | undefined): State {
    return ElementalComponentState.deserialize<unknown>(serialized) as State;
  }

  public get $state(): State {
    return this.deserialize(this.state);
  }

  public updateState(value: State) {
    if (hasValue(value)) {
      this.setAttribute('state', value.serialize());
    }
  }
}
