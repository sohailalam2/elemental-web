import { DecoratorProcessor } from '../decorators';
import { ElementalComponent } from '../ElementalComponent';
import { EventListenerDecorator, EventListenerDecoratorOptions } from './types';

export function EventListener(eventName: string, options?: EventListenerDecoratorOptions): EventListenerDecorator {
  return (target: ElementalComponent, handlerName: string, descriptor: PropertyDescriptor) => {
    DecoratorProcessor.defineEventListenerMetadata({ eventName, ...(options || {}) }, handlerName, target);
    const originalMethod = descriptor.value;

    // eslint-disable-next-line no-param-reassign
    descriptor.value = function value(...args: unknown[]) {
      // eslint-disable-next-line no-magic-numbers
      const event = args[0];

      if (event instanceof Event) {
        event.preventDefault();
      }

      return originalMethod.apply(this, args);
    };
  };
}
