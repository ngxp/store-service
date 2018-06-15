export const NGRX_STORE_SERVICE_storeVariableName = 'NGRX_STORE_SERVICE_storeVariableName';

export function StoreService(storeVariableName = 'store'): ClassDecorator {
    return (target) => {
        target.prototype[NGRX_STORE_SERVICE_storeVariableName] = storeVariableName;
    };
}

export function Selector(selectorFn: (...any) => (state: any) => any): PropertyDecorator {
    return (target, propertyKey) => {
        Object.defineProperty(target, propertyKey, {
            get: function () {
                return (...args) => {
                    return this[this.NGRX_STORE_SERVICE_storeVariableName].select(selectorFn(...args));
                };
            },
            set: function () { },
            configurable: true,
            enumerable: true
        });
    };
}
