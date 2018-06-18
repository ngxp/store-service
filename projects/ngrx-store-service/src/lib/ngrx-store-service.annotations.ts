import { Store } from '@ngrx/store';

export function Selector(selector: (...any) => (state: any) => any): PropertyDecorator {
    return (target, propertyKey) => {
        let selectorFn = function() {
            const store: Store<any> = this.store;
            return (...args) => this.store.select(selector(...args));
        };

        Object.defineProperty(target, propertyKey, {
            get: function () {
                return selectorFn.apply(this);
            },
            set: function (value: () => any) {
                selectorFn = () => value;
            },
            enumerable: true,
            configurable: true
        });
    };
}
