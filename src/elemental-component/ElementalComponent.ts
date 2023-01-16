import { Class, debug, hasValue, randomId } from '@sohailalam2/abu';

import { ElementalComponentOptions } from './types';
import { ElementalComponentPrefix } from './values';
import {
  RegistrationOptions,
  ElementalComponentRegistry,
  ElementalComponentIsNotRegisteredException,
  ElementalComponentTemplateNotFoundException,
} from './registry';
import { DefaultEventController, EventController, EventListenerRegistration, EventOptions } from './controller';

/**
 * ElementalComponent Class
 */
export abstract class ElementalComponent extends HTMLElement implements EventController {
  // list of attributes that will be made observable and for whom the attributeChangedCallback will be called
  static get observedAttributes(): string[] {
    return [];
  }

  public readonly tagName: string;

  public readonly $root: Element | ShadowRoot;

  protected readonly $template: HTMLTemplateElement;

  private readonly eventController: EventController;

  /**
   * ElementalComponent Constructor
   * @param options The configuration options for the component
   */
  constructor(private readonly options: ElementalComponentOptions = {}) {
    super();
    const className = this.constructor.name;

    this.ensureComponentIsNotAlreadyRegistered(className);
    this.configureAttributesAndProperties();

    this.id = this.getAttribute('id') || options.id?.value || randomId();
    this.tagName = ElementalComponentRegistry.generateTagNameForClassName(className);

    this.$root = options.noShadow
      ? this
      : this.attachShadow({
          // eslint-disable-next-line no-undef
          mode: options.mode || ('open' as ShadowRootMode),
          delegatesFocus: options.delegatesFocus ?? true,
        });
    this.$template = this.setupTemplate(this.options?.templateId);

    this.eventController = new DefaultEventController(this);
    this.eventController.registerEventListeners(this.options?.eventHandlers || []);
  }

  private ensureComponentIsNotAlreadyRegistered(className: string) {
    const isRegistered = ElementalComponentRegistry.isComponentRegisteredWithClassName(className);

    if (!isRegistered) {
      throw new ElementalComponentIsNotRegisteredException(className);
    }
  }

  public static register<T extends ElementalComponent>(element: Class<T>, options?: RegistrationOptions): void {
    ElementalComponentRegistry.registerComponent(element, options);
  }

  public static tagName<T extends ElementalComponent>(element: Class<T>, prefix?: ElementalComponentPrefix): string {
    return ElementalComponentRegistry.generateTagNameForElement(element, prefix);
  }

  public registerEventListeners(registrations: EventListenerRegistration[]) {
    if (!Array.isArray(this.options.eventHandlers)) {
      this.options.eventHandlers = [];
    }
    registrations.forEach(reg => {
      if (!this.options.eventHandlers?.includes(reg)) {
        this.options.eventHandlers?.push(reg);
      }
    });
    this.eventController.registerEventListeners(this.options.eventHandlers);
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
    this.render();
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
    if (this.isConnected) {
      this.render();
    }
  }

  protected abstract render(): void;

  private configureAttributesAndProperties(): void {
    const uniqueAttributes = new Set(ElementalComponent.observedAttributes.concat(this.getAttributeNames()));
    const attributes = Array.from(uniqueAttributes);

    attributes.forEach(attribute => {
      if (!this.hasAttribute(attribute)) {
        this.setAttribute(attribute, '');
      }
      // add the attribute [name] as the property of this class
      Object.assign(this, { [attribute]: undefined });
    });
  }

  private setupTemplate(templateId: string | undefined): HTMLTemplateElement {
    const template = this.getTemplateFromSomewhereIfPossible(templateId);

    if (template) {
      this.debug('Template found... cloning template to $root node');
      this.$root.appendChild(template.content.cloneNode(true));
    }

    return template;
  }

  private getTemplateFromSomewhereIfPossible(templateId: string | undefined): HTMLTemplateElement {
    if (templateId) {
      return this.findRegisteredTemplateById(templateId);
    }

    return this.findRegisteredParentTemplate() || this.findRegisteredTemplateByTagName();
  }

  private findRegisteredTemplateById(templateId: string) {
    const template = document.getElementById(templateId) as HTMLTemplateElement;

    if (!template) {
      throw new ElementalComponentTemplateNotFoundException(templateId);
    }

    return template;
  }

  private findRegisteredTemplateByTagName() {
    this.debug('Checking any registered child template');
    const tagName = ElementalComponentRegistry.generateTagNameForClassName(this.constructor.name);

    return document.getElementById(tagName) as HTMLTemplateElement;
  }

  private findRegisteredParentTemplate() {
    const proto = Object.getPrototypeOf(this.constructor.prototype);
    const parentElement = proto.constructor as Class<ElementalComponent>;

    if (!parentElement) {
      return null;
    }
    this.debug(`Component extends parent component "${parentElement.name}"`);

    if (!ElementalComponentRegistry.isTemplateRegistered(parentElement)) {
      this.debug(`Parent component "${parentElement.name}" does not have a registered template`);

      return null;
    }

    this.debug(`Parent component "${parentElement.name}" has a registered template`);
    const parentTagName = ElementalComponentRegistry.getRegisteredTagName(parentElement.name) as string;

    return document.getElementById(parentTagName) as HTMLTemplateElement;
  }

  private debug(message?: string, ...optionalParams: unknown[]) {
    debug(`[elemental-component][${this.constructor.name}][id=${this.id}] ${message}`, ...optionalParams);
  }
}
