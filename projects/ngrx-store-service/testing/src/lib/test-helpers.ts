import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { BehaviorSubject, Observable, of } from 'rxjs';

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

export type StoreServiceMock<T> = {
    [P in keyof T]: () => BehaviorSubject<any>;
};

export function provideStoreServiceMock<T>(
    serviceClass: Type<T>,
    initialValues: { [P in keyof T]?: any } = {},
    ignoreProps: string[] = []): StoreServiceMock<T> {

    const service = new serviceClass();

    const propsToIgnore: string[] = ['store', 'dispatch', ...ignoreProps];

    Object.keys(serviceClass.prototype)
        .filter(key => !propsToIgnore.includes(key))
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
