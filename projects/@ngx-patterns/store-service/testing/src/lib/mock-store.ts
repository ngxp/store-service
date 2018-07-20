import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';

export class MockStore {

    dispatchedActions: Action[] = [];

    constructor(
        private state
    ) { }

    select<T, R>(projectionFn: (state: T) => R): Observable<R> {
        return of(projectionFn(this.state));
    }

    dispatch(action: Action) {
        this.dispatchedActions.push(action);
    }
}
