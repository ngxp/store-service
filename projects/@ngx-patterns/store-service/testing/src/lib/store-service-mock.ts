import { Type } from '@angular/core';
import { MockStore } from './mock-store';
import { BehaviorSubject, Subject } from 'rxjs';
import { ValueProvider } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions } from '@ngrx/effects';

// Needed because otherwise the build would fail.
export const STORE_SERVICE_SELECTORS = '__STORE_SERVICE_SELECTORS';
export const STORE_SERVICE_OBSERVERS = '__STORE_SERVICE_OBSERVERS';

// type SelectorMethod<R> = (...args: any[]) => BehaviorSubject<R>;
// type ActionDispatcherMethod = () => void;

export type StoreServiceMock<T> = {
    // [K in keyof T]: T[K] extends (...args: any[]) => Observable<infer R> ? SelectorMethod<R> : ActionDispatcherMethod
    // Uncomment when conditional types work in Angular
    // https://github.com/angular/angular/issues/23779
    [K in keyof T]: (...args) => BehaviorSubject<any>
};

export function createStoreServiceMock<T>(
    serviceClass: Type<T>,
    initialValues: { [P in keyof T]?: any } = {}
): StoreServiceMock<T> & T {

    const store = new MockStore(null);
    const actionsSubject = new Subject<Action>();
    const actions = new Actions(actionsSubject);
    const service = new serviceClass(store, actions);

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

    const serviceMock: StoreServiceMock<T> & T = <any> service;
    return serviceMock;
}

export function provideStoreServiceMock<T>(
    serviceClass: Type<T>,
    initialValues: { [P in keyof T]?: any } = {}
): ValueProvider {
    return                 {
        provide: serviceClass,
        useValue: createStoreServiceMock(serviceClass, initialValues)
    };
}
