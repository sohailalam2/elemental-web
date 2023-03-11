import { CustomObject } from '@sohailalam2/abu';
import { ElementalComponent, EventListenerRegistration } from '@/elemental-component';

export type EventListenerDecorator = (target: ElementalComponent, key: string, descriptor: PropertyDescriptor) => void;

type E = {
  [Prop in keyof EventListenerRegistration as Exclude<
    Prop,
    'name' | 'handlerName' | 'handler' | 'attachTo'
  >]: EventListenerRegistration[Prop];
};

export interface EventListenerDecoratorOptions extends E {
  attachTo?: string;
}

export interface EventListenerDecoratorOptionsWithName extends EventListenerDecoratorOptions {
  eventName: string;
}

export type DecoratorMetadataValue = CustomObject & {
  decoratorName: string;
};

export type EventListenerDecoratorMetadataValue = EventListenerDecoratorOptions &
  DecoratorMetadataValue & {
    handlerName: string;
  };

export type StateDecoratorMetadataValue = DecoratorMetadataValue & {
  propertyKey: string;
};
