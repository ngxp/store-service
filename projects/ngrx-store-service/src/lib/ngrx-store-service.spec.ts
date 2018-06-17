import { MockStore } from 'ngrx-store-service/testing';
import { StoreServiceClass } from 'ngrx-store-service';

describe('StoreServiceClass', () => {
    const state = {
        property: 'data'
    };
    const store = new MockStore(state);
    const service = new StoreServiceClass(<any> store);

    it('dispatches via store on dispatch', () => {
        const action = { type: 'test' };

        service.dispatch(action);
        expect(store.dispatchedActions).toContain(action);
    });
});
