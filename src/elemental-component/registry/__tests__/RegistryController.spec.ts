/* eslint-disable max-classes-per-file, @typescript-eslint/ban-ts-comment */
import { beforeEach, describe, expect, it } from 'vitest';
import { toKebabCase } from '@sohailalam2/abu';

import {
  RegistryController,
  ElementalComponentIsAlreadyRegistered,
  ElementalComponentPrefix,
} from '@/elemental-component';

describe('RegistryController', () => {
  let customPrefix: ElementalComponentPrefix;
  // let template: string;

  beforeEach(() => {
    customPrefix = ElementalComponentPrefix.from('custom');
    // template = `<h1>Hello World!</h1>`;
  });

  describe('tagName', () => {
    it('should generate tag name from a given string', () => {
      const tagName = RegistryController.generateTagNameForClassName('MyElement');

      expect(tagName).toBeDefined();
      expect(tagName).toEqual(`el-my-element`);
    });

    it('should generate tag name with default prefix', () => {
      class MyElement extends HTMLElement {}

      const tagName = RegistryController.generateTagNameForElement(MyElement);

      expect(tagName).toBeDefined();
      expect(tagName).toEqual(`el-${toKebabCase(MyElement.name)}`);
    });

    it('should generate tag name with updated default prefix', () => {
      class MyElementWithCustomPrefix extends HTMLElement {}

      RegistryController.setDefaultPrefix(ElementalComponentPrefix.from('my'));
      const tagName = RegistryController.generateTagNameForElement(MyElementWithCustomPrefix);

      expect(tagName).toBeDefined();
      expect(tagName).toEqual(`my-${toKebabCase(MyElementWithCustomPrefix.name)}`);

      // revert back
      RegistryController.setDefaultPrefix(ElementalComponentPrefix.from('el'));
    });

    it('should generate tag name with a given prefix', () => {
      class MyElement extends HTMLElement {}

      const tagName = RegistryController.generateTagNameForElement(MyElement, customPrefix);

      expect(tagName).toBeDefined();
      expect(tagName).toEqual(`${customPrefix.value}-${toKebabCase(MyElement.name)}`);
    });

    it('should get the correct tag name', () => {
      class MyElement4 extends HTMLElement {}

      RegistryController.registerComponent(MyElement4, { prefix: customPrefix });

      expect(RegistryController.getRegisteredTagName(MyElement4.name)).toEqual(
        `${customPrefix.value}-${toKebabCase(MyElement4.name)}`,
      );
    });
  });

  describe('register component', () => {
    it('should register a component with default prefix', () => {
      class MyElement1 extends HTMLElement {}

      RegistryController.registerComponent(MyElement1);

      expect(RegistryController.isComponentRegistered(MyElement1)).toEqual(true);
      expect(RegistryController.getRegisteredTagName(MyElement1.name)).toEqual(`el-${toKebabCase(MyElement1.name)}`);
    });

    it('should register a component with a custom prefix', () => {
      class MyElement2 extends HTMLElement {}

      RegistryController.registerComponent(MyElement2, { prefix: customPrefix });

      expect(RegistryController.isComponentRegistered(MyElement2)).toEqual(true);
      expect(RegistryController.getRegisteredTagName(MyElement2.name)).toEqual(
        `${customPrefix.value}-${toKebabCase(MyElement2.name)}`,
      );
    });

    it('should register a component that extends an existing HTML element', () => {
      class MyElement3 extends HTMLButtonElement {}

      RegistryController.registerComponent(MyElement3, { extends: 'button' });

      expect(RegistryController.isComponentRegistered(MyElement3)).toEqual(true);
    });

    it('should throw exception when re-registering component with same tag name', () => {
      class MyElement6 extends HTMLElement {}

      RegistryController.registerComponent(MyElement6);
      expect(() => RegistryController.registerComponent(MyElement6)).to.throw(ElementalComponentIsAlreadyRegistered);
    });
  });

  describe('isComponentRegistered', () => {
    it('should correctly return whether component is registered', () => {
      class MyElement5 extends HTMLElement {}

      expect(RegistryController.isComponentRegistered(MyElement5)).toEqual(false);

      RegistryController.registerComponent(MyElement5);

      expect(RegistryController.isComponentRegistered(MyElement5)).toEqual(true);
    });

    it('should correctly return whether component is registered by className', () => {
      class MyElement51 extends HTMLElement {}

      expect(RegistryController.isComponentRegistered(MyElement51)).toEqual(false);

      RegistryController.registerComponent(MyElement51);

      expect(RegistryController.isComponentRegisteredWithClassName(MyElement51.name)).toEqual(true);
    });

    it('should correctly return whether component is registered by tag name', () => {
      class MyElement7 extends HTMLElement {}

      expect(RegistryController.isComponentRegisteredWithTagName(`el-${toKebabCase(MyElement7.name)}`)).toEqual(false);

      RegistryController.registerComponent(MyElement7);

      expect(RegistryController.isComponentRegisteredWithTagName(`el-${toKebabCase(MyElement7.name)}`)).toEqual(true);
    });
  });
});
