/* eslint-disable  @typescript-eslint/ban-ts-comment, no-console, max-classes-per-file */
// we need to define webcrypto because Abu uses it to generate the random numbers
// and this is not available in the simulated DOM test environment
import crypto from 'crypto';

Object.defineProperty(globalThis, 'crypto', { value: { webcrypto: crypto.webcrypto } });

import { beforeEach, describe, expect, it } from 'vitest';
import { toKebabCase, ValueObject } from '@sohailalam2/abu';

import { StatefulElementalComponentOptions } from '../types';
import { ElementalComponentState, StatefulElementalComponent, StateIsNotConsistentException } from '../';

describe('StatefulElementalComponent', () => {
  class MyComponentState extends ElementalComponentState<string> {}

  abstract class MyStatefulComponent extends StatefulElementalComponent<MyComponentState> {
    constructor(options: StatefulElementalComponentOptions = { state: myComponentState, mode: 'open' }) {
      super(options);
    }

    deserialize(serialized: string | undefined): MyComponentState {
      return MyComponentState.deserialize<string, MyComponentState>(serialized);
    }

    render() {
      if (!this.$template && this.$state) {
        this.$root.innerHTML = `<span>${this.$state}</span>`;

        return;
      }

      const p = this.$root.querySelector('p');

      if (p) {
        p.textContent = this.$state.value;
      }
    }
  }

  let myComponentState: MyComponentState;
  let templateContent: string;

  beforeEach(() => {
    myComponentState = new MyComponentState('Hello Universe!');
    templateContent = `<section><h1>Hello!!</h1><p></p></section>`;
  });

  it('should return the correct observedAttributes', () => {
    class MyComponentObservedAttributes extends MyStatefulComponent {}

    class State extends ElementalComponentState<number> {}

    class MyComponentWithCustomObservedAttributes extends StatefulElementalComponent<State> {
      static get observedAttributes(): string[] {
        return super.observedAttributes.concat(['count']);
      }

      deserialize(serialized: string | undefined): State {
        return State.deserialize<number, State>(serialized);
      }

      render() {
        // do nothing
      }
    }

    expect(MyComponentObservedAttributes.observedAttributes).toBeDefined();
    expect(MyComponentObservedAttributes.observedAttributes).includes('state');

    expect(MyComponentWithCustomObservedAttributes.observedAttributes).toBeDefined();
    expect(MyComponentWithCustomObservedAttributes.observedAttributes).includes('state');
    expect(MyComponentWithCustomObservedAttributes.observedAttributes).includes('count');
  });

  it('instance should have correct state type and value', () => {
    class MyComponentInternalState extends MyStatefulComponent {}
    StatefulElementalComponent.register(MyComponentInternalState);
    const component = new MyComponentInternalState();

    expect(component.$state).toBeDefined();
    expect(component.$state).toEqual(myComponentState);
  });

  it('instance render method should render the correct dom', () => {
    class MyComponentRenderWorks extends MyStatefulComponent {}
    StatefulElementalComponent.register(MyComponentRenderWorks);
    const component = new MyComponentRenderWorks();

    document.body.appendChild(component);

    expect(component.isConnected).toEqual(true);
    expect(component.innerHTML).toEqual('');
    expect(component.$root.innerHTML).toEqual(`<span>${myComponentState}</span>`);
  });

  it('instance should render the correct dom from render method', () => {
    class MyComponentShouldRender extends MyStatefulComponent {}
    StatefulElementalComponent.register(MyComponentShouldRender);

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
    class MyStatefulComponentRendersTemplate extends MyStatefulComponent {}
    const tagName = `el-${toKebabCase(MyStatefulComponentRendersTemplate.name)}`;
    const renderedHtml = templateContent.replace('<p></p>', `<p>template state</p>`);

    StatefulElementalComponent.register(MyStatefulComponentRendersTemplate, { template: templateContent });

    const domComponentWithTemplate = document.createElement(tagName) as MyStatefulComponentRendersTemplate;

    // NOTE: it is important to use updateState to pass the state to the component for rendering
    document.body.appendChild(domComponentWithTemplate);
    domComponentWithTemplate.updateState(MyComponentState.from('template state'));

    const element = document.querySelector(tagName) as MyStatefulComponentRendersTemplate;

    expect(element.tagName.toLowerCase()).toEqual(tagName);
    expect(element.isConnected).toEqual(true);
    expect(element.innerHTML).toEqual('');
    expect(element.$root.innerHTML).toEqual(renderedHtml);
  });

  it('should maintain a complex value object as state', () => {
    class MyValueObjectState extends ValueObject {}

    interface ComplexStateData {
      vo: MyValueObjectState;
    }

    class ComplexState extends ElementalComponentState<ComplexStateData> {
      static defaultState<Type, K extends ValueObject<Type>>(): K {
        return ComplexState.from({ vo: MyValueObjectState.from('undefined') }) as K;
      }

      static deserializationMapper() {
        return { vo: MyValueObjectState };
      }

      validate() {
        super.validate();
        const isConsistent = !!this.value && !!this.value.vo && !!this.value.vo.value;

        if (!isConsistent) {
          throw new StateIsNotConsistentException();
        }
      }
    }

    class MyComplexStateComponent extends StatefulElementalComponent<ComplexState> {
      protected deserialize(serialized: string | undefined): ComplexState {
        return ComplexState.deserialize<ComplexStateData, ComplexState>(serialized);
      }

      protected render(): void {
        // do nothing
      }
    }

    const state: ComplexState = new ComplexState({ vo: myComponentState });

    StatefulElementalComponent.register(MyComplexStateComponent);
    const div = document.createElement('div');
    const component = new MyComplexStateComponent({ state });

    div.appendChild(component);
    expect(component.$state).toEqual(state);
  });
});
