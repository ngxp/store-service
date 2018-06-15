import { NgModule } from '@angular/core';
import { StoreModule as NgrxStoreModule } from '@ngrx/store';
import { reducers } from 'src/app/store/store.reducer';

@NgModule({
    imports: [
        NgrxStoreModule.forRoot(reducers)
    ],
})
export class StoreModule { }
