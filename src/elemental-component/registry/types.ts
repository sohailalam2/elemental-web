import { ElementalComponentPrefix } from '@/elemental-component';

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
