import { beforeEach, describe, expect, it } from 'vitest';
import { toKebabCase } from '@sohailalam2/abu';
import {
  TemplateController,
  ElementalComponentTemplateCanNotBeEmptyException,
  ElementalComponentTemplateIsAlreadyRegisteredException,
} from '../TemplateController';
import { Component, ElementalComponent } from '@/elemental-component';

// we need to define webcrypto because Abu uses it to generate the random numbers
// and this is not available in the simulated DOM test environment
import crypto from 'crypto';

Object.defineProperty(globalThis, 'crypto', { value: { webcrypto: crypto.webcrypto } });

describe('TemplateController', () => {
  let template: string;

  beforeEach(() => {
    template = `<h1>Hello World!</h1>`;
  });

  describe('register template', () => {
    it('should correctly register a given template', () => {
      class MyElement8 extends HTMLElement {}

      TemplateController.registerTemplate(MyElement8, { template });

      expect(TemplateController.isTemplateRegistered(MyElement8)).toEqual(true);
    });

    it('should throw when template is empty', () => {
      class MyElement9 extends HTMLElement {}

      expect(() => TemplateController.registerTemplate(MyElement9, { template: '' })).to.throw(
        ElementalComponentTemplateCanNotBeEmptyException,
      );
    });

    it('should correctly return whether a template is registered', () => {
      class MyElement10 extends HTMLElement {}

      expect(TemplateController.isTemplateRegistered(MyElement10)).toEqual(false);

      TemplateController.registerTemplate(MyElement10, { template });

      expect(TemplateController.isTemplateRegistered(MyElement10)).toEqual(true);
    });

    it('should throw exception when re-registering component template with same tag name', () => {
      class MyElement11 extends HTMLElement {}

      TemplateController.registerTemplate(MyElement11, { template });
      expect(() => TemplateController.registerTemplate(MyElement11, { template })).to.throw(
        ElementalComponentTemplateIsAlreadyRegisteredException,
      );
    });

    it('should correctly return whether a template is registered by tag name', () => {
      class MyElement12 extends HTMLElement {}

      expect(TemplateController.isTemplateRegisteredWithTagName(`el-${toKebabCase(MyElement12.name)}`)).toEqual(false);

      TemplateController.registerTemplate(MyElement12, { template });

      expect(TemplateController.isTemplateRegisteredWithTagName(`el-${toKebabCase(MyElement12.name)}`)).toEqual(true);
    });

    it('should adopt styles if document supports adoptedStyleSheets', () => {
      @Component()
      class MyElement13 extends ElementalComponent {
        protected render() {
          // do nothing
        }
      }

      const styles = `:host { padding: none; }`;
      const template13 = `<style></style>${template}`;
      const tagName = `el-${toKebabCase(MyElement13.name)}`;

      TemplateController.registerTemplate(MyElement13, { template: template13, styles });
      expect(TemplateController.isTemplateRegisteredWithTagName(tagName)).toEqual(true);
      const component = new MyElement13();

      document.body.appendChild(component);
      expect((component.$root as ShadowRoot).adoptedStyleSheets).toBeDefined();
      // eslint-disable-next-line no-magic-numbers
      expect((component.$root as ShadowRoot).adoptedStyleSheets.length).equals(1);
    });
  });
});
