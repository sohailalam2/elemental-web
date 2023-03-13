import { Class, debug, Exception, hasValue } from '@sohailalam2/abu';

import { hashCode } from '../utils';
import { ElementalComponent } from '../component';
import { RegistrationOptions, RegistryController } from '../registry';

export class ElementalComponentTemplateCanNotBeEmptyException extends Exception {}

export class ElementalComponentTemplateIsAlreadyRegisteredException extends Exception {}

export class ElementalComponentTemplateNotFoundException extends Exception {}

export class TemplateController<T extends HTMLElement> {
  private static readonly TEMPLATE_CLASSNAMES: Set<string> = new Set();

  // cache for styles (css): css-hash => CSSStyleSheet
  private static readonly CSS_HASH_TO_STYLES_MAP: Map<string, CSSStyleSheet> = new Map();

  // cache for styles (css): elementName => [css-hash]
  private static readonly ELEMENT_NAME_TO_CSS_HASH_MAP: Map<string, Set<string>> = new Map();

  constructor(private readonly component: T) {}

  //  ------------------------------------------------------------------------------------
  //  Static Methods
  //  ------------------------------------------------------------------------------------

  public static isTemplateRegistered(element: Class<HTMLElement>): boolean {
    return TemplateController.TEMPLATE_CLASSNAMES.has(element.name);
  }

  public static isTemplateRegisteredWithTagName(tagName: string): boolean {
    return !!document.getElementById(tagName);
  }

  public static registerTemplateAndStyles(element: Class<HTMLElement>, options?: RegistrationOptions): void {
    const tagName = RegistryController.generateTagNameForElement(element, options?.prefix);

    // Register template if any
    if (options?.template !== undefined || options?.templateId !== undefined) {
      this.debug(`Registering template for component "${tagName}"`);
      this.validateTemplateBeforeRegistration(tagName, options);
      this.createTemplateElement(tagName, element, options);
    }

    // Register styles if any
    if (options?.styles) {
      this.debug(`Registering styles for component "${tagName}"`);
      let stylesheets = options.styles;

      if (!Array.isArray(stylesheets)) {
        stylesheets = [stylesheets];
      }
      if ('adoptedStyleSheets' in document) {
        this.cacheStyles(element.name, stylesheets);
      } else {
        this.addStylesToTemplate(tagName, stylesheets);
      }
    }
    this.debug(`Template/Styles have been successfully registered for component "${tagName}"`);
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
    } else if (TemplateController.isTemplateRegisteredWithTagName(tagName)) {
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
    TemplateController.TEMPLATE_CLASSNAMES.add(element.name);
    const templateElement = document.createElement('template');

    templateElement.id = tagName;
    templateElement.innerHTML = template as string;
    document.body.prepend(templateElement);
  }

  private static cacheStyles(elementName: string, stylesheets: string[]) {
    if (!this.ELEMENT_NAME_TO_CSS_HASH_MAP.has(elementName)) {
      this.ELEMENT_NAME_TO_CSS_HASH_MAP.set(elementName, new Set<string>());
    }
    const elementStylesheets = this.ELEMENT_NAME_TO_CSS_HASH_MAP.get(elementName) as Set<string>;

    stylesheets.forEach(stylesheet => {
      const hash = hashCode(stylesheet);

      if (!this.CSS_HASH_TO_STYLES_MAP.has(hash)) {
        this.debug(`Caching new stylesheet (hash=${hash}) for "${elementName}"`);
        const sheet = new CSSStyleSheet();

        sheet.replaceSync(stylesheet);
        this.CSS_HASH_TO_STYLES_MAP.set(hash, sheet);
      }

      this.debug(`Linking cached stylesheet (hash=${hash}) for "${elementName}"`);
      elementStylesheets.add(hash);
    });
  }

  private static addStylesToTemplate(tagName: string, stylesheets: string[]) {
    TemplateController.debug(`Adding stylesheets to template # "${tagName}"`);
    const template = document.getElementById(tagName) as HTMLTemplateElement;
    let style = template.content.querySelector('style') as HTMLStyleElement;

    if (!style) {
      style = document.createElement('style');
      template.content.prepend(style);
    }

    style.textContent = stylesheets.join('\n');
  }

  //  ------------------------------------------------------------------------------------
  //  Instance Methods
  //  ------------------------------------------------------------------------------------

  public findRegisteredTemplate(templateId: string | undefined): HTMLTemplateElement {
    if (templateId) {
      return this.findRegisteredTemplateById(templateId);
    }

    return this.findRegisteredParentTemplate() || this.findRegisteredTemplateByTagName();
  }

  public findRegisteredStyles(): CSSStyleSheet[] {
    const allHashes: Set<string> = new Set<string>();

    // check the element
    const elementName = this.component.constructor.name;
    const hashes = TemplateController.ELEMENT_NAME_TO_CSS_HASH_MAP.get(elementName);

    if (hashes) {
      this.debug(`Found cached styles for "${elementName}"`);
      hashes.forEach(hash => allHashes.add(hash));
    }

    // check parent element
    const proto = Object.getPrototypeOf(this.component.constructor.prototype);
    const parentElement = proto.constructor as Class<ElementalComponent>;

    if (parentElement) {
      const parentHashes = TemplateController.ELEMENT_NAME_TO_CSS_HASH_MAP.get(parentElement.name);

      if (parentHashes) {
        this.debug(`Found cached styles in parent "${parentElement.name}" for child "${elementName}"`);
        parentHashes.forEach(hash => allHashes.add(hash));
      }
    }

    return Array.from(allHashes).map(hash => TemplateController.CSS_HASH_TO_STYLES_MAP.get(hash) as CSSStyleSheet);
  }

  private findRegisteredTemplateById(templateId: string) {
    const template = document.getElementById(templateId) as HTMLTemplateElement;

    if (!template) {
      throw new ElementalComponentTemplateNotFoundException(templateId);
    }

    return template;
  }

  private findRegisteredParentTemplate() {
    const proto = Object.getPrototypeOf(this.component.constructor.prototype);
    const parentElement = proto.constructor as Class<ElementalComponent>;

    if (!parentElement) {
      return null;
    }
    TemplateController.debug(`Component extends parent component "${parentElement.name}"`);

    if (!TemplateController.isTemplateRegistered(parentElement)) {
      TemplateController.debug(`Parent component "${parentElement.name}" does not have a registered template`);

      return null;
    }

    this.debug(`Parent component "${parentElement.name}" has a registered template`);
    const parentTagName = RegistryController.getRegisteredTagName(parentElement.name) as string;

    return document.getElementById(parentTagName) as HTMLTemplateElement;
  }

  private findRegisteredTemplateByTagName() {
    this.debug('Checking any registered child template');
    const tagName = RegistryController.generateTagNameForClassName(this.component.constructor.name);

    return document.getElementById(tagName) as HTMLTemplateElement;
  }

  //  ------------------------------------------------------------------------------------
  //  Loggers
  //  ------------------------------------------------------------------------------------

  private static debug(message?: string, ...optionalParams: unknown[]) {
    debug(`[elemental-component][template-controller] ${message}`, ...optionalParams);
  }

  private debug(message?: string, ...optionalParams: unknown[]) {
    const name = this.component?.constructor?.name || '';
    const id = this.component?.id || '';

    debug(`[elemental-component][template-controller][name=${name}][id=${id}] ${message}`, ...optionalParams);
  }
}
