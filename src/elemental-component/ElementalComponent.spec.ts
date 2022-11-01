/* eslint-disable  @typescript-eslint/ban-ts-comment, no-console */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { toKebabCase } from '@sohailalam2/abu';

import { ElementalComponent } from './ElementalComponent';
import {
  ElementalComponentNotRegisteredException,
  ElementalComponentPrefix,
  InvalidElementalComponentPrefixException,
  UnableToRenderElementalComponentException,
} from './';

import crypto from 'crypto';

Object.defineProperty(globalThis, 'crypto', { value: { webcrypto: crypto.webcrypto } });

describe('ElementalComponent', () => {
  class MyComponent extends ElementalComponent {
    // eslint-disable-next-line no-undef
    constructor(state: string, mode: ShadowRootMode = 'open') {
      super({ state, mode });
    }

    protected render(): string {
      if (this.$template) {
        const p = this.shadowRoot.querySelector('p');

        if (p) {
          p.textContent = this.$state;
        }

        return this.shadowRoot.innerHTML;
      }

      return `<p>${this.$state}</p>`;
    }
  }

  class MyClosedComponent extends MyComponent {
    constructor(state: string) {
      super(state, 'closed');
    }
  }

  class MyButton extends ElementalComponent<number> {
    protected render(): string {
      return `<button>Click Me (${this.$state})</button>`;
    }
  }

  let myComponentState: string;
  let component: ElementalComponent;
  let closedComponent: ElementalComponent;

  beforeEach(() => {
    ElementalComponent.register(MyComponent);
    ElementalComponent.register(MyClosedComponent);

    myComponentState = 'Hello World!';
    component = new MyComponent(myComponentState);
    closedComponent = new MyClosedComponent(myComponentState);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  // @vitest-environment happy-dom

  it('should throw ElementalComponentNotRegisteredException', () => {
    expect(() => new MyButton()).toThrow();

    // NOTE: unfortunately this test fails in jsdom due to its internal implementation so run it using happy-dom
    expect(() => new MyButton()).toThrow(ElementalComponentNotRegisteredException);
  });

  // @vitest-environment jsdom

  it('should throw InvalidElementalComponentPrefixException', () => {
    expect(() => MyButton.register(MyButton, ElementalComponentPrefix.from('*-invalid-*'))).toThrowError(
      InvalidElementalComponentPrefixException,
    );
  });

  it('should return the correct observedAttributes', () => {
    expect(MyComponent.observedAttributes).toBeDefined();
    expect(MyComponent.observedAttributes).includes('state');

    expect(MyClosedComponent.observedAttributes).toBeDefined();
    expect(MyClosedComponent.observedAttributes).includes('state');

    expect(MyButton.observedAttributes).toBeDefined();
    expect(MyButton.observedAttributes).includes('state');

    class MyComponentWithCustomObservedAttributes extends ElementalComponent {
      static get observedAttributes(): string[] {
        return ['count'];
      }

      render(): string {
        return '';
      }
    }

    expect(MyComponentWithCustomObservedAttributes.observedAttributes).toBeDefined();
    expect(MyComponentWithCustomObservedAttributes.observedAttributes).not.includes('state');
    expect(MyComponentWithCustomObservedAttributes.observedAttributes).includes('count');
  });

  it('instance should be defined', () => {
    expect(component).toBeDefined();
    expect(closedComponent).toBeDefined();
  });

  it('instance should have shadowRoot defined', () => {
    expect(component.shadowRoot).toBeDefined();
    expect(component.shadowRoot).instanceof(ShadowRoot);

    expect(closedComponent.shadowRoot).toBeDefined();
    expect(closedComponent.shadowRoot).instanceof(ShadowRoot);
  });

  it('instance should have the correct mode', () => {
    expect(component.shadowRoot.mode).toEqual('open');
    expect(closedComponent.shadowRoot.mode).toEqual('closed');
  });

  it('instance should return the correct name', () => {
    expect(component.name).toEqual(MyComponent.name);
    expect(closedComponent.name).toEqual(MyClosedComponent.name);
  });

  it('instance should return the correct uid', () => {
    expect(component.cid).toEqual(`el-${toKebabCase(MyComponent.name)}`);
    expect(closedComponent.cid).toEqual(`el-${toKebabCase(MyClosedComponent.name)}`);
  });

  it('instance should have correct state type and value', () => {
    ElementalComponent.register(MyButton);
    const VAL = 100;
    const myButton = new MyButton({ state: VAL });

    expect(myButton.$state).toBeDefined();
    expect(myButton.$state).toEqual(VAL);
  });

  it('instance should be able to clone the state', () => {
    expect(component.cloneState()).toEqual(myComponentState);
    expect(closedComponent.cloneState()).toEqual(myComponentState);
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
    // eslint-disable-next-line
    expect(component['render']()).toEqual(`<p>${myComponentState}</p>`);
    // eslint-disable-next-line
    expect(closedComponent['render']()).toEqual(`<p>${myComponentState}</p>`);
  });

  it('instance should render the correct dom from render method', () => {
    const cid = `el-${toKebabCase(MyComponent.name)}`;
    const domComponent = document.createElement(cid) as MyComponent;

    // NOTE: it is important to use updateState to pass the state to the component for rendering
    document.body.appendChild(domComponent).updateState(myComponentState);
    const element = document.querySelector(cid) as MyComponent;

    expect(element.tagName.toLowerCase()).toEqual(cid);
    expect(element.isConnected).toEqual(true);
    expect(element.innerHTML).toEqual('');
    expect(element.shadowRoot.innerHTML).toEqual(`<p>${myComponentState}</p>`);
  });

  it('instance should render the correct dom from template', () => {
    const cid = `el-${toKebabCase(MyComponent.name)}`;
    const template = `<template id="${cid}"><section><h1>Hello!!</h1><p></p></section></template>`;
    const renderedHtml = `<section><h1>Hello!!</h1><p>${myComponentState}</p></section>`;

    // create template
    document.body.innerHTML = '<div><h1>Test My Component With Template</h1></div>';
    document.body.innerHTML += template;

    const domComponentWithTemplate = document.createElement(cid) as MyComponent;

    // NOTE: it is important to use updateState to pass the state to the component for rendering
    document.body.appendChild(domComponentWithTemplate);
    domComponentWithTemplate.updateState(myComponentState);
    const element = document.querySelector(cid) as MyComponent;

    expect(element.tagName.toLowerCase()).toEqual(cid);
    expect(element.isConnected).toEqual(true);
    expect(element.innerHTML).toEqual('');
    expect(element.shadowRoot.innerHTML).toEqual(renderedHtml);
  });
});
