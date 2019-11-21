import { ofType } from '@ngrx/effects';
import { ActionCreator, Creator, Action } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { Type } from '@angular/core';

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
            return this.store.select(selectorFn, props);
        };

        target[STORE_SERVICE_SELECTORS] = [
            ...target[STORE_SERVICE_SELECTORS],
            propertyKey
        ];
    };
}

export function Dispatch<T extends string, C extends Creator, A extends Action>(
    actionCreator: ActionCreator<T, C> | Type<A>
): PropertyDecorator {
    return (target, propertyKey) => {
        if (!Array.isArray(target[STORE_SERVICE_ACTIONS])) {
            target[STORE_SERVICE_ACTIONS] = [];
        }

        target[propertyKey] = function (...args) {
            if (actionCreator.prototype && actionCreator.prototype.constructor) {
                return this.store.dispatch(new (<any> actionCreator)(...args));
            } else {
                return this.store.dispatch((<ActionCreator<T, C>>actionCreator)(...args));
            }
        };

        target[STORE_SERVICE_ACTIONS] = [
            ...target[STORE_SERVICE_ACTIONS],
            propertyKey
        ];
    };
}

export function Observe(
    actions: (string | ActionCreator)[],
    customMapper: (action) => any = (action: any) => action
): PropertyDecorator {
    return (target, propertyKey) => {
        if (!Array.isArray(target[STORE_SERVICE_OBSERVERS])) {
            target[STORE_SERVICE_OBSERVERS] = [];
        }

        const types = actions.map(actionType => {
            return typeof actionType === 'string' ? actionType : actionType.type;
        });

        Object.defineProperty(target, propertyKey, {
            get: function () {
                return this.actions.pipe(
                    ofType(...types),
                    map(customMapper)
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
