import { ElementalComponentId, ElementalComponentPrefix } from './values';

export interface EventOptions {
  bubbles?: boolean;
  cancelable?: boolean;
  composed?: boolean;
}

export interface EventListenerRegistration {
  name: string;
  handlerName?: string;
  handler?: (e: Event) => void;
  isCustomEvent?: boolean;
  options?: {
    capture?: boolean;
    passive?: boolean;
    once?: boolean;
    signal?: AbortSignal;
  };
}

export interface EventController {
  registerEventListeners: (registrations: EventListenerRegistration[]) => void;

  deregisterEventListeners: () => void;

  raiseEvent: <Payload = undefined>(
    name: string,
    isCustom?: boolean,
    payload?: Payload,
    options?: EventOptions,
  ) => void;
}

export interface RegistrationOptions {
  prefix?: ElementalComponentPrefix;

  /**
   * @deprecated
   *
   * The extension of native HTML components is not supported by Safari.
   * The team has decided to not support it in the future either. So use this functionality with caution
   */
  extends?: string;
}

export interface ElementalComponentOptions {
  state?: unknown;
  prefix?: ElementalComponentPrefix;
  id?: ElementalComponentId;
  noShadow?: boolean;
  // eslint-disable-next-line no-undef
  mode?: ShadowRootMode;
  delegatesFocus?: boolean;
  eventHandlers?: EventListenerRegistration[];
}
