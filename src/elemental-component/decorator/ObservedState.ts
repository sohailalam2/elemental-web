import { ElementalComponent } from '../component/ElementalComponent';

import { DecoratorProcessor } from './DecoratorProcessor';

export function ObservedState(target: ElementalComponent, propertyKey: string) {
  DecoratorProcessor.defineStateMetadata(propertyKey, target);
}
