import { ElementalComponentId } from './values';
import { EventListenerRegistration } from './event';
import { ElementalComponentState } from './component/ElementalComponentState';

export interface ElementalComponentOptions {
  /**
   * An optional `id` for the instance of the custom element.
   * An alphanumeric ID will be auto generated if one is not provided here.
   */
  id?: ElementalComponentId;

  /**
   * By default, an `ElementalComponent` is created with a shadowRoot
   * (enclosed in a shadow DOM). However, this configuration property allows us
   * to create an instance without a shadow DOM.
   */
  noShadow?: boolean;

  /**
   * By default, an `ElementalComponent` is created with a shadow DOM in the
   * 'open' mode. However, this configuration property allows us to create one
   * in a 'closed' mode.
   */
  // eslint-disable-next-line no-undef
  mode?: ShadowRootMode;

  /**
   * A boolean that, when set to true, specifies behavior that mitigates
   * custom element issues around focusability. When a non-focusable part
   * of the shadow DOM is clicked, the first focusable part is given focus,
   * and the shadow host is given any available :focus styling.
   */
  delegatesFocus?: boolean;

  /**
   * Event Listeners can be auto registered if they are configured here.
   * Read more in the Controller section of the guide.
   */
  eventHandlers?: EventListenerRegistration[];

  /**
   * The ID of the template that should be used as a template for this component
   *
   * This option allows us to reuse existing templates
   */
  templateId?: string;
}

export interface StatefulElementalComponentOptions extends ElementalComponentOptions {
  /**
   * Each `ElementalComponent` by defaults gets an internal `state` of type that
   * was declared in the component definition. The state can be access using the
   * `this.$state` property.
   */
  state?: ElementalComponentState<unknown>;
}
