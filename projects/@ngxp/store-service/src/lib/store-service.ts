import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { ActionCreator, MemoizedSelector, MemoizedSelectorWithProps, Store } from '@ngrx/store';
import { FunctionWithParametersType } from '@ngrx/store/src/models';
import { Observable } from 'rxjs';

@Injectable()
export class StoreService<T> {
    constructor(
        protected store: Store<T>,
        protected actions: Actions
    ) { }
}

export type Dispatcher<A> =
    A extends ActionCreator<any, infer C> ?
    C extends FunctionWithParametersType<infer P, any> ? (...props: P) => void : () => void
    : () => void;

export type Selector<S> = S extends MemoizedSelector<any, infer R, any> ? () => Observable<R>
    : S extends MemoizedSelectorWithProps<any, infer P, infer T, any> ? (props: P) => Observable<T>
    : S extends (...props: infer P) => MemoizedSelector<any, infer R, any> ? (...props: P) => Observable<R>
    : () => Observable<unknown>;


