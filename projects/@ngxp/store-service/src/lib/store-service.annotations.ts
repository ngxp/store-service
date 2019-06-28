import { ofType } from '@ngrx/effects';
import { ActionCreator, Creator } from '@ngrx/store';
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
            return this.store.select(selectorFn, props);
        };

        target[STORE_SERVICE_SELECTORS] = [
            ...target[STORE_SERVICE_SELECTORS],
            propertyKey
        ];
    };
}

export function Dispatch<T extends string, C extends Creator>(actionCreator: ActionCreator<T, C>): PropertyDecorator {
    return (target, propertyKey) => {
        if (!Array.isArray(target[STORE_SERVICE_ACTIONS])) {
            target[STORE_SERVICE_ACTIONS] = [];
        }

        target[propertyKey] = function (...args) {
            return this.store.dispatch(actionCreator(...args));
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
