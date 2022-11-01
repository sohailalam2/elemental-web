import { Class, debug, deserialize, hasValue, randomId, serialize, toKebabCase } from '@sohailalam2/abu';

import {
  ElementalComponentOptions,
  ElementalComponentEventHandlerRegistration,
  ElementalComponentEventOptions,
  ElementalComponentCustomEventHandlerNotDefined,
  ElementalComponentNotRegisteredException,
  UnableToRenderElementalComponentException,
  ElementalComponentPrefix,
} from './';

/**
 * ElementalComponent Class
 */
export abstract class ElementalComponent<State = string> extends HTMLElement {
  // A registry of all registered components
  // map(class-name => tag-name)
  private static readonly COMPONENT_REGISTRY: Map<string, string> = new Map();

  // list of attributes that will be made observable and for whom the attributeChangedCallback will be called
  static get observedAttributes(): string[] {
    return ['state'];
  }

  public readonly shadowRoot: ShadowRoot;

  // The Class name of the component
  public readonly name: string;

  public readonly $template: DocumentFragment;

  private state: string | undefined = undefined;

  // map(event-name => handler-function-reference)
  private readonly eventHandlers: Map<string, ElementalComponentEventHandlerRegistration> = new Map();

  /**
   * ElementalComponent Constructor
   * @param options The configuration options for the component
   */
  constructor(private readonly options?: ElementalComponentOptions) {
    super();
    this.name = this.constructor.name;

    if (!ElementalComponent.COMPONENT_REGISTRY.has(this.name)) {
      throw new ElementalComponentNotRegisteredException(this.name);
    }

    // create a unique id for the component
    this.id = options?.id?.valueOf() || randomId();

    // attach any event listener
    this.addEventHandlers(this.options?.eventHandlers || []);

    this.shadowRoot = this.attachShadow({
      // eslint-disable-next-line no-undef
      mode: options?.mode || ('open' as ShadowRootMode),
      delegatesFocus: options?.delegatesFocus || true,
    });

    // attach any template to shadow dom
    this.$template = (document.getElementById(this.cid) as HTMLTemplateElement)?.content;
    if (this.$template) {
      this.debug('Attaching Template to ShadowRoot');
      this.shadowRoot.appendChild(this.$template.cloneNode(true));
    }

    if (hasValue(options?.state)) {
      this.updateState(options?.state as State); // will auto-render when update is done
    } else {
      this.renderComponent();
    }
  }

  public get $state(): State {
    return deserialize<State>(this.state || 'undefined');
  }

  public set $state(state: State) {
    this.updateState(state as State);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static register<T extends ElementalComponent<any>>(
    element: Class<T>,
    prefix?: ElementalComponentPrefix,
  ): void {
    const pfx = prefix?.valueOf() || ElementalComponentPrefix.from('el').valueOf();
    const componentName = `${pfx}-${toKebabCase(element.name)}`;

    if (!customElements.get(componentName)) {
      debug(`[elemental-web][${element.name}] Registering "${componentName}"`);
      ElementalComponent.COMPONENT_REGISTRY.set(element.name, componentName); // the order is important here
      customElements.define(componentName, element);
      debug(`[elemental-web][${element.name}] ElementalComponent Registered "${componentName}"`);
    }
  }

  public get cid(): string {
    return ElementalComponent.COMPONENT_REGISTRY.get(this.name) as string;
  }

  public updateState(value: State) {
    if (hasValue(value)) {
      this.setAttribute('state', serialize(value));
    }
  }

  public cloneState(): State | undefined {
    return deserialize(serialize(this.$state));
  }

  protected addEventHandlers(registrations: ElementalComponentEventHandlerRegistration[]) {
    registrations.forEach(registration => {
      const { name, isCustomEvent } = registration;
      let { handlerName, handler, options } = registration;

      if (this.eventHandlers.has(name)) {
        this.debug(`Skipping duplicate event handler registration ${name} => $handlerName}`);

        return;
      }

      if (!handler && !handlerName) {
        throw new ElementalComponentCustomEventHandlerNotDefined(handlerName);
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line security/detect-object-injection
      const methodRef = handler || (this[handlerName] as (e: Event) => void)?.bind(this);

      if (!methodRef) {
        throw new ElementalComponentCustomEventHandlerNotDefined(handlerName);
      }

      handler = methodRef;
      handlerName = methodRef.name;

      if (!options) {
        options = { capture: true };
      }

      this.eventHandlers.set(name, { name, isCustomEvent, handlerName, handler, options });

      if (isCustomEvent) {
        document.addEventListener(name, methodRef, options);
      } else {
        this.addEventListener(name, methodRef, options);
      }
      this.debug(`Added EventListener ${name} => $handlerName}`);
    });
  }

  protected removeEventHandlers() {
    for (const [eventName, reg] of this.eventHandlers.entries()) {
      if (reg && reg.name && reg.handler) {
        if (reg.isCustomEvent) {
          document.removeEventListener(reg.name, reg.handler, reg.options);
        } else {
          this.removeEventListener(reg.name, reg.handler, reg.options);
        }
        this.debug(`Removed EventListener ${eventName} => ${reg.handler.name}`);
      }
    }
  }

  protected raiseEvent<T = undefined>(
    name: string,
    payload: T,
    options: ElementalComponentEventOptions = { bubbles: true, cancelable: true },
  ) {
    let event: Event;

    if (payload) {
      event = new CustomEvent(name, {
        detail: payload ? serialize(payload) : undefined,
        ...options,
      });
    } else {
      event = new Event(name, options);
    }

    this.dispatchEvent(event);
  }

  protected connectedCallback() {
    this.debug('Connected');

    // attach any event listener
    this.addEventHandlers(this.options?.eventHandlers || []);
  }

  protected disconnectedCallback() {
    this.debug('Disconnected');
    this.removeEventHandlers();
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line security/detect-object-injection
    this[name] = newVal; // add the attribute as a property
    this.renderComponent();
  }

  protected abstract render(): string;

  private renderComponent(): void {
    const html = this.render();

    if (hasValue(html)) {
      this.debug('Rendering Component', html);
      this.shadowRoot.innerHTML = html;

      return;
    }

    throw new UnableToRenderElementalComponentException(this.name);
  }

  private debug(message?: string, ...optionalParams: unknown[]) {
    debug(`[elemental-web][${this.name}][id=${this.id}] ${message}`, ...optionalParams);
  }
}
