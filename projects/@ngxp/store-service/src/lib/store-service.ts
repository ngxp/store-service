import { Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { ActionCreator, MemoizedSelector, MemoizedSelectorWithProps, Store } from '@ngrx/store';
import { FunctionWithParametersType } from '@ngrx/store/src/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export const STORE_SERVICE_SELECTOR = '__STORE_SERVICE_SELECTOR';
export const STORE_SERVICE_OBSERVER = '__STORE_SERVICE_OBSERVER';
export const STORE_SERVICE_DISPATCHER = '__STORE_SERVICE_DISPATCHER';

@Injectable()
export class StoreService<T> {
    constructor(
        private store: Store<T>,
        private actions: Actions
    ) { }
}

export type Dispatcher<A> =
    A extends ActionCreator<any, infer C> ?
    C extends FunctionWithParametersType<infer P, any> ? (...props: P) => void : () => void
    : () => void;

export type Selector<S> = S extends MemoizedSelector<any, infer R, any> ? () => Observable<R>
    : S extends MemoizedSelectorWithProps<any, infer P, infer T, any> ? (props: P) => Observable<T> : () => Observable<unknown>;


export function select<S>(selectorFn: S): Selector<S> {
    const fn = function(props: any) {
        return this.store.select(selectorFn, props);
    };

    Object.defineProperty(fn, STORE_SERVICE_SELECTOR, {
        value: true
    });

    return <any> fn;
}

export function dispatch<A extends ActionCreator>(actionCreator: A): Dispatcher<A> {
    const fn = function(props: any) {
        return this.store.dispatch(actionCreator(props));
    };

    Object.defineProperty(fn, STORE_SERVICE_DISPATCHER, {
        value: true
    });

    return <any> fn;
}

export const observe = function<A extends ActionCreator, R extends ReturnType<A>, K extends keyof R, M extends R | R[K]>(
    actions: A[],
    customMapper?: (action: R) => M): () => Observable<M> {
    const fn = function() {
        return this.actions.pipe(
            ofType(...actions),
            map((a: any) => customMapper ? customMapper(a) : a)
        );
    };

    Object.defineProperty(fn, STORE_SERVICE_OBSERVER, {
        value: true
    });

    return <any> fn;
};
