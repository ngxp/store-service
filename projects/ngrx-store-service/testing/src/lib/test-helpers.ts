import { Type, ModuleWithProviders } from '@angular/core';
import { NGRX_STORE_SERVICE_storeVariableName } from 'ngrx-store-service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { NgModule } from '@angular/core';
import { Store } from '@ngrx/store';

export class MockStore {
    constructor(
        private state
    ) {}

    select(projectionFn: (state: any) => any) {
        return of(projectionFn(this.state));
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

export function provideStoreServiceMock<T>(serviceClass: Type<T>, initialValues: { [P in keyof T]?: any } = {}): StoreServiceMock<T> {
    const service = new serviceClass();

    Object.keys(serviceClass.prototype)
        .filter(key => key !== NGRX_STORE_SERVICE_storeVariableName)
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
