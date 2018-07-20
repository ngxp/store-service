import { Type } from '@angular/core';
import { MockStore } from './mock-store';
import { BehaviorSubject } from 'rxjs';

// Needed because otherwise the build would fail.
export const STORE_SERVICE_SELECTORS = '__STORE_SERVICE_SELECTORS';

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
): StoreServiceMock<T> {

    const store = new MockStore(null);
    const service = new serviceClass(store);

    Object.keys(serviceClass.prototype)
        .filter(key => serviceClass.prototype[STORE_SERVICE_SELECTORS].includes(key))
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

    const serviceMock: StoreServiceMock<T> = <any> service;
    return serviceMock;
}
