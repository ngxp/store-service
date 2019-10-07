import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action, createAction, createSelector, MemoizedSelector, MemoizedSelectorWithProps, props } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
import { hot } from 'jasmine-marbles';
import { BehaviorSubject, of } from 'rxjs';
import { dispatch, observe, select, StoreService, STORE_SERVICE_DISPATCHER, STORE_SERVICE_OBSERVER, STORE_SERVICE_SELECTOR } from './store-service';

// Needed because we can't import from testing...
class MockStore {

    dispatchedActions: Action[] = [];

    constructor(
        private _state: any
    ) { }

    select<S, P, R, F>(selector: MemoizedSelector<S, R, F> | MemoizedSelectorWithProps<S, P, R, F>, _props: P) {
        return of(selector(this._state, _props));
    }

    dispatch(action: Action) {
        this.dispatchedActions.push(action);
    }
}

const state = {
    property: 'someProperty'
};

const actionsSubject = new BehaviorSubject<Action>(null);

const selectorFn = createSelector(
    (_state: any) => _state,
    (_state: any, p: { propName: string }) => _state[p.propName]
    );

const actionType = 'someType';
const entityAddedActionType = 'entityAdded';
const entityRemovedActionType = 'entityRemoved';

const addEntityAction = createAction(actionType, props<{ entity: string }>());
const entityAddedAction = createAction(entityAddedActionType);
const entityRemovedAction = createAction(entityRemovedActionType);

const customMapper = a => a.entity;

@Injectable()
class MockService extends StoreService<any> {
    getStateProp = select(selectorFn);

    addEntity = dispatch(addEntityAction);

    addedEntitie$ = observe([addEntityAction, entityAddedAction]);

    addedEntitieWithCustomPayloadMapper$ = observe([addEntityAction], customMapper);
}

describe('Store Service', () => {
    let store: MockStore;
    let service: MockService;

    beforeEach(() => {
        store = new MockStore(state);
        service = new MockService(<any>store, new Actions(actionsSubject));
    });

    describe('Select', () => {

        it('calls select function on the store instance', () => {
            const storeSelectSpy = spyOn(store, 'select').and.callThrough();

            service.getStateProp({ propName: 'property' })
                .subscribe(value => {
                    expect(storeSelectSpy).toHaveBeenCalled();
                    expect(value).toBe('someProperty');
                });
        });

        it('can be spied upon', () => {
            const overwrittenValue = 'overwrittenProperty';
            const getStatePropSpy = spyOn(service, 'getStateProp').and.returnValue(of(overwrittenValue));

            service.getStateProp({ propName: 'property' })
                .subscribe(value => {
                    expect(getStatePropSpy).toHaveBeenCalled();
                    expect(value).toBe(overwrittenValue);
                });
        });

        it('sets the selectors property', () => {
            expect(service.getStateProp.hasOwnProperty(STORE_SERVICE_SELECTOR)).toBe(true);
        });
    });

    describe('Dispatch', () => {
        it('calls dispatch function on the store instance', () => {
            const entity = 'abc';
            const storeDispatchSpy = spyOn(store, 'dispatch').and.callThrough();

            service.addEntity({ entity });

            expect(storeDispatchSpy).toHaveBeenCalled();

            const dispatchedAction = <TypedAction<any> & { entity: any }>store.dispatchedActions[store.dispatchedActions.length - 1];

            expect(dispatchedAction.type).toBe(actionType);
            expect(dispatchedAction.entity).toBe(entity);
        });

        it('can be spied upon', () => {
            const entity = 'abc';
            const addEntitySpy = spyOn(service, 'addEntity');

            service.addEntity({ entity });

            expect(addEntitySpy).toHaveBeenCalled();
        });

        it('sets the selectors property', () => {
            expect(service.addEntity.hasOwnProperty(STORE_SERVICE_DISPATCHER)).toBe(true);
        });
    });

    describe('Observe', () => {
        it('filters actions of type', () => {
            const entity = 'abc';
            const action = addEntityAction({ entity });
            const expected = hot('a', { a: action});

            actionsSubject.next(action);

            expect(service.addedEntitie$()).toBeObservable(expected);
        });
        it('filters actions of type with custom payload mapper', () => {
            const entity = 'abc';
            const action = addEntityAction({ entity });

            const expected = hot('a', { a: customMapper(action) });
            actionsSubject.next(action);

            expect(service.addedEntitieWithCustomPayloadMapper$()).toBeObservable(expected);
        });
        it('does not emit if type does not match', () => {
            const action = entityRemovedAction();

            const expected = hot('');

            actionsSubject.next(action);
            expect(service.addedEntitie$()).toBeObservable(expected);
            expect(service.addedEntitieWithCustomPayloadMapper$()).toBeObservable(expected);
        });

        it('sets the observer property', () => {
            expect(service.addedEntitie$.hasOwnProperty(STORE_SERVICE_OBSERVER)).toBe(true);
            expect(service.addedEntitieWithCustomPayloadMapper$.hasOwnProperty(STORE_SERVICE_OBSERVER)).toBe(true);
        });

    });
});
