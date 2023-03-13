import { ElementalComponentPrefix } from '@/elemental-component';

export interface RegistrationOptions {
  prefix?: ElementalComponentPrefix;

  /**
   * The ID of the template that should be used as a template for this component
   *
   * This option allows us to reuse existing templates
   */
  templateId?: string;

  /**
   * The template HTML that should be registered along with the template registration
   */
  template?: string;

  /**
   * Styles that will be registered as a style element in the component root
   */
  styles?: string | string[];

  /**
   * @deprecated
   *
   * The extension of native HTML components is not supported by Safari.
   * The team has decided to not support it in the future either. So use this functionality with caution
   */
  extends?: string;
}
