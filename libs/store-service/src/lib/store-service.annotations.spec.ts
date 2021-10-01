import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action, createAction, createSelector, MemoizedSelector, MemoizedSelectorWithProps, props } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
import { Observable, of, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { StoreService } from './store-service';
import { Dispatch, Observe, Select, STORE_SERVICE_ACTIONS, STORE_SERVICE_SELECTORS } from './store-service.annotations';

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

const entityAddedActionType = 'entityAdded';
const entityRemovedActionType = 'entityRemoved';
const actionsSubject = new Subject<Action>();

const selectorFn = createSelector(
    (_state: any) => _state,
    (_state: any, p: { propName: string }) => _state[p.propName]
);

const actionType = 'someType';

const addEntityAction = createAction(actionType, props<{ entity: any }>());

class AddOldEntityAction implements Action {
    type = actionType;
    constructor(
        public entity: any
    ) { }
}
@Injectable()
class MockService extends StoreService<any> {
    @Select(selectorFn)
    getStateProp: (props: { propName: string }) => Observable<string>;

    @Dispatch(addEntityAction)
    addEntity: ({ entity }) => void;

    @Dispatch(AddOldEntityAction)
    addOldEntity: (entity) => void;

    @Observe([entityAddedActionType, addEntityAction])
    addedEntitie$: Observable<any>;

    @Observe([entityAddedActionType], action => action.content)
    addedEntitieWithCustomPayloadMapper$: Observable<any>;
}

describe('Ngrx Store Service Annotations', () => {
    let store: MockStore;
    let service: MockService;

    beforeEach(() => {
        store = new MockStore(state);
        service = new MockService(<any>store, new Actions(actionsSubject));
    });

    describe('Select', () => {

        it('calls select function on the store instance', () => {
            const storeSelectSpy = jest.spyOn(store, 'select');

            service.getStateProp({ propName: 'property' })
                .subscribe(value => {
                    expect(storeSelectSpy).toHaveBeenCalled();
                    expect(value).toBe('someProperty');
                });
        });

        it('can be spied upon', () => {
            const overwrittenValue = 'overwrittenProperty';
            const getStatePropSpy = jest.spyOn(service, 'getStateProp').mockReturnValue(of(overwrittenValue));

            service.getStateProp({ propName: 'property' })
                .subscribe(value => {
                    expect(getStatePropSpy).toHaveBeenCalled();
                    expect(value).toBe(overwrittenValue);
                });
        });

        it('sets the selectors variable', () => {

            expect(service[STORE_SERVICE_SELECTORS]).toContain('getStateProp');
        });
    });

    describe('Dispatch', () => {


        it('calls dispatch function on the store instance', () => {
            const entity = { name: 'entity' };
            const storeDispatchSpy = jest.spyOn(store, 'dispatch');

            service.addEntity({ entity });

            expect(storeDispatchSpy).toHaveBeenCalled();

            const dispatchedAction = <TypedAction<any> & { entity: any }>store.dispatchedActions[store.dispatchedActions.length - 1];

            expect(dispatchedAction.type).toBe(actionType);
            expect(dispatchedAction.entity).toBe(entity);
        });

        it('calls dispatch function on the store instance for old actions', () => {
            const entity = { name: 'entity' };
            const storeDispatchSpy = jest.spyOn(store, 'dispatch');

            service.addOldEntity(entity);

            expect(storeDispatchSpy).toHaveBeenCalled();

            const dispatchedAction = <AddOldEntityAction> store.dispatchedActions[store.dispatchedActions.length - 1];

            expect(dispatchedAction.type).toBe(actionType);
            expect(dispatchedAction.entity).toBe(entity);
        });

        it('can be spied upon', () => {
            const entity = { name: 'entity' };
            const addEntitySpy = jest.spyOn(service, 'addEntity');

            service.addEntity({ entity });

            expect(addEntitySpy).toHaveBeenCalled();
        });

        it('can be spied upon for old action', () => {
            const entity = { name: 'entity' };
            const addEntitySpy = jest.spyOn(service, 'addOldEntity');

            service.addOldEntity(entity);

            expect(addEntitySpy).toHaveBeenCalled();
        });

        it('sets the actions variable', () => {
            expect(service[STORE_SERVICE_ACTIONS]).toContain('addEntity');
        });
    });

    describe('Observe', () => {
        beforeEach(() => {
            actionsSubject.next(null);
        });
        it('filters actions of type', () => {
            const expectedPayload = { value: 'payload' };
            const action = {
                type: entityAddedActionType,
                payload: expectedPayload
            };

            service.addedEntitie$
                .pipe(
                    take(1)
                )
                .subscribe(dispatchedAction => {
                    expect(dispatchedAction).toBe(action);
                });

            actionsSubject.next(action);
        });
        it('filters observers with type property', () => {
            const expectedPayload = { value: 'payload' };
            const action = {
                type: actionType,
                payload: expectedPayload
            };

            service.addedEntitie$
                .pipe(
                    take(1)
                )
                .subscribe(dispatchedAction => {
                    expect(dispatchedAction).toBe(action);
                });

            actionsSubject.next(action);
        });
        it('filters actions of type with custom payload mapper', () => {
            const expectedPayload = { value: 'payload' };
            service.addedEntitieWithCustomPayloadMapper$
                .pipe(
                    take(1)
                )
                .subscribe(payload => {
                    expect(payload).toBe(expectedPayload);
                });

            const action = {
                type: entityAddedActionType,
                content: expectedPayload
            };

            actionsSubject.next(action);
        });
        it('does not emit if type does not match', () => {
            service.addedEntitie$
                .pipe(
                    take(1)
                )
                .subscribe(payload => {
                    fail('Type should not emit');
                });

            const action = {
                type: 'wrong type',
                payload: null
            };
            actionsSubject.next(action);
        });

    });
});
