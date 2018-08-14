import { ModuleWithProviders, NgModule } from '@angular/core';
import { Store } from '@ngrx/store';
import { MockActions } from './mock-actions';
import { MockStore } from './mock-store';
import { Actions } from '@ngrx/effects';

export function provideMockActions(mockActions: MockActions): Actions {
    return mockActions.actions();
}

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
                },
                {
                    provide: MockActions,
                    useValue: new MockActions()
                },
                {
                    provide: Actions,
                    useFactory: provideMockActions,
                    deps: [MockActions]
                }
            ]
        };
    }
}


