import { Injectable } from '@angular/core';
import { NGRX_STORE_SERVICE_storeVariableName, Selector, StoreService } from 'projects/ngrx-store-service/src/lib/ngrx-store-service.annotations';
import { Observable, of } from 'rxjs';

const state = {
    property: 'someProperty'
};

function selectorFn(propName: string) {
    return _state => _state[propName];
}

class MockStore {
    constructor() {
    }

    select(projectionFn: (state: any) => any) {
        return of(
            projectionFn(state)
        );
    }
}

@Injectable()
@StoreService()
class MockService {
    constructor(
        private store: MockStore
    ) { }

    @Selector(selectorFn)
    getStateProp: (propName: string) => Observable<string>;

}

@Injectable()
@StoreService('totallyNotStore')
class MockServiceWithCustomVariableName {
    constructor(
        private totallyNotStore: MockStore
    ) { }

    @Selector(selectorFn)
    getStateProp: (propName: string) => Observable<string>;

}

describe('Ngrx Store Service Annoations', () => {
    describe('StoreService', () => {

        it('sets store as standard variable name', () => {
            const store = new MockStore();
            const service = new MockService(store);

            expect(service[NGRX_STORE_SERVICE_storeVariableName]).toBe('store');
        });

        it('sets custom variable name', () => {
            const store = new MockStore();
            const service = new MockServiceWithCustomVariableName(store);

            expect(service[NGRX_STORE_SERVICE_storeVariableName]).toBe('totallyNotStore');
        });
    });

    describe('Selector', () => {
        it('calls select function on the store instance', () => {
            const store = new MockStore();
            const service = new MockService(store);

            const storeSelectSpy = spyOn(store, 'select').and.callThrough();

            service.getStateProp('property')
                .subscribe(value => {
                    expect(storeSelectSpy).toHaveBeenCalled();
                    expect(value).toBe('someProperty');
                });
        });
        it('calls select function on the store instance with custom variable name', () => {
            const store = new MockStore();
            const service = new MockServiceWithCustomVariableName(store);

            const storeSelectSpy = spyOn(store, 'select').and.callThrough();

            service.getStateProp('property')
                .subscribe(value => {
                    expect(storeSelectSpy).toHaveBeenCalled();
                    expect(value).toBe('someProperty');
                });
        });
    });
});
