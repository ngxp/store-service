import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';

@Injectable()
export class StoreService<T> {
    constructor(
        private store: Store<T>,
        private actions: Actions
    ) { }
}
