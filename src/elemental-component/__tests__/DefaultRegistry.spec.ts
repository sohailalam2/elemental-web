// eslint-disable-next-line max-classes-per-file
import { beforeEach, describe, expect, it } from 'vitest';

import {
  ElementalComponentIsAlreadyRegistered,
  ElementalComponentPrefix,
  ElementalComponentTemplateCanNotBeEmptyException,
  ElementalComponentTemplateIsAlreadyRegistered,
} from '@/elemental-component';

import { DefaultRegistry } from '../DefaultRegistry';
import { toKebabCase } from '@sohailalam2/abu';

describe('DefaultRegistry', () => {
  let customPrefix: ElementalComponentPrefix;
  let template: string;

  beforeEach(() => {
    customPrefix = ElementalComponentPrefix.from('custom');
    template = `<h1>Hello World!</h1>`;
  });

  it('should generate tag name from a given string', () => {
    const tagName = DefaultRegistry.generateTagNameFromClassName('MyElement');

    expect(tagName).toBeDefined();
    expect(tagName).toEqual(`el-my-element`);
  });

  it('should generate tag name with default prefix', () => {
    class MyElement extends HTMLElement {}
    const tagName = DefaultRegistry.generateTagName(MyElement);

    expect(tagName).toBeDefined();
    expect(tagName).toEqual(`el-${toKebabCase(MyElement.name)}`);
  });

  it('should generate tag name with a given prefix', () => {
    class MyElement extends HTMLElement {}
    const tagName = DefaultRegistry.generateTagName(MyElement, customPrefix);

    expect(tagName).toBeDefined();
    expect(tagName).toEqual(`${customPrefix.value}-${toKebabCase(MyElement.name)}`);
  });

  it('should register a component with default prefix', () => {
    class MyElement1 extends HTMLElement {}
    DefaultRegistry.registerComponent(MyElement1);

    expect(DefaultRegistry.isComponentRegistered(MyElement1)).toEqual(true);
    expect(DefaultRegistry.registeredTagName(MyElement1.name)).toEqual(`el-${toKebabCase(MyElement1.name)}`);
  });

  it('should register a component with a custom prefix', () => {
    class MyElement2 extends HTMLElement {}
    DefaultRegistry.registerComponent(MyElement2, { prefix: customPrefix });

    expect(DefaultRegistry.isComponentRegistered(MyElement2)).toEqual(true);
    expect(DefaultRegistry.registeredTagName(MyElement2.name)).toEqual(
      `${customPrefix.value}-${toKebabCase(MyElement2.name)}`,
    );
  });

  it('should register a component that extends an existing HTML element', () => {
    class MyElement3 extends HTMLButtonElement {}
    DefaultRegistry.registerComponent(MyElement3, { extends: 'button' });

    expect(DefaultRegistry.isComponentRegistered(MyElement3)).toEqual(true);
  });

  it('should get the correct tag name', () => {
    class MyElement4 extends HTMLElement {}
    DefaultRegistry.registerComponent(MyElement4, { prefix: customPrefix });

    expect(DefaultRegistry.registeredTagName(MyElement4.name)).toEqual(
      `${customPrefix.value}-${toKebabCase(MyElement4.name)}`,
    );
  });

  it('should correctly return whether component is registered', () => {
    class MyElement5 extends HTMLElement {}
    expect(DefaultRegistry.isComponentRegistered(MyElement5)).toEqual(false);

    DefaultRegistry.registerComponent(MyElement5);

    expect(DefaultRegistry.isComponentRegistered(MyElement5)).toEqual(true);
  });

  it('should correctly return whether component is registered by className', () => {
    class MyElement51 extends HTMLElement {}
    expect(DefaultRegistry.isComponentRegistered(MyElement51)).toEqual(false);

    DefaultRegistry.registerComponent(MyElement51);

    expect(DefaultRegistry.isComponentRegisteredByClassName(MyElement51.name)).toEqual(true);
  });

  it('should throw exception when re-registering component with same tag name', () => {
    class MyElement6 extends HTMLElement {}
    DefaultRegistry.registerComponent(MyElement6);
    expect(() => DefaultRegistry.registerComponent(MyElement6)).to.throw(ElementalComponentIsAlreadyRegistered);
  });

  it('should correctly return whether component is registered by tag name', () => {
    class MyElement7 extends HTMLElement {}
    expect(DefaultRegistry.isComponentRegisteredByTagName(`el-${toKebabCase(MyElement7.name)}`)).toEqual(false);

    DefaultRegistry.registerComponent(MyElement7);

    expect(DefaultRegistry.isComponentRegisteredByTagName(`el-${toKebabCase(MyElement7.name)}`)).toEqual(true);
  });

  it('should correctly register a given template', () => {
    class MyElement8 extends HTMLElement {}
    DefaultRegistry.registerTemplate(MyElement8, template);

    expect(DefaultRegistry.isTemplateRegistered(MyElement8)).toEqual(true);
  });

  it('should throw when template is empty', () => {
    class MyElement9 extends HTMLElement {}
    expect(() => DefaultRegistry.registerTemplate(MyElement9, '')).to.throw(
      ElementalComponentTemplateCanNotBeEmptyException,
    );
  });

  it('should correctly return whether a template is registered', () => {
    class MyElement10 extends HTMLElement {}
    expect(DefaultRegistry.isTemplateRegistered(MyElement10)).toEqual(false);

    DefaultRegistry.registerTemplate(MyElement10, template);

    expect(DefaultRegistry.isTemplateRegistered(MyElement10)).toEqual(true);
  });

  it('should throw exception when re-registering component template with same tag name', () => {
    class MyElement11 extends HTMLElement {}
    DefaultRegistry.registerTemplate(MyElement11, template);
    expect(() => DefaultRegistry.registerTemplate(MyElement11, template)).to.throw(
      ElementalComponentTemplateIsAlreadyRegistered,
    );
  });

  it('should correctly return whether a template is registered by tag name', () => {
    class MyElement12 extends HTMLElement {}
    expect(DefaultRegistry.isTemplateRegisteredByTagName(`el-${toKebabCase(MyElement12.name)}`)).toEqual(false);

    DefaultRegistry.registerTemplate(MyElement12, template);

    expect(DefaultRegistry.isTemplateRegisteredByTagName(`el-${toKebabCase(MyElement12.name)}`)).toEqual(true);
  });
});
