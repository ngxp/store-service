import { Action } from '@ngrx/store';
import { of } from 'rxjs';

export class MockStore {

    dispatchedActions: Action[] = [];

    constructor(
        private state
    ) { }

    pipe(...operators) {
        return of(this.state).pipe(
            ...operators
        );
    }

    dispatch(action: Action) {
        this.dispatchedActions.push(action);
    }
}
