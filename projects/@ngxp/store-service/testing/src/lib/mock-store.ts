import { Action } from '@ngrx/store';
import { of, OperatorFunction } from 'rxjs';
import { pipeFromArray } from 'rxjs/internal/util/pipe';

export class MockStore {

    dispatchedActions: Action[] = [];

    constructor(
        private state
    ) { }

    // Spreading operators into the pipe function from rxjs does not work anymore
    // See: https://github.com/ReactiveX/rxjs/issues/3989
    pipe(...operators: OperatorFunction<any, any>[]) {
        return pipeFromArray(operators)(of(this.state));
    }

    dispatch(action: Action) {
        this.dispatchedActions.push(action);
    }
}
