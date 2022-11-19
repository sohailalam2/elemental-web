/* eslint-disable  @typescript-eslint/ban-ts-comment, no-console, max-classes-per-file */
import { describe, expect, it } from 'vitest';

import { ElementalComponentOptions } from '../types';
import { ElementalComponentPrefix } from '../values';
import { ElementalComponent } from '../ElementalComponent';
import {
  RegistrationOptions,
  ElementalComponentRegistry,
  ElementalComponentIsNotRegisteredException,
  ElementalComponentNoSuchTemplateFoundException,
  ElementalComponentTemplateCanNotBeEmptyException,
} from '../registry';

// we need to define webcrypto because Abu uses it to generate the random numbers
// and this is not available in the simulated DOM test environment
import crypto from 'crypto';

Object.defineProperty(globalThis, 'crypto', { value: { webcrypto: crypto.webcrypto } });

describe('ElementalComponent Registration', () => {
  abstract class MyComponent extends ElementalComponent {
    constructor(options?: ElementalComponentOptions) {
      super(options);
    }

    protected render() {
      // do nothing
    }
  }

  it('should throw ElementalComponentNotRegisteredException', () => {
    class MyComponentNotRegistered extends MyComponent {}
    // NOTE: unfortunately this test fails in jsdom due to its internal implementation so run it using happy-dom
    // JS DOM throws a TypeError: Invalid constructor, possibly because it doesn't support extending html elements
    expect(() => new MyComponentNotRegistered()).toThrow(ElementalComponentIsNotRegisteredException);
  });

  it('should have been registered', () => {
    class MyComponentIsRegistered extends MyComponent {}
    ElementalComponent.register(MyComponentIsRegistered);

    expect(() => new MyComponentIsRegistered()).not.toThrow(ElementalComponentIsNotRegisteredException);
    expect(ElementalComponentRegistry.isComponentRegistered(MyComponentIsRegistered)).toEqual(true);
  });

  it('should have been registered with a custom prefix', () => {
    class MyComponentWithCustomPrefix extends MyComponent {}

    const options: RegistrationOptions = { prefix: ElementalComponentPrefix.from('custom') };

    ElementalComponent.register(MyComponentWithCustomPrefix, options);

    expect(() => new MyComponentWithCustomPrefix()).not.toThrow(ElementalComponentIsNotRegisteredException);
    expect(ElementalComponentRegistry.isComponentRegistered(MyComponentWithCustomPrefix)).toEqual(true);
    expect(new MyComponentWithCustomPrefix().tagName).toEqual('custom-my-component-with-custom-prefix');
  });

  it('should have been registered with a template', () => {
    class MyComponentWithTemplate extends MyComponent {}

    const options: RegistrationOptions = { template: `<p>Hello World</p>` };

    ElementalComponent.register(MyComponentWithTemplate, options);

    expect(() => new MyComponentWithTemplate()).not.toThrow(ElementalComponentIsNotRegisteredException);
    expect(ElementalComponentRegistry.isComponentRegistered(MyComponentWithTemplate)).toEqual(true);
    // @ts-ignore
    expect(new MyComponentWithTemplate().$template).toBeDefined();
    expect(new MyComponentWithTemplate().$root.innerHTML).toEqual(options.template);
  });

  it('should throw when template is empty', () => {
    class MyComponentWithEmptyTemplate extends MyComponent {}
    const options: RegistrationOptions = { template: '' };

    expect(() => ElementalComponent.register(MyComponentWithEmptyTemplate, options)).toThrow(
      ElementalComponentTemplateCanNotBeEmptyException,
    );
  });

  it('should throw an exception when template id is not found', () => {
    class MyComponentWithTemplateIdNotFound extends MyComponent {}
    const options: RegistrationOptions = { templateId: `not-found` };

    expect(() => ElementalComponent.register(MyComponentWithTemplateIdNotFound, options)).toThrow(
      ElementalComponentNoSuchTemplateFoundException,
    );
  });

  it('should register with an existing template id', () => {
    class MyComponentWithTemplateId extends MyComponent {}
    const options: RegistrationOptions = { templateId: `existing-template` };
    const template = document.createElement('template') as HTMLTemplateElement;

    template.id = options.templateId as string;
    template.innerHTML = `<p>Hello World</p>`;
    document.body.prepend(template);

    expect(() => ElementalComponent.register(MyComponentWithTemplateId, options)).not.toThrow();
    expect(ElementalComponentRegistry.isComponentRegistered(MyComponentWithTemplateId)).toEqual(true);
    // @ts-ignore
    expect(new MyComponentWithTemplateId().$template).toBeDefined();
    expect(new MyComponentWithTemplateId().$root.innerHTML).toEqual(template.innerHTML);
  });

  it('should throw an exception when template id is not found during instantiation', () => {
    class MyInstanceWithTemplateIdNotFound extends MyComponent {}
    ElementalComponent.register(MyInstanceWithTemplateIdNotFound);

    expect(() => new MyInstanceWithTemplateIdNotFound({ templateId: 'not-found' })).toThrow(
      ElementalComponentNoSuchTemplateFoundException,
    );
  });

  it('should register with an existing template id', () => {
    class MyInstanceWithTemplateId extends MyComponent {}
    const template = document.createElement('template') as HTMLTemplateElement;

    template.id = 'some-template';
    template.innerHTML = `<p>Hello World</p>`;
    document.body.prepend(template);

    ElementalComponent.register(MyInstanceWithTemplateId);
    const component = new MyInstanceWithTemplateId({ templateId: template.id });

    expect(ElementalComponentRegistry.isComponentRegistered(MyInstanceWithTemplateId)).toEqual(true);
    // @ts-ignore
    expect(component.$template).toBeDefined();
    expect(component.$root.innerHTML).toEqual(template.innerHTML);
  });

  it('should extend a native element [deprecated]', () => {
    class MyExtendedComponent extends MyComponent {}
    const options: RegistrationOptions = { extends: 'a' };

    expect(() => ElementalComponent.register(MyExtendedComponent, options)).not.toThrow();
    expect(ElementalComponentRegistry.isComponentRegistered(MyExtendedComponent)).toEqual(true);
  });

  it('should register a template for a component', () => {
    class MyTemplateForComponent extends MyComponent {}

    const template = `<p>Hello World</p>`;

    ElementalComponent.register(MyTemplateForComponent, { template });

    expect(ElementalComponentRegistry.isTemplateRegistered(MyTemplateForComponent)).toEqual(true);
    expect(ElementalComponentRegistry.isComponentRegistered(MyTemplateForComponent)).toEqual(true);
    // @ts-ignore
    expect(new MyTemplateForComponent().$template).toBeDefined();
    expect(new MyTemplateForComponent().$root.innerHTML).toEqual(template);
  });

  it('should register a component that extends a parent', () => {
    class MyParentComponent extends MyComponent {}
    class MyChildComponent extends MyParentComponent {}

    ElementalComponent.register(MyParentComponent);

    expect(() => ElementalComponent.register(MyChildComponent)).to.not.throw();
    // @ts-ignore
    expect(new MyChildComponent().$template).toBeNull();
  });

  it('should register a component that extends a parent with a template', () => {
    class MyParentComponentWithTemplate extends MyComponent {}
    class MyChildComponentExtendsParentWithTemplate extends MyParentComponentWithTemplate {}
    const template = `<p>Extend Me</p>`;

    ElementalComponent.register(MyParentComponentWithTemplate, { template });

    expect(() => ElementalComponent.register(MyChildComponentExtendsParentWithTemplate)).to.not.throw();
    // @ts-ignore
    expect(new MyChildComponentExtendsParentWithTemplate().$template).toBeDefined();
    expect(new MyChildComponentExtendsParentWithTemplate().$root.innerHTML).toEqual(template);
  });

  it('should register a component that extends a parent and registers own template', () => {
    class MyParentComponentWithoutTemplateForExtension extends MyComponent {}
    class MyChildComponentExtendsParentAndRegistersTemplate extends MyParentComponentWithoutTemplateForExtension {}
    const template = `<p>Extend Me</p>`;

    ElementalComponent.register(MyParentComponentWithoutTemplateForExtension);
    ElementalComponent.register(MyChildComponentExtendsParentAndRegistersTemplate, { template });
    const component = new MyChildComponentExtendsParentAndRegistersTemplate();

    // @ts-ignore
    expect(component.$template).toBeDefined();
    expect(component.$root.innerHTML).toEqual(template);
  });

  it('should register a component that extends a parent and attaches some other existing template', () => {
    class MySimpleParentComponent extends MyComponent {}
    class MyChildComponentExtendsParentAndSomeTemplate extends MySimpleParentComponent {}
    const template = document.createElement('template') as HTMLTemplateElement;

    template.id = 'some-template';
    template.innerHTML = `<p>Hello World</p>`;
    document.body.prepend(template);

    ElementalComponent.register(MySimpleParentComponent);
    ElementalComponent.register(MyChildComponentExtendsParentAndSomeTemplate);
    const component = new MyChildComponentExtendsParentAndSomeTemplate({ templateId: template.id });

    // @ts-ignore
    expect(component.$template).toBeDefined();
    expect(component.$root.innerHTML).toEqual(template.innerHTML);
  });
});
