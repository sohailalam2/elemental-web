import { Class, debug, Exception, hasValue, toKebabCase } from '@sohailalam2/abu';

import { ElementalComponentPrefix } from '../values';

import { RegistrationOptions } from './';

export class ElementalComponentIsNotRegisteredException extends Exception {}

export class ElementalComponentIsAlreadyRegistered extends Exception {}

export class ElementalComponentTemplateCanNotBeEmptyException extends Exception {}

export class ElementalComponentTemplateIsAlreadyRegisteredException extends Exception {}

export class ElementalComponentTemplateNotFoundException extends Exception {}

export class ElementalComponentRegistry {
  private static readonly COMPONENT_CLASSNAME_TO_TAGNAME: Map<string, string> = new Map();

  private static readonly TEMPLATE_CLASSNAMES: Set<string> = new Set();

  private static defaultPrefix = ElementalComponentPrefix.from('el');

  private constructor() {
    // can not create instance of registry
  }

  public static setDefaultPrefix(prefix: ElementalComponentPrefix): void {
    ElementalComponentRegistry.defaultPrefix = prefix;
  }

  public static generateTagNameForClassName(className: string, prefix?: ElementalComponentPrefix): string {
    if (ElementalComponentRegistry.COMPONENT_CLASSNAME_TO_TAGNAME.has(className)) {
      return ElementalComponentRegistry.COMPONENT_CLASSNAME_TO_TAGNAME.get(className) as string;
    }
    const pfx = prefix || ElementalComponentRegistry.defaultPrefix;

    return `${pfx.value}-${toKebabCase(className)}`;
  }

  public static generateTagNameForElement(element: Class<HTMLElement>, prefix?: ElementalComponentPrefix): string {
    return ElementalComponentRegistry.generateTagNameForClassName(element.name, prefix);
  }

  public static getRegisteredTagName(className: string): string | undefined {
    return ElementalComponentRegistry.COMPONENT_CLASSNAME_TO_TAGNAME.get(className);
  }

  public static isComponentRegisteredWithClassName(className: string): boolean {
    return ElementalComponentRegistry.COMPONENT_CLASSNAME_TO_TAGNAME.has(className);
  }

  public static isComponentRegistered(element: Class<HTMLElement>): boolean {
    return ElementalComponentRegistry.isComponentRegisteredWithClassName(element.name);
  }

  public static isComponentRegisteredWithTagName(tagName: string): boolean {
    return !!customElements.get(tagName);
  }

  public static isTemplateRegistered(element: Class<HTMLElement>): boolean {
    return ElementalComponentRegistry.TEMPLATE_CLASSNAMES.has(element.name);
  }

  public static isTemplateRegisteredWithTagName(tagName: string): boolean {
    return !!document.getElementById(tagName);
  }

  public static registerComponent(element: Class<HTMLElement>, options?: RegistrationOptions): void {
    const tagName = ElementalComponentRegistry.generateTagNameForElement(element, options?.prefix);

    if (customElements.get(tagName)) {
      throw new ElementalComponentIsAlreadyRegistered(tagName);
    }
    debug(`[elemental-component][registry] Registering component "${tagName}"`);

    // NOTE: the order of template and component registration is important
    // as only a pre-registered template can be discovered by a component
    if (options?.template !== undefined || options?.templateId !== undefined) {
      ElementalComponentRegistry.registerTemplate(element, options);
    }

    ElementalComponentRegistry.COMPONENT_CLASSNAME_TO_TAGNAME.set(element.name, tagName);
    customElements.define(tagName, element, { extends: options?.extends ?? undefined });

    debug(`[elemental-component][registry] Component is successfully registered "${tagName}"`);
  }

  public static registerTemplate(element: Class<HTMLElement>, options?: RegistrationOptions): void {
    const tagName = ElementalComponentRegistry.generateTagNameForElement(element, options?.prefix);

    debug(`[elemental-component][registry] Registering template for component "${tagName}"`);
    this.validateTemplateBeforeRegistration(tagName, options);
    this.createTemplateElement(tagName, element, options);
    this.addStylesToTemplate(tagName, options);
    debug(`[elemental-component][registry] Template is successfully registered for component "${tagName}"`);
  }

  private static validateTemplateBeforeRegistration(tagName: string, options?: RegistrationOptions) {
    if (options?.template === undefined && options?.templateId === undefined) {
      throw new ElementalComponentTemplateNotFoundException();
    }

    let template: string | undefined = options?.template;

    if (options?.templateId) {
      template = (document.getElementById(options.templateId) as HTMLTemplateElement)?.innerHTML;

      if (!template) {
        throw new ElementalComponentTemplateNotFoundException(options.templateId);
      }
    } else if (ElementalComponentRegistry.isTemplateRegisteredWithTagName(tagName)) {
      throw new ElementalComponentTemplateIsAlreadyRegisteredException(tagName);
    }

    if (!hasValue(template)) {
      throw new ElementalComponentTemplateCanNotBeEmptyException(tagName);
    }
  }

  private static createTemplateElement(tagName: string, element: Class<HTMLElement>, options?: RegistrationOptions) {
    let template: string | undefined = options?.template;

    if (options?.templateId) {
      template = (document.getElementById(options.templateId) as HTMLTemplateElement)?.innerHTML;
    }
    ElementalComponentRegistry.TEMPLATE_CLASSNAMES.add(element.name);
    const templateElement = document.createElement('template');

    templateElement.id = tagName;
    templateElement.innerHTML = template as string;
    document.body.prepend(templateElement);
  }

  private static addStylesToTemplate(tagName: string, options?: RegistrationOptions) {
    if (options?.styles) {
      debug(`[elemental-component][registry] Adding styles to template # "${tagName}"`);
      const template = document.getElementById(tagName) as HTMLTemplateElement;
      let style = template.content.querySelector('style') as HTMLStyleElement;

      if (!style) {
        style = document.createElement('style');
        template.content.prepend(style);
      }

      style.textContent = options.styles;
    }
  }
}
