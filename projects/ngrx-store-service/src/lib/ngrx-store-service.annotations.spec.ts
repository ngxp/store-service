import { Injectable } from '@angular/core';
import { Selector } from './ngrx-store-service.annotations';
import { Observable, of } from 'rxjs';
import { StoreServiceClass } from './ngrx-store-service';
import { MockStore } from 'ngrx-store-service/testing';

const state = {
    property: 'someProperty'
};

function selectorFn(propName: string) {
    return _state => _state[propName];
}
@Injectable()
class MockService extends StoreServiceClass<any> {
    @Selector(selectorFn)
    getStateProp: (propName: string) => Observable<string>;
}

describe('Ngrx Store Service Annotations', () => {
    describe('Selector', () => {
        it('calls select function on the store instance', () => {
            const store = new MockStore(state);
            const service = new MockService(<any> store);

            const storeSelectSpy = spyOn(store, 'select').and.callThrough();

            service.getStateProp('property')
                .subscribe(value => {
                    expect(storeSelectSpy).toHaveBeenCalled();
                    expect(value).toBe('someProperty');
                });
        });
    });
});
