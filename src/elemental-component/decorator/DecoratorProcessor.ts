import { ObservedState } from './ObservedState';
import { EventListener } from './EventListener';
import { ElementalComponent } from '../component/ElementalComponent';
import {
  DecoratorMetadataValue,
  EventListenerDecoratorMetadataValue,
  EventListenerDecoratorOptionsWithName,
  StateDecoratorMetadataValue,
} from './types';

export class DecoratorProcessor {
  // cache: ElementalComponent.constructor.name => DecoratorMetadataValue[]
  private static readonly CACHE: Map<string, DecoratorMetadataValue[]> = new Map<string, DecoratorMetadataValue[]>();

  private constructor() {
    // utility class, should not be initialized
  }

  public static getAllDecoratorMetadata(
    target: ElementalComponent,
    // eslint-disable-next-line @typescript-eslint/ban-types
    filterMetadata?: Function,
  ): DecoratorMetadataValue[] {
    if (!target) {
      return [];
    }
    let decorators = DecoratorProcessor.CACHE.get(target.constructor.name) || [];

    if (filterMetadata) {
      decorators = decorators.filter(d => d.decoratorName === filterMetadata.name);
    }
    // get parent decorators recursively
    const clazz = Object.getPrototypeOf(target);

    if (clazz) {
      const parentDecorators = DecoratorProcessor.getAllDecoratorMetadata(clazz.constructor.prototype, filterMetadata);

      decorators.push(...parentDecorators);
    }

    return decorators;
  }

  public static defineStateMetadata(propertyKey: string, target: ElementalComponent) {
    const value: StateDecoratorMetadataValue = { propertyKey, decoratorName: ObservedState.name };

    DecoratorProcessor.addDecoratorMetadata(target.constructor.name, value);
  }

  public static defineEventListenerMetadata(
    options: EventListenerDecoratorOptionsWithName,
    handlerName: string,
    target: ElementalComponent,
  ): void {
    const value: EventListenerDecoratorMetadataValue = { ...options, handlerName, decoratorName: EventListener.name };

    DecoratorProcessor.addDecoratorMetadata(target.constructor.name, value);
  }

  private static addDecoratorMetadata(name: string, value: DecoratorMetadataValue) {
    const values = DecoratorProcessor.CACHE.get(name) || [];

    values.push(value);
    DecoratorProcessor.CACHE.set(name, values);
  }
}
