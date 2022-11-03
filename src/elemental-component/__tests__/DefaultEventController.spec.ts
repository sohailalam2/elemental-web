/* eslint-disable @typescript-eslint/ban-ts-comment, no-magic-numbers */
import { describe, expect, it, vi } from 'vitest';

import { DefaultRegistry } from '../DefaultRegistry';
import { EventListenerRegistration } from '../types';
import { DefaultEventController } from '../DefaultEventController';
import { ElementalComponentCustomEventHandlerIsNotDefined } from '../exceptions';

describe('DefaultEventController', () => {
  it('should throw exception when both handler and handlerName are missing', () => {
    class MyComponentCantRegisterHandler extends HTMLElement {}
    DefaultRegistry.registerComponent(MyComponentCantRegisterHandler);
    const component = new MyComponentCantRegisterHandler();
    const controller = new DefaultEventController(component);

    expect(() => controller.registerEventListeners([{ name: 'click' }])).to.throw(
      ElementalComponentCustomEventHandlerIsNotDefined,
    );
  });

  it('should throw exception when handler is not found', () => {
    class MyComponentHandlerMissing extends HTMLElement {}
    DefaultRegistry.registerComponent(MyComponentHandlerMissing);
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
    DefaultRegistry.registerComponent(MyComponentHandlerRegisteredMultipleTimes);
    const component = new MyComponentHandlerRegisteredMultipleTimes();
    const controller = new DefaultEventController(component);
    const registrations: EventListenerRegistration[] = [{ name: 'click', handlerName: 'onClickHandler' }];

    expect(() => controller.registerEventListeners(registrations)).to.not.throw();
    expect(() => controller.registerEventListeners(registrations)).to.not.throw();
    // @ts-ignore
    expect(controller.eventListeners.has(registrations[0].name)).toEqual(true);
  });

  it('should register handler for default events', () => {
    class MyComponentWithLocalEvents extends HTMLElement {
      onClickHandler() {
        // do nothing
      }
    }
    DefaultRegistry.registerComponent(MyComponentWithLocalEvents);
    const component = new MyComponentWithLocalEvents();
    const controller = new DefaultEventController(component);
    const registrations: EventListenerRegistration[] = [{ name: 'click', handlerName: 'onClickHandler' }];

    const spy = vi.spyOn(component, 'onClickHandler').mockImplementation(() => {
      // do nothing
    });

    controller.registerEventListeners(registrations);
    controller.raiseEvent('click');

    // @ts-ignore
    expect(controller.eventListeners.has(registrations[0].name)).toEqual(true);
    expect(spy).toHaveBeenCalledOnce();
  });

  it.todo('should register handler using method reference for default events', () => {
    class MyComponentWithLocalEventsMethodRef extends HTMLElement {
      clickHandler() {
        // do nothing
      }
    }
    DefaultRegistry.registerComponent(MyComponentWithLocalEventsMethodRef);
    const component = new MyComponentWithLocalEventsMethodRef();
    const controller = new DefaultEventController(component);
    const registrations: EventListenerRegistration[] = [{ name: 'click', handler: component.clickHandler }];

    const spy = vi.spyOn(component, 'clickHandler').mockImplementation(() => {
      // do nothing
    });

    controller.registerEventListeners(registrations);
    controller.raiseEvent('click');

    // @ts-ignore
    expect(controller.eventListeners.has(registrations[0].name)).toEqual(true);
    expect(spy).toHaveBeenCalledOnce();
  });

  it('should register handler for custom events', () => {
    class MyComponentCustomEventsConsumer extends HTMLElement {
      onCustomEvent() {
        // do nothing
      }
    }
    DefaultRegistry.registerComponent(MyComponentCustomEventsConsumer);
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
    DefaultRegistry.registerComponent(MyButton);

    const button = new MyButton();
    const buttonController = new DefaultEventController(button);

    document.body.appendChild(button);

    buttonController.raiseEvent('some-custom-event', true);
    buttonController.raiseEvent('some-custom-event', true, 'payload');

    // @ts-ignore
    expect(controller.eventListeners.has(registrations[0].name)).toEqual(true);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should unregistered a registered handler', () => {
    class MyComponentHandlerDeregistration extends HTMLElement {
      onClickHandler() {
        // do nothing
      }
    }
    DefaultRegistry.registerComponent(MyComponentHandlerDeregistration);
    const component = new MyComponentHandlerDeregistration();
    const controller = new DefaultEventController(component);
    const registrations: EventListenerRegistration[] = [
      { name: 'click', handlerName: 'onClickHandler' },
      { name: 'custom-click', handlerName: 'onClickHandler', isCustomEvent: true },
    ];

    controller.registerEventListeners(registrations);
    // @ts-ignore
    expect(controller.eventListeners.has(registrations[0].name)).toEqual(true);
    // @ts-ignore
    expect(controller.eventListeners.has(registrations[1].name)).toEqual(true);

    controller.deregisterEventListeners();
    // @ts-ignore
    expect(controller.eventListeners.has(registrations[0].name)).toEqual(false);
    // @ts-ignore
    expect(controller.eventListeners.has(registrations[1].name)).toEqual(false);
  });
});
