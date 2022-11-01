import { ElementalComponentId, ElementalComponentPrefix } from './';

export interface ElementalComponentEventOptions {
  bubbles?: boolean;
  cancelable?: boolean;
}

export interface ElementalComponentEventHandlerRegistration {
  name: string;
  handlerName?: string;
  handler?: (e: Event) => void;
  isCustomEvent?: boolean;
  options?: {
    capture?: boolean;
  };
}

export interface ElementalComponentOptions {
  state?: unknown;
  prefix?: ElementalComponentPrefix;
  id?: ElementalComponentId;
  // eslint-disable-next-line no-undef
  mode?: ShadowRootMode;
  delegatesFocus?: boolean;
  eventHandlers?: ElementalComponentEventHandlerRegistration[];
}
