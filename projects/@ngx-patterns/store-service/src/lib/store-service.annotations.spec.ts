import { Injectable } from '@angular/core';
import { Action as NgrxAction } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { StoreService } from './store-service';
import { Action, STORE_SERVICE_ACTIONS, STORE_SERVICE_SELECTORS, Selector } from './store-service.annotations';

// Needed because we can't import from testing...
class MockStore {

    dispatchedActions: NgrxAction[] = [];

    constructor(
        private _state
    ) { }

    select(projectionFn: (state: any) => any) {
        return of(projectionFn(this._state));
    }

    dispatch(action: NgrxAction) {
        this.dispatchedActions.push(action);
    }
}

const state = {
    property: 'someProperty'
};

function selectorFn(propName: string) {
    return _state => _state[propName];
}

const actionType = 'someType';

class AddEntityAction implements NgrxAction {
    public type = actionType;
    constructor(
        public entity: any
    ) { }
}
@Injectable()
class MockService extends StoreService<any> {
    @Selector(selectorFn)
    getStateProp: (propName: string) => Observable<string>;

    @Action(AddEntityAction)
    addEntity: (entity: any) => void;
}

describe('Ngrx Store Service Annotations', () => {
    let store: MockStore;
    let service: MockService;

    beforeEach(() => {
        store = new MockStore(state);
        service = new MockService(<any>store);
    });

    describe('Selector', () => {

        it('calls select function on the store instance', () => {
            const storeSelectSpy = spyOn(store, 'select').and.callThrough();

            service.getStateProp('property')
                .subscribe(value => {
                    expect(storeSelectSpy).toHaveBeenCalled();
                    expect(value).toBe('someProperty');
                });
        });

        it('can be spied upon', () => {
            const overwrittenValue = 'overwrittenProperty';
            const getStatePropSpy = spyOn(service, 'getStateProp').and.returnValue(of(overwrittenValue));

            service.getStateProp('property')
                .subscribe(value => {
                    expect(getStatePropSpy).toHaveBeenCalled();
                    expect(value).toBe(overwrittenValue);
                });
        });

        it('sets the selectors variable', () => {

            expect(service[STORE_SERVICE_SELECTORS]).toContain('getStateProp');
        });
    });

    describe('Action', () => {

        it('calls dispatch function on the store instance', () => {
            const entity = { name: 'entity' };
            const storeDispatchSpy = spyOn(store, 'dispatch').and.callThrough();

            service.addEntity(entity);

            expect(storeDispatchSpy).toHaveBeenCalled();

            const dispatchedAction = <AddEntityAction>store.dispatchedActions[store.dispatchedActions.length - 1];

            expect(dispatchedAction.type).toBe(actionType);
            expect(dispatchedAction.entity).toBe(entity);
        });

        it('can be spied upon', () => {
            const entity = { name: 'entity' };
            const addEntitySpy = spyOn(service, 'addEntity');

            service.addEntity(entity);

            expect(addEntitySpy).toHaveBeenCalled();
        });

        it('sets the actions variable', () => {
            expect(service[STORE_SERVICE_ACTIONS]).toContain('addEntity');
        });
    });
});
