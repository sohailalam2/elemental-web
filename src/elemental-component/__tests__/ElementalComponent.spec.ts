/* eslint-disable  @typescript-eslint/ban-ts-comment, no-console, max-classes-per-file */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { toKebabCase } from '@sohailalam2/abu';

import { ElementalComponentOptions } from '../types';
import { ElementalComponent } from '../ElementalComponent';
import { ElementalComponentIsNotRegisteredException, UnableToRenderElementalComponentException } from '../exceptions';

import crypto from 'crypto';
import { ShadowRoot } from 'happy-dom';

Object.defineProperty(globalThis, 'crypto', { value: { webcrypto: crypto.webcrypto } });

describe('ElementalComponent', () => {
  abstract class MyComponent extends ElementalComponent {
    constructor(options: ElementalComponentOptions = { state: myComponentState, mode: 'open' }) {
      super(options);
    }

    protected render(): string {
      if (this.$template) {
        const p = this.$root.querySelector('p');

        if (p) {
          p.textContent = this.$state;
        }

        return this.$root.innerHTML;
      }

      return `<p>${this.$state}</p>`;
    }
  }

  let myComponentState: string;

  beforeEach(() => {
    myComponentState = 'Hello World!';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  // @vitest-environment happy-dom

  it('should throw ElementalComponentNotRegisteredException', () => {
    class MyComponentNotRegistered extends MyComponent {}
    // NOTE: unfortunately this test fails in jsdom due to its internal implementation so run it using happy-dom
    // JS DOM throws a TypeError: Invalid constructor, possibly because it doesn't support extending html elements
    expect(() => new MyComponentNotRegistered()).toThrow(ElementalComponentIsNotRegisteredException);
  });

  // @vitest-environment jsdom

  it('should return the correct observedAttributes', () => {
    class MyComponentObservedAttributes extends MyComponent {}

    class MyComponentWithCustomObservedAttributes extends ElementalComponent {
      static get observedAttributes(): string[] {
        return ['count'];
      }

      render(): string {
        return '';
      }
    }

    expect(MyComponentObservedAttributes.observedAttributes).toBeDefined();
    expect(MyComponentObservedAttributes.observedAttributes).includes('state');

    expect(MyComponentWithCustomObservedAttributes.observedAttributes).toBeDefined();
    expect(MyComponentWithCustomObservedAttributes.observedAttributes).not.includes('state');
    expect(MyComponentWithCustomObservedAttributes.observedAttributes).includes('count');
  });

  it('instance should be defined', () => {
    class MyComponentDefined extends MyComponent {}
    ElementalComponent.register(MyComponentDefined);
    const component = new MyComponentDefined();

    expect(component).toBeDefined();
  });

  it('instance should have $root defined when shadowdom is open', () => {
    class MyComponentOpenDom extends MyComponent {}
    ElementalComponent.register(MyComponentOpenDom);
    const component = new MyComponentOpenDom();

    expect(component.$root).toBeDefined();
    expect(component.$root).instanceof(ShadowRoot);
    expect((component.$root as unknown as ShadowRoot).mode).toEqual('open');
  });

  it('instance should have $root defined when shadowdom is closed', () => {
    class MyComponentClosedDom extends MyComponent {}
    ElementalComponent.register(MyComponentClosedDom);
    const component = new MyComponentClosedDom({ mode: 'closed' });

    expect(component.$root).toBeDefined();
    expect(component.$root).instanceof(ShadowRoot);
    expect((component.$root as unknown as ShadowRoot).mode).toEqual('closed');
  });

  it('instance should have $root defined when not using shadowdom', () => {
    class MyComponentNoShadow extends MyComponent {}
    ElementalComponent.register(MyComponentNoShadow);
    const component = new MyComponentNoShadow({ noShadow: true });

    expect(component.shadowRoot).toBeNull();
    expect(component.$root).toBeDefined();
    expect(component.$root).instanceof(MyComponentNoShadow);
  });

  it('instance should return the correct name', () => {
    class MyComponentName extends MyComponent {}
    ElementalComponent.register(MyComponentName);
    const component = new MyComponentName();

    expect(component.constructor.name).toEqual(MyComponentName.name);
  });

  it('instance should return the correct uid', () => {
    class MyComponentTagName extends MyComponent {}
    ElementalComponent.register(MyComponentTagName);
    const component = new MyComponentTagName();

    expect(component.tagName).toEqual(`el-${toKebabCase(MyComponentTagName.name)}`);
  });

  it('instance should have correct state type and value', () => {
    class MyComponentInternalState extends MyComponent {}
    ElementalComponent.register(MyComponentInternalState);
    const component = new MyComponentInternalState();

    expect(component.$state).toBeDefined();
    expect(component.$state).toEqual(myComponentState);
  });

  it('instance should be able to clone the state', () => {
    class MyComponentCloneState extends MyComponent {}
    ElementalComponent.register(MyComponentCloneState);
    const component = new MyComponentCloneState();

    expect(component.cloneState()).toEqual(myComponentState);
  });

  it('instance should throw UnableToRenderElementalComponentException', () => {
    class AnInvalidComponent extends ElementalComponent {
      protected render(): string {
        return '';
      }
    }

    ElementalComponent.register(AnInvalidComponent);

    expect(() => new AnInvalidComponent()).toThrowError(UnableToRenderElementalComponentException);
  });

  it('instance render method should return the correct dom', () => {
    class MyComponentRenderWorks extends MyComponent {}
    ElementalComponent.register(MyComponentRenderWorks);
    const component = new MyComponentRenderWorks();

    // eslint-disable-next-line
    expect(component['render']()).toEqual(`<p>${myComponentState}</p>`);
  });

  it('instance should render the correct dom from render method', () => {
    class MyComponentShouldRender extends MyComponent {}
    ElementalComponent.register(MyComponentShouldRender);

    const cid = `el-${toKebabCase(MyComponentShouldRender.name)}`;
    const domComponent = document.createElement(cid) as MyComponentShouldRender;

    // NOTE: it is important to use updateState to pass the state to the component for rendering
    document.body.appendChild(domComponent).updateState(myComponentState);
    const element = document.querySelector(cid) as MyComponentShouldRender;

    expect(element.tagName.toLowerCase()).toEqual(cid);
    expect(element.isConnected).toEqual(true);
    expect(element.innerHTML).toEqual('');
    expect(element.$root.innerHTML).toEqual(`<p>${myComponentState}</p>`);
  });

  it('instance should render the correct dom from template', () => {
    class MyComponentRendersTemplate extends MyComponent {}
    ElementalComponent.register(MyComponentRendersTemplate);

    const cid = `el-${toKebabCase(MyComponentRendersTemplate.name)}`;
    const template = `<template id="${cid}"><section><h1>Hello!!</h1><p></p></section></template>`;
    const renderedHtml = `<section><h1>Hello!!</h1><p>${myComponentState}</p></section>`;

    // create template
    document.body.innerHTML = '<div><h1>Test My Component With Template</h1></div>';
    document.body.innerHTML += template;

    const domComponentWithTemplate = document.createElement(cid) as MyComponentRendersTemplate;

    // NOTE: it is important to use updateState to pass the state to the component for rendering
    document.body.appendChild(domComponentWithTemplate);
    domComponentWithTemplate.updateState(myComponentState);
    const element = document.querySelector(cid) as MyComponentRendersTemplate;

    expect(element.tagName.toLowerCase()).toEqual(cid);
    expect(element.isConnected).toEqual(true);
    expect(element.innerHTML).toEqual('');
    expect(element.$root.innerHTML).toEqual(renderedHtml);
  });
});
