export function Selector(selectorFn: (...any) => (state: any) => any): PropertyDecorator {
    return (target, propertyKey) => {
        Object.defineProperty(target, propertyKey, {
            get: function () {
                return (...args) => {
                    return this.store.select(selectorFn(...args));
                };
            },
            set: function () { },
            configurable: true,
            enumerable: true
        });
    };
}
