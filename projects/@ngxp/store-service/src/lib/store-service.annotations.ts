import { Type } from '@angular/core';
import { ofType } from '@ngrx/effects';
import { select } from '@ngrx/store';
import { map } from 'rxjs/operators';

export const STORE_SERVICE_SELECTORS = '__STORE_SERVICE_SELECTORS';
export const STORE_SERVICE_ACTIONS = '__STORE_SERVICE_ACTIONS';
export const STORE_SERVICE_OBSERVERS = '__STORE_SERVICE_OBSERVERS';

type Selector<T, V> = (state: T) => V;
type SelectorWithProps<State, Props, Result> = (state: State, props: Props) => Result;

export function Select<S, P, R>(selectorFn: Selector<S, R> | SelectorWithProps<S, P, R>): PropertyDecorator {
    return (target, propertyKey) => {
        if (!Array.isArray(target[STORE_SERVICE_SELECTORS])) {
            target[STORE_SERVICE_SELECTORS] = [];
        }

        target[propertyKey] = function (props?: any) {
            return this.store.pipe(select(selectorFn, props));
        };

        target[STORE_SERVICE_SELECTORS] = [
            ...target[STORE_SERVICE_SELECTORS],
            propertyKey
        ];
    };
}

export function Dispatch<T>(actionType: Type<T>): PropertyDecorator {
    return (target, propertyKey) => {
        if (!Array.isArray(target[STORE_SERVICE_ACTIONS])) {
            target[STORE_SERVICE_ACTIONS] = [];
        }

        target[propertyKey] = function (...args) {
            return this.store.dispatch(new actionType(...args));
        };

        target[STORE_SERVICE_ACTIONS] = [
            ...target[STORE_SERVICE_ACTIONS],
            propertyKey
        ];
    };
}

export function Observe(
    actionTypes: (string | { type: string; [key: string]: any; })[],
    toPayload: (action) => any = (action: any) => action.payload
): PropertyDecorator {
    return (target, propertyKey) => {
        if (!Array.isArray(target[STORE_SERVICE_OBSERVERS])) {
            target[STORE_SERVICE_OBSERVERS] = [];
        }

        const types = actionTypes.map(actionType => {
            return typeof actionType === 'string' ? actionType : actionType.type;
        });

        Object.defineProperty(target, propertyKey, {
            get: function () {
                return this.actions.pipe(
                    ofType(...types),
                    map(toPayload)
                );
            },
            set: function () { },
            enumerable: true,
            configurable: true
        });

        target[STORE_SERVICE_OBSERVERS] = [
            ...target[STORE_SERVICE_OBSERVERS],
            propertyKey
        ];
    };
}
