/* eslint-disable  @typescript-eslint/ban-ts-comment, no-console, max-classes-per-file */
import { beforeEach, describe, expect, it } from 'vitest';
import { toKebabCase, ValueObject } from '@sohailalam2/abu';
import { ShadowRoot } from 'happy-dom';

import { ElementalComponentOptions } from '../types';
import { ElementalComponent } from '../ElementalComponent';
import { ElementalComponentId, ElementalComponentPrefix } from '../values';

// we need to define webcrypto because Abu uses it to generate the random numbers
// and this is not available in the simulated DOM test environment
import crypto from 'crypto';

Object.defineProperty(globalThis, 'crypto', { value: { webcrypto: crypto.webcrypto } });

describe('ElementalComponent', () => {
  abstract class MyComponent extends ElementalComponent {
    constructor(options: ElementalComponentOptions = { state: myComponentState, mode: 'open' }) {
      super(options);
    }

    protected render() {
      if (!this.$template && this.$state) {
        this.$root.innerHTML = `<span>${this.$state}</span>`;

        return;
      }

      const p = this.$root.querySelector('p');

      if (p) {
        p.textContent = this.$state;
      }
    }
  }

  let myComponentState: string;
  let templateContent: string;

  beforeEach(() => {
    myComponentState = 'Hello World!';
    templateContent = `<section><h1>Hello!!</h1><p></p></section>`;
  });

  it('should return the correct observedAttributes', () => {
    class MyComponentObservedAttributes extends MyComponent {}

    class MyComponentWithCustomObservedAttributes extends ElementalComponent {
      static get observedAttributes(): string[] {
        return ['count'];
      }

      render() {
        // do nothing
      }
    }

    expect(MyComponentObservedAttributes.observedAttributes).toBeDefined();
    expect(MyComponentObservedAttributes.observedAttributes).includes('state');

    expect(MyComponentWithCustomObservedAttributes.observedAttributes).toBeDefined();
    expect(MyComponentWithCustomObservedAttributes.observedAttributes).not.includes('state');
    expect(MyComponentWithCustomObservedAttributes.observedAttributes).includes('count');
  });

  it('should generate the correct tagName', () => {
    class MyComponentTagName extends MyComponent {}

    expect(ElementalComponent.tagName(MyComponentTagName)).toEqual('el-my-component-tag-name');
  });

  it('should generate the correct tagName with custom prefix', () => {
    class MyComponentTagName extends MyComponent {}

    expect(ElementalComponent.tagName(MyComponentTagName, ElementalComponentPrefix.from('awesome'))).toEqual(
      'awesome-my-component-tag-name',
    );
  });

  it('instance should be defined', () => {
    class MyComponentDefined extends MyComponent {}
    ElementalComponent.register(MyComponentDefined);
    const component = new MyComponentDefined();

    expect(component).toBeDefined();
    expect(component.id).toBeDefined();
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

  it('instance should return the correct properties and attributes', () => {
    class MyComponentTagName extends MyComponent {
      constructor() {
        super({ state: myComponentState, mode: 'open', id: ElementalComponentId.from('my-id') });
      }
    }
    ElementalComponent.register(MyComponentTagName);
    const component = new MyComponentTagName();

    expect(component.tagName).toEqual(`el-${toKebabCase(MyComponentTagName.name)}`);
    expect(component.id).toEqual('my-id');
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

  it('instance render method should render the correct dom', () => {
    class MyComponentRenderWorks extends MyComponent {}
    ElementalComponent.register(MyComponentRenderWorks);
    const div = document.createElement('div');
    const component = new MyComponentRenderWorks();

    div.appendChild(component);
    expect(component.$root.innerHTML).toEqual(`<span>Hello World!</span>`);
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
    expect(element.$root.innerHTML).toEqual(`<span>${myComponentState}</span>`);
  });

  it('instance should render the correct dom from template', () => {
    class MyComponentRendersTemplate extends MyComponent {}
    const tagName = `el-${toKebabCase(MyComponentRendersTemplate.name)}`;
    const renderedHtml = templateContent.replace('<p></p>', `<p>template state</p>`);

    ElementalComponent.register(MyComponentRendersTemplate);
    ElementalComponent.registerTemplate(MyComponentRendersTemplate, templateContent);

    const domComponentWithTemplate = document.createElement(tagName) as MyComponentRendersTemplate;

    // NOTE: it is important to use updateState to pass the state to the component for rendering
    document.body.appendChild(domComponentWithTemplate);
    domComponentWithTemplate.updateState('template state');
    const element = document.querySelector(tagName) as MyComponentRendersTemplate;

    expect(element.tagName.toLowerCase()).toEqual(tagName);
    expect(element.isConnected).toEqual(true);
    expect(element.innerHTML).toEqual('');
    expect(element.$root.innerHTML).toEqual(renderedHtml);
  });

  it('should maintain a complex value object as state', () => {
    class MyValueObjectState extends ValueObject {}

    interface ComplexState {
      vo: MyValueObjectState;
    }
    class ComplexStateVO extends ValueObject<ComplexState> {}

    class MyValueObjectStateComponent extends ElementalComponent<ComplexStateVO> {
      protected deserialize(serializedState: string | undefined): ComplexStateVO {
        if (!serializedState) {
          return ComplexStateVO.from({ vo: MyValueObjectState.from('undefined') });
        }

        return ComplexStateVO.deserialize(serializedState, { vo: MyValueObjectState });
      }

      protected render(): void {
        // do nothing
      }
    }

    const state: ComplexStateVO = ComplexStateVO.from({ vo: MyValueObjectState.from(myComponentState) });

    ElementalComponent.register(MyValueObjectStateComponent);
    const div = document.createElement('div');
    const component = new MyValueObjectStateComponent({ state });

    div.appendChild(component);
    expect(component.$state).toEqual(state);
  });
});
