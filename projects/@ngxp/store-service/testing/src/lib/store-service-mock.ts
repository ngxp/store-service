import { Type, ValueProvider } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// Needed because otherwise the build would fail.
export const STORE_SERVICE_SELECTORS = '__STORE_SERVICE_SELECTORS';
export const STORE_SERVICE_OBSERVERS = '__STORE_SERVICE_OBSERVERS';
export const STORE_SERVICE_ACTIONS = '__STORE_SERVICE_ACTIONS';

type SelectorMethod<R> = (...args: any[]) => BehaviorSubject<R>;
type ActionDispatcherMethod = () => void;
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

    const selectors = serviceClass.prototype[STORE_SERVICE_SELECTORS];

    if (Array.isArray(selectors)) {
        Object.keys(serviceClass.prototype)
            .filter(key => selectors.includes(key))
            .forEach(key => {
                const initialValue = initialValues[key] ? initialValues[key] : undefined;
                const subject = new BehaviorSubject(initialValue);
                Object.defineProperty(service, key, {
                    get: () => () => subject,
                    set: () => { },
                    configurable: true,
                    enumerable: true
                });
            });
    }

    const observers = serviceClass.prototype[STORE_SERVICE_OBSERVERS];

    if (Array.isArray(observers)) {
        Object.keys(serviceClass.prototype)
            .filter(key => observers.includes(key))
            .forEach(key => {
                const initialValue = initialValues[key] ? initialValues[key] : undefined;
                const subject = new BehaviorSubject(initialValue);
                Object.defineProperty(service, key, {
                    get: () => subject,
                    set: () => { },
                    configurable: true,
                    enumerable: true
                });
            });
    }

    const dispatchers = serviceClass.prototype[STORE_SERVICE_ACTIONS];

    if (Array.isArray(dispatchers)) {
        Object.keys(serviceClass.prototype)
            .filter(key => dispatchers.includes(key))
            .forEach(key => {
                service[key] = function (...args) { };
            });
    }

    const serviceMock: StoreServiceMock<T> & T = <any>service;
    return serviceMock;
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
