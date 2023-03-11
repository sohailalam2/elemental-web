import { Class } from '@sohailalam2/abu';

import { RegistrationOptions } from '../registry';
import { ElementalComponent } from '../ElementalComponent';

export function Component(options?: RegistrationOptions) {
  return (constructor: Class<unknown>) => {
    const proto = constructor.prototype;

    if (!(proto instanceof ElementalComponent)) {
      throw new Error('@Component is only be applied to a class that extends ElementalComponent');
    }
    ElementalComponent.register(constructor as Class<ElementalComponent>, options);
  };
}
