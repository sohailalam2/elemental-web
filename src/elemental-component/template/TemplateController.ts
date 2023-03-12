import { Class, debug, Exception, hasValue } from '@sohailalam2/abu';

import { ElementalComponent } from '../component';
import { RegistryController, RegistrationOptions } from '../registry';

export class ElementalComponentTemplateCanNotBeEmptyException extends Exception {}

export class ElementalComponentTemplateIsAlreadyRegisteredException extends Exception {}

export class ElementalComponentTemplateNotFoundException extends Exception {}

export class TemplateController<T extends HTMLElement> {
  private static readonly TEMPLATE_CLASSNAMES: Set<string> = new Set();

  constructor(private readonly component: T) {}

  public static isTemplateRegistered(element: Class<HTMLElement>): boolean {
    return TemplateController.TEMPLATE_CLASSNAMES.has(element.name);
  }

  public static isTemplateRegisteredWithTagName(tagName: string): boolean {
    return !!document.getElementById(tagName);
  }

  public findRegisteredTemplate(templateId: string | undefined): HTMLTemplateElement {
    if (templateId) {
      return this.findRegisteredTemplateById(templateId);
    }

    return this.findRegisteredParentTemplate() || this.findRegisteredTemplateByTagName();
  }

  public static registerTemplate(element: Class<HTMLElement>, options?: RegistrationOptions): void {
    const tagName = RegistryController.generateTagNameForElement(element, options?.prefix);

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
    this.debug(`Component extends parent component "${parentElement.name}"`);

    if (!TemplateController.isTemplateRegistered(parentElement)) {
      this.debug(`Parent component "${parentElement.name}" does not have a registered template`);

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

  private debug(message?: string, ...optionalParams: unknown[]) {
    debug(
      `[elemental-component][template-controller][${this.constructor.name}][id=${this.component.id}] ${message}`,
      ...optionalParams,
    );
  }
}
