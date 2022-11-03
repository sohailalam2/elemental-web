import { Class, debug, deserialize, hasValue, randomId, serialize } from '@sohailalam2/abu';

import {
  ElementalComponentOptions,
  EventListenerRegistration,
  EventOptions,
  RegistrationOptions,
  EventController,
} from './types';
import { DefaultRegistry } from './DefaultRegistry';
import { ElementalComponentPrefix } from './values';
import { DefaultEventController } from './DefaultEventController';
import { UnableToRenderElementalComponentException, ElementalComponentIsNotRegisteredException } from './exceptions';

/**
 * ElementalComponent Class
 */
export abstract class ElementalComponent<State = string> extends HTMLElement implements EventController {
  // list of attributes that will be made observable and for whom the attributeChangedCallback will be called
  static get observedAttributes(): string[] {
    return ['state'];
  }

  public readonly tagName: string;

  public readonly $root: Element | ShadowRoot;

  public readonly $template: DocumentFragment;

  private readonly eventController: EventController;

  private state: string | undefined = undefined;

  /**
   * ElementalComponent Constructor
   * @param options The configuration options for the component
   */
  constructor(private readonly options?: ElementalComponentOptions) {
    super();
    this.eventController = new DefaultEventController(this);

    if (!DefaultRegistry.isComponentRegisteredByClassName(this.constructor.name)) {
      throw new ElementalComponentIsNotRegisteredException(this.constructor.name);
    }

    // create a unique id for the component
    this.id = options?.id?.valueOf() || randomId();
    this.tagName = DefaultRegistry.generateTagNameFromClassName(this.constructor.name);

    // attach any event listener
    this.registerEventListeners(this.options?.eventHandlers || []);

    this.$root = options?.noShadow
      ? this
      : this.attachShadow({
          // eslint-disable-next-line no-undef
          mode: options?.mode || ('open' as ShadowRootMode),
          delegatesFocus: options?.delegatesFocus || true,
        });

    // attach any template to shadow dom
    this.$template = (document.getElementById(this.tagName) as HTMLTemplateElement)?.content;
    if (this.$template) {
      this.debug('Attaching Template to ShadowRoot');
      this.$root.appendChild(this.$template.cloneNode(true));
    }

    if (hasValue(options?.state)) {
      this.updateState(options?.state as State); // will auto-render when update is done
    } else {
      this.renderComponent();
    }
  }

  public static register<T extends ElementalComponent<unknown>>(
    element: Class<T>,
    options?: RegistrationOptions,
  ): void {
    DefaultRegistry.registerComponent(element, options);
  }

  public static registerTemplate<T extends ElementalComponent<unknown>>(
    element: Class<T>,
    template: string,
    prefix?: ElementalComponentPrefix,
  ): void {
    DefaultRegistry.registerTemplate(element, template, prefix);
  }

  public static tagName<T extends ElementalComponent<unknown>>(
    element: Class<T>,
    prefix?: ElementalComponentPrefix,
  ): string {
    return DefaultRegistry.generateTagName(element, prefix);
  }

  public get $state(): State {
    return deserialize<State>(this.state || 'undefined');
  }

  public set $state(state: State) {
    this.updateState(state as State);
  }

  public updateState(value: State) {
    if (hasValue(value)) {
      this.setAttribute('state', serialize(value));
    }
  }

  public cloneState(): State | undefined {
    return deserialize(serialize(this.$state));
  }

  public registerEventListeners(registrations: EventListenerRegistration[]) {
    this.eventController.registerEventListeners(registrations);
  }

  public deregisterEventListeners() {
    this.eventController.deregisterEventListeners();
  }

  public raiseEvent<Payload = undefined>(name: string, isCustom?: boolean, payload?: Payload, options?: EventOptions) {
    this.eventController.raiseEvent(name, isCustom, payload, options);
  }

  protected connectedCallback() {
    this.debug('Connected');

    // attach any event listener
    this.registerEventListeners(this.options?.eventHandlers || []);
  }

  protected disconnectedCallback() {
    this.debug('Disconnected');
    this.deregisterEventListeners();
  }

  protected adoptedCallback() {
    this.debug('Adopted');
  }

  protected attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null) {
    this.debug('Attribute Changed', name, '| Old Value |> |>', oldVal, '| New Value |> |>', newVal);

    if (!this.hasAttribute(name)) {
      this.debug('Attribute Removed', name);

      return;
    }

    // add the attribute [name] as the property of this class
    Object.assign(this, { [name]: newVal });

    this.renderComponent();
  }

  protected abstract render(): string;

  private renderComponent(): void {
    const html = this.render();

    if (hasValue(html)) {
      this.debug('Rendering Component', html);
      this.$root.innerHTML = html;

      return;
    }

    throw new UnableToRenderElementalComponentException(this.constructor.name);
  }

  private debug(message?: string, ...optionalParams: unknown[]) {
    debug(`[elemental-component][${this.constructor.name}][id=${this.id}] ${message}`, ...optionalParams);
  }
}
