import { Type, ValueProvider } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, Observable } from 'rxjs';

// Needed because otherwise the build would fail.
export const STORE_SERVICE_SELECTORS = '__STORE_SERVICE_SELECTORS';
export const STORE_SERVICE_OBSERVERS = '__STORE_SERVICE_OBSERVERS';
export const STORE_SERVICE_ACTIONS = '__STORE_SERVICE_ACTIONS';

type SelectorMethod<R> = (...args: any[]) => BehaviorSubject<R>;
type ActionDispatcherMethod = (...args: any[]) => void;
type ObserverMethod<U> = BehaviorSubject<U>;

export type StoreServiceMock<T> = {
    [K in keyof T]: T[K] extends (...args: any[]) => Observable<infer R> ? SelectorMethod<R> :
    T[K] extends (...args: any[]) => void ? ActionDispatcherMethod :
    T[K] extends Observable<infer U> ? ObserverMethod<U> :
    T[K]
};

export function createStoreServiceMock<T>(
    serviceClass: Type<T>,
    initialValues: { [P in keyof T]?: any } = {}
): StoreServiceMock<T> & T {

    const service = new serviceClass();

    const selectors = findProps(serviceClass, service, STORE_SERVICE_SELECTORS);
    if (Array.isArray(selectors)) {
        mockSelectors(service, selectors, initialValues);
    }

    const observers = findProps(serviceClass, service, STORE_SERVICE_OBSERVERS);
    if (Array.isArray(observers)) {
        mockObservers(service, observers, initialValues);
    }

    const dispatchers = findProps(serviceClass, service, STORE_SERVICE_ACTIONS);
    if (Array.isArray(dispatchers)) {
        mockDispatchers(service, dispatchers);
    }

    const serviceMock: StoreServiceMock<T> & T = <any>service;
    return serviceMock;
}

function findProps<T>(serviceClass: Type<T>, service: T, propType: string): string[] {
    let props = [];

    const propsOld = serviceClass.prototype[propType];
    if (Array.isArray(propsOld)) {
        props = [...props, ...propsOld];
    }

    const propsNew = Object.keys(service)
        .filter(key => service[key] !== undefined)
        .filter(key => service[key][propType] === true);
    if (Array.isArray(propsNew)) {
        props = [...props, ...propsNew];
    }

    return props;
}


function mockSelectors<T>(service: T, selectors: string[], initialValues) {
       selectors.forEach(key => {
            const initialValue = initialValues[key] ? initialValues[key] : undefined;
            const subject = new BehaviorSubject(initialValue);

            service[key] = () => subject;
       })
}

function mockObservers<T>(service: T, observers: string[], initialValues) {
    observers.forEach(key => {
        const initialValue = initialValues[key] ? initialValues[key] : undefined;
        const subject = new BehaviorSubject(initialValue);

        Object.defineProperty(service, key, {
            get: function () {
                return () => subject
            },
            set: function () { },
            enumerable: true,
            configurable: true
        });
   })
}

function mockDispatchers<T>(service: T, dispatchers: string[]) {
    dispatchers.forEach(key => {
        service[key] = function (...args) { };
   })
}


export function provideStoreServiceMock<T>(
    serviceClass: Type<T>,
    initialValues: { [P in keyof T]?: any } = {}
): ValueProvider {
    return {
        provide: serviceClass,
        useValue: createStoreServiceMock(serviceClass, initialValues),
    };
}

// Custom method to get mocked Service. With any typing to fix error because types don't match
export function getStoreServiceMock<T>(type: Type<T>): StoreServiceMock<T> {
    return TestBed.inject<any>(type);
}
