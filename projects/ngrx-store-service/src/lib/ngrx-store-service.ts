import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

@Injectable()
export class StoreServiceClass<T> {
    constructor(
        private store: Store<T>
    ) { }
}
