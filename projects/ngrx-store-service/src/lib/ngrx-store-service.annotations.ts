import { Type } from '@angular/core';

export const NGRX_STORE_SERVICE_SELECTORS = 'NGRX_STORE_SERVICE_SELECTORS';
export const NGRX_STORE_SERVICE_ACTIONS = 'NGRX_STORE_SERVICE_ACTIONS';

export function Selector(selectorFn: (...any) => (state: any) => any): PropertyDecorator {
    return (target, propertyKey) => {
        if (!Array.isArray(target[NGRX_STORE_SERVICE_SELECTORS])) {
            target[NGRX_STORE_SERVICE_SELECTORS] = [];
        }

        target[propertyKey] = function (...args) {
            return this.store.select(selectorFn(...args));
        };

        target[NGRX_STORE_SERVICE_SELECTORS] = [
            ...target[NGRX_STORE_SERVICE_SELECTORS],
            propertyKey
        ];
    };
}

export function Action<T>(actionType: Type<T>): PropertyDecorator {
    return (target, propertyKey) => {
        if (!Array.isArray(target[NGRX_STORE_SERVICE_ACTIONS])) {
            target[NGRX_STORE_SERVICE_ACTIONS] = [];
        }

        target[propertyKey] = function (...args) {
            return this.store.dispatch(new actionType(...args));
        };

        target[NGRX_STORE_SERVICE_ACTIONS] = [
            ...target[NGRX_STORE_SERVICE_ACTIONS],
            propertyKey
        ];
    };
}
