import { Class, debug, hasValue, randomId } from '@sohailalam2/abu';

import { ElementalComponentOptions } from '../types';
import { ElementalComponentId, ElementalComponentPrefix } from '../values';
import { ElementalComponentIsNotRegisteredException, RegistrationOptions, RegistryController } from '../registry';
import { EventController, EventListenerRegistration, EventOptions } from '../event';
import {
  DecoratorMetadataValue,
  DecoratorProcessor,
  EventListener,
  EventListenerDecoratorMetadataValue,
} from '../decorator';
import { TemplateController } from '../template';

/**
 * ElementalComponent Class
 */
export abstract class ElementalComponent extends HTMLElement {
  // list of attributes that will be made observable and for whom the attributeChangedCallback will be called
  static get observedAttributes(): string[] {
    return [];
  }

  public static readonly IS_ELEMENTAL_COMPONENT = true;

  public readonly tagName: string;

  public readonly $root: Element | ShadowRoot;

  protected readonly $template: HTMLTemplateElement;

  private readonly eventController = new EventController(this);

  private readonly templateController = new TemplateController(this);

  /**
   * ElementalComponent Constructor
   * @param options The configuration options for the component
   */
  constructor(private readonly options: ElementalComponentOptions = {}) {
    super();
    const className = this.constructor.name;

    // ensure that the component is not already registered
    this.ensureComponentIsRegistered(className);
    this.configureAttributesAndProperties();
    // assign component properties
    this.tagName = RegistryController.generateTagNameForClassName(className);
    this.id = this.getComponentId(options?.id);
    this.$root = this.getComponentDocumentRoot(options);
    this.$template = this.processTemplateAndStyles(this.options?.templateId);
    // process all decorators at the end
    this.processDecorators();
  }

  //  ------------------------------------------------------------------------------------
  //  Static Methods
  //  ------------------------------------------------------------------------------------

  public static register<T extends ElementalComponent>(element: Class<T>, options?: RegistrationOptions): void {
    // NOTE: the order of template and component registration is important
    // as only a pre-registered template can be discovered by a component
    TemplateController.registerTemplateAndStyles(element, options);
    RegistryController.registerComponent(element, options);
  }

  public static tagName<T extends ElementalComponent>(element: Class<T>, prefix?: ElementalComponentPrefix): string {
    return RegistryController.generateTagNameForElement(element, prefix);
  }

  //  ------------------------------------------------------------------------------------
  //  Instance Methods
  //  ------------------------------------------------------------------------------------

  protected abstract render(): void;

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

  public $<E extends Element, B extends boolean = false>(
    selector: string,
    selectMultiple?: B,
    // eslint-disable-next-line no-undef
  ): B extends true ? NodeListOf<E> | null : E | null {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return selectMultiple ? this.$root.querySelectorAll<E>(selector) : this.$root.querySelector<E>(selector);
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

  private ensureComponentIsRegistered(className: string) {
    const isRegistered = RegistryController.isComponentRegisteredWithClassName(className);

    if (!isRegistered) {
      throw new ElementalComponentIsNotRegisteredException(className);
    }
  }

  private getComponentId(id?: ElementalComponentId): string {
    let cid = this.getAttribute('id') || id?.value || randomId();

    if (!cid || cid === 'undefined') {
      cid = randomId();
    }

    return cid;
  }

  private getComponentDocumentRoot(options?: ElementalComponentOptions): HTMLElement | ShadowRoot {
    return options?.noShadow
      ? this
      : this.attachShadow({
          // eslint-disable-next-line no-undef
          mode: options?.mode || ('open' as ShadowRootMode),
          delegatesFocus: options?.delegatesFocus ?? true,
        });
  }

  private processDecorators(): void {
    // get component decorators
    const decorators: DecoratorMetadataValue[] = DecoratorProcessor.getAllDecoratorMetadata(this, EventListener);

    this.processEventListenerDecorators(decorators);
  }

  private processEventListenerDecorators(metadata: DecoratorMetadataValue[]) {
    const listeners = metadata.map(m => {
      const ev = m as EventListenerDecoratorMetadataValue;

      return {
        name: ev.eventName,
        handlerName: ev.handlerName,
        attachTo: ev.attachTo ? (this.$root.querySelector(ev.attachTo) as HTMLElement) : undefined,
        isCustomEvent: ev.isCustomEvent,
        options: ev.options,
      };
    });

    this.debug('Registering Decorated Event Listeners: ', metadata, listeners);

    this.registerEventListeners(listeners);
  }

  private processTemplateAndStyles(templateId: string | undefined): HTMLTemplateElement {
    const template = this.templateController.findRegisteredTemplate(templateId);

    if (template) {
      this.debug('Template found... cloning template to $root node');
      this.$root.appendChild(template.content.cloneNode(true));
    }

    if ('adoptedStyleSheets' in document && !this.options.noShadow) {
      if (!(this.$root as ShadowRoot).adoptedStyleSheets) {
        (this.$root as ShadowRoot).adoptedStyleSheets = [];
      }
      this.templateController.findRegisteredStyles().forEach(stylesheet => {
        (this.$root as ShadowRoot).adoptedStyleSheets.push(stylesheet);
      });
    }

    return template;
  }

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

  //  ------------------------------------------------------------------------------------
  //  Loggers
  //  ------------------------------------------------------------------------------------

  private debug(message?: string, ...optionalParams: unknown[]) {
    const { name } = this.constructor;

    debug(`[elemental-component][component][name=${name}][id=${this.id}] ${message}`, ...optionalParams);

    if (this.id === 'undefined') {
      debug(`ID is undefined - ${this}`, ...optionalParams);
    }
  }
}
