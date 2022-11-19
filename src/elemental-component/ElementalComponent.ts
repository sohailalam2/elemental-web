import { Class, debug, deserialize, hasValue, randomId, serialize } from '@sohailalam2/abu';

import { ElementalComponentOptions } from './types';
import { ElementalComponentPrefix } from './values';
import {
  RegistrationOptions,
  ElementalComponentRegistry,
  ElementalComponentIsNotRegisteredException,
  ElementalComponentNoSuchTemplateFoundException,
} from './registry';
import { DefaultEventController, EventController, EventListenerRegistration, EventOptions } from './controller';

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

  protected readonly $template: HTMLTemplateElement;

  private readonly eventController: EventController;

  private state: string | undefined = undefined;

  /**
   * ElementalComponent Constructor
   * @param options The configuration options for the component
   */
  constructor(private readonly options: ElementalComponentOptions = {}) {
    super();
    const className = this.constructor.name;
    const isRegistered = ElementalComponentRegistry.isComponentRegisteredByClassName(className);

    if (!isRegistered) {
      throw new ElementalComponentIsNotRegisteredException(className);
    }

    this.$root = options.noShadow
      ? this
      : this.attachShadow({
          // eslint-disable-next-line no-undef
          mode: options.mode || ('open' as ShadowRootMode),
          delegatesFocus: options.delegatesFocus ?? true,
        });

    this.configureAttributesAndProperties(ElementalComponent.observedAttributes);
    this.configureAttributesAndProperties(this.getAttributeNames());

    this.id = this.getAttribute('id') || options.id?.value || randomId();
    this.tagName = ElementalComponentRegistry.generateTagNameFromClassName(className);

    this.$template = this.setupTemplate(this.options?.templateId);

    this.eventController = new DefaultEventController(this);
    this.eventController.registerEventListeners(this.options?.eventHandlers || []);

    if (hasValue(this.options?.state)) {
      this.updateState(this.options?.state as State); // will auto-render when update is done
    } else {
      this.render();
    }
  }

  public static register<T extends ElementalComponent<unknown>>(
    element: Class<T>,
    options?: RegistrationOptions,
  ): void {
    ElementalComponentRegistry.registerComponent(element, options);
  }

  public static registerTemplate<T extends ElementalComponent<unknown>>(
    element: Class<T>,
    template: string,
    prefix?: ElementalComponentPrefix,
  ): void {
    ElementalComponentRegistry.registerTemplate(element, template, prefix);
  }

  public static tagName<T extends ElementalComponent<unknown>>(
    element: Class<T>,
    prefix?: ElementalComponentPrefix,
  ): string {
    return ElementalComponentRegistry.generateTagName(element, prefix);
  }

  protected deserialize(serializedState: string | undefined): State {
    return deserialize<State>(serializedState || 'undefined');
  }

  public get $state(): State {
    return this.deserialize(this.state);
  }

  public updateState(value: State) {
    if (hasValue(value)) {
      this.setAttribute('state', serialize(value));
    }
  }

  public cloneState(): State | undefined {
    return this.deserialize(serialize(this.$state));
  }

  public registerEventListeners(registrations: EventListenerRegistration[]) {
    if (!this.options?.eventHandlers) {
      this.options.eventHandlers = [];
    }
    registrations.forEach(reg => {
      if (!this.options?.eventHandlers?.includes(reg)) {
        this.options?.eventHandlers?.push(reg);
      }
    });
    this.eventController.registerEventListeners(this.options?.eventHandlers);
  }

  public deregisterEventListeners() {
    this.eventController.deregisterEventListeners();
    if (this.options) {
      this.options.eventHandlers = [];
    }
  }

  public raiseEvent(name: string, options?: EventOptions): void;

  public raiseEvent(name: string, isCustom?: boolean, options?: EventOptions): void;

  public raiseEvent<Payload = undefined>(
    name: string,
    isCustom?: boolean,
    payload?: Payload,
    options?: EventOptions,
  ): void;

  public raiseEvent<Payload = undefined>(
    name: string,
    isCustomOrOptions?: boolean | EventOptions,
    payload?: Payload,
    options?: EventOptions,
  ) {
    let isCustom = false;
    let opts: EventOptions | undefined = options;

    if (hasValue(isCustomOrOptions)) {
      if (typeof isCustomOrOptions === 'boolean') {
        isCustom = isCustomOrOptions;
      } else if (!options) {
        opts = isCustomOrOptions;
      }
    }
    this.eventController.raiseEvent(name, isCustom, payload, opts);
  }

  protected connectedCallback() {
    this.debug('Connected');
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
    this.debug('Attribute Changed: ', name, '| Old Value = ', oldVal, '| New Value = ', newVal);

    if (!this.hasAttribute(name)) {
      this.debug('Attribute Removed', name);

      return;
    }
    // add the attribute [name] as the property of this class
    Object.assign(this, { [name]: newVal });
    this.render();
  }

  protected abstract render(): void;

  private configureAttributesAndProperties(attributes: string[]): void {
    attributes.forEach(attribute => {
      if (!this.hasAttribute(attribute)) {
        this.setAttribute(attribute, '');
      }
      // add the attribute [name] as the property of this class
      Object.assign(this, { [attribute]: undefined });
    });
  }

  private setupTemplate(templateId: string | undefined): HTMLTemplateElement {
    let template: HTMLTemplateElement;

    const proto = Object.getPrototypeOf(this.constructor.prototype);
    const parentElement = proto.constructor as Class<ElementalComponent>;
    const parentTagName = ElementalComponentRegistry.registeredTagName(parentElement.name);
    const tagName = ElementalComponentRegistry.generateTagNameFromClassName(this.constructor.name);

    if (templateId) {
      template = document.getElementById(templateId) as HTMLTemplateElement;

      if (!template) {
        throw new ElementalComponentNoSuchTemplateFoundException(templateId);
      }
    } else if (parentTagName) {
      this.debug(`Component extends "${parentElement.name}"... checking template in parent`);

      if (ElementalComponentRegistry.isTemplateRegistered(parentElement)) {
        this.debug('Found a registered parent template');
        template = document.getElementById(parentTagName) as HTMLTemplateElement;
      } else {
        this.debug('Checking any registered child template');
        template = document.getElementById(tagName) as HTMLTemplateElement;
      }
    } else {
      this.debug('Checking any registered template');
      template = document.getElementById(tagName) as HTMLTemplateElement;
    }

    if (template) {
      this.debug('Template found... cloning template to $root node');
      this.$root.appendChild(template.content.cloneNode(true));
    }

    return template;
  }

  private debug(message?: string, ...optionalParams: unknown[]) {
    debug(`[elemental-component][${this.constructor.name}][id=${this.id}] ${message}`, ...optionalParams);
  }
}
