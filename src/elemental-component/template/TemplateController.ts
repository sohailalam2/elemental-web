import { Class, debug, Exception, hasValue } from '@sohailalam2/abu';

import { hashCode } from '../utils';
import { ElementalComponent } from '../component';
import { RegistryController, RegistrationOptions } from '../registry';

export class ElementalComponentTemplateCanNotBeEmptyException extends Exception {}

export class ElementalComponentTemplateIsAlreadyRegisteredException extends Exception {}

export class ElementalComponentTemplateNotFoundException extends Exception {}

export class TemplateController<T extends HTMLElement> {
  private static readonly TEMPLATE_CLASSNAMES: Set<string> = new Set();

  // cache for styles (css): css-hash/elementName => CSSStyleSheet
  private static readonly STYLE_CACHE: Map<string, CSSStyleSheet> = new Map();

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

  public static registerTemplate(element: Class<HTMLElement>, options?: RegistrationOptions): void {
    const tagName = RegistryController.generateTagNameForElement(element, options?.prefix);

    TemplateController.debug(`Registering template for component "${tagName}"`);
    this.validateTemplateBeforeRegistration(tagName, options);
    this.createTemplateElement(tagName, element, options);

    if (options?.styles) {
      if ('adoptedStyleSheets' in document) {
        this.cacheStyles(element.name, options.styles);
      } else {
        this.addStylesToTemplate(tagName, options.styles);
      }
    }
    TemplateController.debug(`Template is successfully registered for component "${tagName}"`);
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

  private static cacheStyles(elementName: string, styles: string) {
    const hash = hashCode(styles);

    TemplateController.debug(`Caching styles (hash=${hash}) for "${elementName}"`);
    if (TemplateController.STYLE_CACHE.has(hash)) {
      const sheet = TemplateController.STYLE_CACHE.get(hash) as CSSStyleSheet;

      TemplateController.STYLE_CACHE.set(elementName, sheet);
    } else {
      const sheet = new CSSStyleSheet();

      sheet.replaceSync(styles);
      TemplateController.STYLE_CACHE.set(hash, sheet);
      TemplateController.STYLE_CACHE.set(elementName, sheet);
    }
  }

  private static addStylesToTemplate(tagName: string, styles: string) {
    TemplateController.debug(`Adding styles to template # "${tagName}"`);
    const template = document.getElementById(tagName) as HTMLTemplateElement;
    let style = template.content.querySelector('style') as HTMLStyleElement;

    if (!style) {
      style = document.createElement('style');
      template.content.prepend(style);
    }

    style.textContent = styles;
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

  public findRegisteredStyles(): CSSStyleSheet | undefined {
    const styles = TemplateController.STYLE_CACHE.get(this.component.constructor.name);

    if (styles) {
      TemplateController.debug(`Found cached styles for "${this.component.constructor.name}"`);

      return styles;
    }

    const proto = Object.getPrototypeOf(this.component.constructor.prototype);
    const parentElement = proto.constructor as Class<ElementalComponent>;

    if (!parentElement) {
      return undefined;
    }

    return TemplateController.STYLE_CACHE.get(parentElement.name);
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
