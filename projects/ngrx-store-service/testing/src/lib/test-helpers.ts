import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { BehaviorSubject, of } from 'rxjs';

// Needed because otherwise the build would fail.
const NGRX_STORE_SERVICE_SELECTORS = 'NGRX_STORE_SERVICE_SELECTORS';


export class MockStore {

    dispatchedActions: Action[] = [];

    constructor(
        private state
    ) { }

    select(projectionFn: (state: any) => any) {
        return of(projectionFn(this.state));
    }

    dispatch(action: Action) {
        this.dispatchedActions.push(action);
    }
}

@NgModule()
export class NgrxStoreServiceTestingModule {
    static withState(state: any): ModuleWithProviders {
        return {
            ngModule: NgrxStoreServiceTestingModule,
            providers: [
                {
                    provide: Store,
                    useValue: new MockStore(state)
                }
            ]
        };
    }
}
// type SelectorMethod<R> = (...args: any[]) => BehaviorSubject<R>;
// type ActionDispatcherMethod = () => void;

export type StoreServiceMock<T> = {
    // [K in keyof T]: T[K] extends (...args: any[]) => Observable<infer R> ? SelectorMethod<R> : ActionDispatcherMethod
    // Uncomment when conditional types work in Angular
    // https://github.com/angular/angular/issues/23779
    [K in keyof T]: (...args) => BehaviorSubject<any>
};

export function provideStoreServiceMock<T>(
    serviceClass: Type<T>,
    initialValues: { [P in keyof T]?: any } = {}): StoreServiceMock<T> {

    const store = new MockStore(null);
    const service = new serviceClass(store);

    Object.keys(serviceClass.prototype)
        .filter(key => serviceClass.prototype[NGRX_STORE_SERVICE_SELECTORS].includes(key))
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
    const serviceMock: StoreServiceMock<T> = <any>service;
    return serviceMock;
}
