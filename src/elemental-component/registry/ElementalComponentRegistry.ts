import { Class, debug, Exception, hasValue, toKebabCase } from '@sohailalam2/abu';

import { ElementalComponentPrefix } from '../values';

import { RegistrationOptions } from './';

export class ElementalComponentIsNotRegisteredException extends Exception {}

export class ElementalComponentIsAlreadyRegistered extends Exception {}

export class ElementalComponentTemplateCanNotBeEmptyException extends Exception {}

export class ElementalComponentTemplateIsAlreadyRegistered extends Exception {}

export class ElementalComponentNoSuchTemplateFoundException extends Exception {}

export class ElementalComponentRegistry {
  // map(class-name => tag-name)
  private static readonly COMPONENT_REGISTRY: Map<string, string> = new Map();

  // set(class-name)
  private static readonly TEMPLATE_REGISTRY: Set<string> = new Set();

  private static defaultPrefix = ElementalComponentPrefix.from('el');

  private constructor() {
    // can not create instance of registry
  }

  public static setDefaultPrefix(prefix: ElementalComponentPrefix): void {
    ElementalComponentRegistry.defaultPrefix = prefix;
  }

  public static generateTagNameFromClassName(className: string, prefix?: ElementalComponentPrefix): string {
    if (ElementalComponentRegistry.COMPONENT_REGISTRY.has(className)) {
      return ElementalComponentRegistry.COMPONENT_REGISTRY.get(className) as string;
    }

    const pfx = prefix || ElementalComponentRegistry.defaultPrefix;

    return `${pfx.value}-${toKebabCase(className)}`;
  }

  public static generateTagName(element: Class<HTMLElement>, prefix?: ElementalComponentPrefix): string {
    return ElementalComponentRegistry.generateTagNameFromClassName(element.name, prefix);
  }

  public static registerComponent(element: Class<HTMLElement>, options?: RegistrationOptions): void {
    const tagName = ElementalComponentRegistry.generateTagName(element, options?.prefix);

    if (customElements.get(tagName)) {
      throw new ElementalComponentIsAlreadyRegistered(tagName);
    }

    debug(`[elemental-component] Registering Component "${tagName}"`);

    let template: string | undefined = options?.template;

    if (options?.templateId) {
      template = (document.getElementById(options.templateId) as HTMLTemplateElement)?.innerHTML;

      if (!template) {
        throw new ElementalComponentNoSuchTemplateFoundException(options.templateId);
      }
    }

    if (template) {
      ElementalComponentRegistry.registerTemplate(element, template, options?.prefix);
    }

    // Register the component... the order is important here
    // 1. > Register in ElementalComponentRegistry
    ElementalComponentRegistry.COMPONENT_REGISTRY.set(element.name, tagName);
    // 2. > Register in customElements.define()
    customElements.define(tagName, element, { extends: options?.extends ?? undefined });

    debug(`[elemental-component] Component Registration Complete "${tagName}"`);
  }

  public static registeredTagName(className: string): string | undefined {
    return ElementalComponentRegistry.COMPONENT_REGISTRY.get(className);
  }

  public static isComponentRegisteredByClassName(elementClassName: string): boolean {
    return ElementalComponentRegistry.COMPONENT_REGISTRY.has(elementClassName);
  }

  public static isComponentRegistered(element: Class<HTMLElement>): boolean {
    return ElementalComponentRegistry.isComponentRegisteredByClassName(element.name);
  }

  public static isComponentRegisteredByTagName(tagName: string): boolean {
    return !!customElements.get(tagName);
  }

  public static registerTemplate(
    element: Class<HTMLElement>,
    template: string,
    prefix?: ElementalComponentPrefix,
  ): void {
    const tagName = ElementalComponentRegistry.generateTagName(element, prefix);

    if (ElementalComponentRegistry.isTemplateRegisteredByTagName(tagName)) {
      throw new ElementalComponentTemplateIsAlreadyRegistered(tagName);
    }

    debug(`[elemental-component] Registering Component Template "${tagName}"`);

    if (!hasValue(template)) {
      throw new ElementalComponentTemplateCanNotBeEmptyException(tagName);
    }

    ElementalComponentRegistry.TEMPLATE_REGISTRY.add(element.name);
    const tmpl = document.createElement('template');

    tmpl.id = tagName;
    tmpl.innerHTML = template;

    document.body.prepend(tmpl);

    debug(`[elemental-component] Component Template Registration Complete "${tagName}"`);
  }

  public static isTemplateRegistered(element: Class<HTMLElement>): boolean {
    return ElementalComponentRegistry.TEMPLATE_REGISTRY.has(element.name);
  }

  public static isTemplateRegisteredByTagName(tagName: string): boolean {
    return !!document.getElementById(tagName);
  }
}
