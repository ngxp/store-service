import { Store, Action } from '@ngrx/store';
import { Injectable } from '@angular/core';

@Injectable()
export class StoreServiceClass<T> {
    constructor(
        private store: Store<T>
    ) { }

    dispatch(action: Action) {
        this.store.dispatch(action);
    }
}
