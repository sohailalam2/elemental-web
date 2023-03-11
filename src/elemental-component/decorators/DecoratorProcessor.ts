import { EventListener } from './EventListener';
import { ElementalComponent } from '../ElementalComponent';
import {
  DecoratorMetadataValue,
  EventListenerDecoratorMetadataValue,
  EventListenerDecoratorOptionsWithName,
} from './types';

export class DecoratorProcessor {
  // cache: ElementalComponent.constructor.name => DecoratorMetadataValue[]
  private static readonly CACHE: Map<string, DecoratorMetadataValue[]> = new Map<string, DecoratorMetadataValue[]>();

  private constructor() {
    // utility class, should not be initialized
  }

  public static getAllDecoratorMetadata(target: ElementalComponent): DecoratorMetadataValue[] {
    return DecoratorProcessor.CACHE.get(target.constructor.name) || [];
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
