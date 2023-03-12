/* eslint-disable @typescript-eslint/ban-ts-comment, no-magic-numbers */
import { describe, expect, it, vi } from 'vitest';

import { RegistryController } from '../../registry';
import { EventListenerRegistration } from '../types';
import { EventController, ElementalComponentCustomEventHandlerIsNotDefined } from '../';

describe('EventController', () => {
  it('should throw exception when both handler and handlerName are missing', () => {
    class MyComponentCantRegisterHandler extends HTMLElement {}
    RegistryController.registerComponent(MyComponentCantRegisterHandler);
    const component = new MyComponentCantRegisterHandler();
    const controller = new EventController(component);

    expect(() => controller.registerEventListeners([{ name: 'click' }])).to.throw(
      ElementalComponentCustomEventHandlerIsNotDefined,
    );
  });

  it('should throw exception when handler is not found', () => {
    class MyComponentHandlerMissing extends HTMLElement {}
    RegistryController.registerComponent(MyComponentHandlerMissing);
    const component = new MyComponentHandlerMissing();
    const controller = new EventController(component);

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
    RegistryController.registerComponent(MyComponentHandlerRegisteredMultipleTimes);
    const component = new MyComponentHandlerRegisteredMultipleTimes();
    const controller = new EventController(component);
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
    RegistryController.registerComponent(MyComponentWithLocalEvents);
    const component = new MyComponentWithLocalEvents();
    const controller = new EventController(component);
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
    RegistryController.registerComponent(MyComponentWithLocalEventsMethodRef);
    const component = new MyComponentWithLocalEventsMethodRef();
    const controller = new EventController(component);
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
    RegistryController.registerComponent(MyComponentCustomEventsConsumer);
    const consumer = new MyComponentCustomEventsConsumer();
    const controller = new EventController(consumer);
    const registrations: EventListenerRegistration[] = [
      { name: 'some-custom-event', handlerName: 'onCustomEvent', isCustomEvent: true },
    ];
    const spy = vi.spyOn(consumer, 'onCustomEvent').mockImplementation(() => {
      // do nothing
    });

    controller.registerEventListeners(registrations);

    class MyButton extends HTMLElement {}
    RegistryController.registerComponent(MyButton);

    const button = new MyButton();
    const buttonController = new EventController(button);

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
    RegistryController.registerComponent(MyComponentHandlerDeregistration);
    const component = new MyComponentHandlerDeregistration();
    const controller = new EventController(component);
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
