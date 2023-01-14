/* eslint-disable max-classes-per-file, @typescript-eslint/ban-ts-comment */
import { beforeEach, describe, expect, it } from 'vitest';
import { toKebabCase } from '@sohailalam2/abu';

import {
  ElementalComponentRegistry,
  ElementalComponentIsAlreadyRegistered,
  ElementalComponentPrefix,
  ElementalComponentTemplateCanNotBeEmptyException,
  ElementalComponentTemplateIsAlreadyRegisteredException,
} from '@/elemental-component';

describe('DefaultRegistry', () => {
  let customPrefix: ElementalComponentPrefix;
  let template: string;

  beforeEach(() => {
    customPrefix = ElementalComponentPrefix.from('custom');
    template = `<h1>Hello World!</h1>`;
  });

  describe('tagName', () => {
    it('should generate tag name from a given string', () => {
      const tagName = ElementalComponentRegistry.generateTagNameForClassName('MyElement');

      expect(tagName).toBeDefined();
      expect(tagName).toEqual(`el-my-element`);
    });

    it('should generate tag name with default prefix', () => {
      class MyElement extends HTMLElement {}

      const tagName = ElementalComponentRegistry.generateTagNameForElement(MyElement);

      expect(tagName).toBeDefined();
      expect(tagName).toEqual(`el-${toKebabCase(MyElement.name)}`);
    });

    it('should generate tag name with updated default prefix', () => {
      class MyElementWithCustomPrefix extends HTMLElement {}

      ElementalComponentRegistry.setDefaultPrefix(ElementalComponentPrefix.from('my'));
      const tagName = ElementalComponentRegistry.generateTagNameForElement(MyElementWithCustomPrefix);

      expect(tagName).toBeDefined();
      expect(tagName).toEqual(`my-${toKebabCase(MyElementWithCustomPrefix.name)}`);

      // revert back
      ElementalComponentRegistry.setDefaultPrefix(ElementalComponentPrefix.from('el'));
    });

    it('should generate tag name with a given prefix', () => {
      class MyElement extends HTMLElement {}

      const tagName = ElementalComponentRegistry.generateTagNameForElement(MyElement, customPrefix);

      expect(tagName).toBeDefined();
      expect(tagName).toEqual(`${customPrefix.value}-${toKebabCase(MyElement.name)}`);
    });

    it('should get the correct tag name', () => {
      class MyElement4 extends HTMLElement {}

      ElementalComponentRegistry.registerComponent(MyElement4, { prefix: customPrefix });

      expect(ElementalComponentRegistry.getRegisteredTagName(MyElement4.name)).toEqual(
        `${customPrefix.value}-${toKebabCase(MyElement4.name)}`,
      );
    });
  });

  describe('register component', () => {
    it('should register a component with default prefix', () => {
      class MyElement1 extends HTMLElement {}

      ElementalComponentRegistry.registerComponent(MyElement1);

      expect(ElementalComponentRegistry.isComponentRegistered(MyElement1)).toEqual(true);
      expect(ElementalComponentRegistry.getRegisteredTagName(MyElement1.name)).toEqual(
        `el-${toKebabCase(MyElement1.name)}`,
      );
    });

    it('should register a component with a custom prefix', () => {
      class MyElement2 extends HTMLElement {}

      ElementalComponentRegistry.registerComponent(MyElement2, { prefix: customPrefix });

      expect(ElementalComponentRegistry.isComponentRegistered(MyElement2)).toEqual(true);
      expect(ElementalComponentRegistry.getRegisteredTagName(MyElement2.name)).toEqual(
        `${customPrefix.value}-${toKebabCase(MyElement2.name)}`,
      );
    });

    it('should register a component that extends an existing HTML element', () => {
      class MyElement3 extends HTMLButtonElement {}

      ElementalComponentRegistry.registerComponent(MyElement3, { extends: 'button' });

      expect(ElementalComponentRegistry.isComponentRegistered(MyElement3)).toEqual(true);
    });

    it('should throw exception when re-registering component with same tag name', () => {
      class MyElement6 extends HTMLElement {}

      ElementalComponentRegistry.registerComponent(MyElement6);
      expect(() => ElementalComponentRegistry.registerComponent(MyElement6)).to.throw(
        ElementalComponentIsAlreadyRegistered,
      );
    });
  });

  describe('isComponentRegistered', () => {
    it('should correctly return whether component is registered', () => {
      class MyElement5 extends HTMLElement {}

      expect(ElementalComponentRegistry.isComponentRegistered(MyElement5)).toEqual(false);

      ElementalComponentRegistry.registerComponent(MyElement5);

      expect(ElementalComponentRegistry.isComponentRegistered(MyElement5)).toEqual(true);
    });

    it('should correctly return whether component is registered by className', () => {
      class MyElement51 extends HTMLElement {}

      expect(ElementalComponentRegistry.isComponentRegistered(MyElement51)).toEqual(false);

      ElementalComponentRegistry.registerComponent(MyElement51);

      expect(ElementalComponentRegistry.isComponentRegisteredWithClassName(MyElement51.name)).toEqual(true);
    });

    it('should correctly return whether component is registered by tag name', () => {
      class MyElement7 extends HTMLElement {}

      expect(ElementalComponentRegistry.isComponentRegisteredWithTagName(`el-${toKebabCase(MyElement7.name)}`)).toEqual(
        false,
      );

      ElementalComponentRegistry.registerComponent(MyElement7);

      expect(ElementalComponentRegistry.isComponentRegisteredWithTagName(`el-${toKebabCase(MyElement7.name)}`)).toEqual(
        true,
      );
    });
  });

  describe('register template', () => {
    it('should correctly register a given template', () => {
      class MyElement8 extends HTMLElement {}

      ElementalComponentRegistry.registerTemplate(MyElement8, { template });

      expect(ElementalComponentRegistry.isTemplateRegistered(MyElement8)).toEqual(true);
    });

    it('should throw when template is empty', () => {
      class MyElement9 extends HTMLElement {}

      expect(() => ElementalComponentRegistry.registerTemplate(MyElement9, { template: '' })).to.throw(
        ElementalComponentTemplateCanNotBeEmptyException,
      );
    });

    it('should correctly return whether a template is registered', () => {
      class MyElement10 extends HTMLElement {}

      expect(ElementalComponentRegistry.isTemplateRegistered(MyElement10)).toEqual(false);

      ElementalComponentRegistry.registerTemplate(MyElement10, { template });

      expect(ElementalComponentRegistry.isTemplateRegistered(MyElement10)).toEqual(true);
    });

    it('should throw exception when re-registering component template with same tag name', () => {
      class MyElement11 extends HTMLElement {}

      ElementalComponentRegistry.registerTemplate(MyElement11, { template });
      expect(() => ElementalComponentRegistry.registerTemplate(MyElement11, { template })).to.throw(
        ElementalComponentTemplateIsAlreadyRegisteredException,
      );
    });

    it('should correctly return whether a template is registered by tag name', () => {
      class MyElement12 extends HTMLElement {}

      expect(ElementalComponentRegistry.isTemplateRegisteredWithTagName(`el-${toKebabCase(MyElement12.name)}`)).toEqual(
        false,
      );

      ElementalComponentRegistry.registerTemplate(MyElement12, { template });

      expect(ElementalComponentRegistry.isTemplateRegisteredWithTagName(`el-${toKebabCase(MyElement12.name)}`)).toEqual(
        true,
      );
    });

    it('should attach styles to a template if template contains a style tag', () => {
      class MyElement13 extends HTMLElement {}

      const styles = `:host { padding: none; }`;
      const template13 = `<style></style>${template}`;
      const tagName = `el-${toKebabCase(MyElement13.name)}`;

      ElementalComponentRegistry.registerTemplate(MyElement13, { template: template13, styles });

      expect(ElementalComponentRegistry.isTemplateRegisteredWithTagName(tagName)).toEqual(true);
      expect(document.getElementById(tagName)).toBeDefined();
      expect((document.getElementById(tagName) as HTMLTemplateElement).content.querySelector('style')).toBeDefined();
      expect(
        (document.getElementById(tagName) as HTMLTemplateElement).content.querySelector('style')?.textContent,
      ).toEqual(styles);
    });

    it('should attach styles to a template by creating a style tag if one does not exist', () => {
      class MyElement14 extends HTMLElement {}

      const styles = `:host { padding: none; }`;
      const tagName = `el-${toKebabCase(MyElement14.name)}`;

      ElementalComponentRegistry.registerTemplate(MyElement14, { template, styles });

      expect(ElementalComponentRegistry.isTemplateRegisteredWithTagName(tagName)).toEqual(true);
      expect(document.getElementById(tagName)).toBeDefined();
      expect((document.getElementById(tagName) as HTMLTemplateElement).content.querySelector('style')).toBeDefined();
      expect(
        (document.getElementById(tagName) as HTMLTemplateElement).content.querySelector('style')?.textContent,
      ).toEqual(styles);
    });
  });
});
