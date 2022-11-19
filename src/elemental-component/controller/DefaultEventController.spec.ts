/* eslint-disable @typescript-eslint/ban-ts-comment, no-magic-numbers */
import { describe, expect, it, vi } from 'vitest';

import { ElementalComponentRegistry } from '../registry';
import { EventListenerRegistration } from './types';
import { DefaultEventController, ElementalComponentCustomEventHandlerIsNotDefined } from './';

describe('DefaultEventController', () => {
  it('should throw exception when both handler and handlerName are missing', () => {
    class MyComponentCantRegisterHandler extends HTMLElement {}
    ElementalComponentRegistry.registerComponent(MyComponentCantRegisterHandler);
    const component = new MyComponentCantRegisterHandler();
    const controller = new DefaultEventController(component);

    expect(() => controller.registerEventListeners([{ name: 'click' }])).to.throw(
      ElementalComponentCustomEventHandlerIsNotDefined,
    );
  });

  it('should throw exception when handler is not found', () => {
    class MyComponentHandlerMissing extends HTMLElement {}
    ElementalComponentRegistry.registerComponent(MyComponentHandlerMissing);
    const component = new MyComponentHandlerMissing();
    const controller = new DefaultEventController(component);

    expect(() => controller.registerEventListeners([{ name: 'click', handlerName: 'onSwipe' }])).to.throw(
      ElementalComponentCustomEventHandlerIsNotDefined,
    );
  });

  it('should not register handler more than once', () => {
    class MyComponentHandlerRegisteredMultipleTimes extends HTMLElement {
      onClickHandler() {
        // do nothing
      }
    }
    ElementalComponentRegistry.registerComponent(MyComponentHandlerRegisteredMultipleTimes);
    const component = new MyComponentHandlerRegisteredMultipleTimes();
    const controller = new DefaultEventController(component);
    const registrations: EventListenerRegistration[] = [{ name: 'click', handlerName: 'onClickHandler' }];

    // @ts-ignore
    expect(controller.eventListeners.size).toEqual(0);
    expect(() => controller.registerEventListeners(registrations)).to.not.throw();
    expect(() => controller.registerEventListeners(registrations)).to.not.throw();
    // @ts-ignore
    expect(controller.eventListeners.size).toEqual(registrations.length);
  });

  it('should register handler for default events', () => {
    class MyComponentWithLocalEvents extends HTMLElement {
      onClickHandler() {
        // do nothing
      }
    }
    ElementalComponentRegistry.registerComponent(MyComponentWithLocalEvents);
    const component = new MyComponentWithLocalEvents();
    const controller = new DefaultEventController(component);
    const registrations: EventListenerRegistration[] = [{ name: 'click', handlerName: 'onClickHandler' }];

    const spy = vi.spyOn(component, 'onClickHandler').mockImplementation(() => {
      // do nothing
    });

    controller.registerEventListeners(registrations);
    controller.raiseEvent('click');

    // calling it multiple times should be fine
    controller.registerEventListeners(registrations);

    // @ts-ignore
    expect(controller.eventListeners.size).toEqual(registrations.length);
    expect(spy).toHaveBeenCalledOnce();
  });

  it('should register handler using method reference for default events', () => {
    class MyComponentWithLocalEventsMethodRef extends HTMLElement {
      public isCalled = false;

      clickHandler() {
        this.isCalled = true;
      }
    }
    ElementalComponentRegistry.registerComponent(MyComponentWithLocalEventsMethodRef);
    const component = new MyComponentWithLocalEventsMethodRef();
    const controller = new DefaultEventController(component);
    const registrations: EventListenerRegistration[] = [
      { name: 'click', handler: component.clickHandler, attachTo: component },
    ];

    controller.registerEventListeners(registrations);
    component.click();

    // @ts-ignore
    expect(controller.eventListeners.size).toEqual(registrations.length);
    expect(component.isCalled).toBeTruthy();
  });

  it('should register handler for custom events', () => {
    class MyComponentCustomEventsConsumer extends HTMLElement {
      onCustomEvent() {
        // do nothing
      }
    }
    ElementalComponentRegistry.registerComponent(MyComponentCustomEventsConsumer);
    const consumer = new MyComponentCustomEventsConsumer();
    const controller = new DefaultEventController(consumer);
    const registrations: EventListenerRegistration[] = [
      { name: 'some-custom-event', handlerName: 'onCustomEvent', isCustomEvent: true },
    ];
    const spy = vi.spyOn(consumer, 'onCustomEvent').mockImplementation(() => {
      // do nothing
    });

    controller.registerEventListeners(registrations);

    class MyButton extends HTMLElement {}
    ElementalComponentRegistry.registerComponent(MyButton);

    const button = new MyButton();
    const buttonController = new DefaultEventController(button);

    document.body.appendChild(button);

    buttonController.raiseEvent('some-custom-event', true);
    buttonController.raiseEvent('some-custom-event', true, 'payload');

    // @ts-ignore
    expect(controller.eventListeners.size).toEqual(registrations.length);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should unregistered a registered handler', () => {
    class MyComponentHandlerDeregistration extends HTMLElement {
      onClickHandler() {
        // do nothing
      }
    }
    ElementalComponentRegistry.registerComponent(MyComponentHandlerDeregistration);
    const component = new MyComponentHandlerDeregistration();
    const controller = new DefaultEventController(component);
    const registrations: EventListenerRegistration[] = [
      { name: 'click', handlerName: 'onClickHandler' },
      { name: 'custom-click', handlerName: 'onClickHandler', isCustomEvent: true },
    ];

    controller.registerEventListeners(registrations);
    // @ts-ignore
    expect(controller.eventListeners.size).toEqual(registrations.length);

    controller.deregisterEventListeners();
    // @ts-ignore
    expect(controller.eventListeners.size).toEqual(0);
  });
});
