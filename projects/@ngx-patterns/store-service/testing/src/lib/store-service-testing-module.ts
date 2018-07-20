import { ModuleWithProviders, NgModule } from '@angular/core';
import { Store } from '@ngrx/store';
import { MockStore } from './mock-store';

@NgModule({
    providers: [
        {
            provide: Store,
            useValue: new MockStore({})
        }
    ]
})
export class NgrxStoreServiceTestingModule {
    static withState(state: any): ModuleWithProviders {
        return {
            ngModule: NgrxStoreServiceTestingModule,
            providers: [
                {
                    provide: Store,
                    useValue: new MockStore(state)
                }
            ]
        };
    }
}


