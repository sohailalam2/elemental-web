import { Class } from '@sohailalam2/abu';

import { RegistrationOptions } from '../registry';
import { ElementalComponent } from '../component';

import { ObservedState } from './ObservedState';
import { StateDecoratorMetadataValue } from './types';
import { DecoratorProcessor } from './DecoratorProcessor';

export function Component(options?: RegistrationOptions) {
  return (constructor: Class<ElementalComponent>) => {
    Object.defineProperty(constructor, 'observedAttributes', {
      get: function get() {
        return getObservedStates(constructor);
      },
      enumerable: true,
      configurable: true,
    });

    ElementalComponent.register(constructor as Class<ElementalComponent>, options);
  };
}

function getObservedStates(constructor: Class<ElementalComponent>): string[] {
  const proto = constructor.prototype;
  // Process State metadata
  const stateDecorators = DecoratorProcessor.getAllDecoratorMetadata(
    proto,
    ObservedState,
  ) as StateDecoratorMetadataValue[];

  let states = stateDecorators.map(d => d.propertyKey);

  if (!Array.isArray(states)) {
    states = [];
  }
  states.push('state');

  return Array.from(new Set(states));
}
