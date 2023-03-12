import { Class, debug, Exception, toKebabCase } from '@sohailalam2/abu';

import { ElementalComponentPrefix } from '../values';
import { RegistrationOptions } from './';

export class ElementalComponentIsNotRegisteredException extends Exception {}

export class ElementalComponentIsAlreadyRegistered extends Exception {}

export class RegistryController {
  private static readonly COMPONENT_CLASSNAME_TO_TAGNAME: Map<string, string> = new Map();

  private static defaultPrefix = ElementalComponentPrefix.from('el');

  private constructor() {
    // can not create instance of registry
  }

  public static setDefaultPrefix(prefix: ElementalComponentPrefix): void {
    RegistryController.defaultPrefix = prefix;
  }

  public static generateTagNameForClassName(className: string, prefix?: ElementalComponentPrefix): string {
    if (RegistryController.COMPONENT_CLASSNAME_TO_TAGNAME.has(className)) {
      return RegistryController.COMPONENT_CLASSNAME_TO_TAGNAME.get(className) as string;
    }
    const pfx = prefix || RegistryController.defaultPrefix;

    return `${pfx.value}-${toKebabCase(className)}`;
  }

  public static generateTagNameForElement(element: Class<HTMLElement>, prefix?: ElementalComponentPrefix): string {
    return RegistryController.generateTagNameForClassName(element.name, prefix);
  }

  public static getRegisteredTagName(className: string): string | undefined {
    return RegistryController.COMPONENT_CLASSNAME_TO_TAGNAME.get(className);
  }

  public static isComponentRegisteredWithClassName(className: string): boolean {
    return RegistryController.COMPONENT_CLASSNAME_TO_TAGNAME.has(className);
  }

  public static isComponentRegistered(element: Class<HTMLElement>): boolean {
    return RegistryController.isComponentRegisteredWithClassName(element.name);
  }

  public static isComponentRegisteredWithTagName(tagName: string): boolean {
    return !!customElements.get(tagName);
  }

  public static registerComponent(element: Class<HTMLElement>, options?: RegistrationOptions): void {
    const tagName = RegistryController.generateTagNameForElement(element, options?.prefix);

    if (customElements.get(tagName)) {
      throw new ElementalComponentIsAlreadyRegistered(tagName);
    }
    debug(`[elemental-component][registry] Registering component "${tagName}"`);

    RegistryController.COMPONENT_CLASSNAME_TO_TAGNAME.set(element.name, tagName);
    customElements.define(tagName, element, { extends: options?.extends ?? undefined });

    debug(`[elemental-component][registry] Component is successfully registered "${tagName}"`);
  }
}
