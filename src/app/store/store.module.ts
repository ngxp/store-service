import { NgModule } from '@angular/core';
import { StoreModule as NgrxStoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers } from 'src/app/store/store.reducer';
import { effects } from 'src/app/store/store.effects';

@NgModule({
    imports: [
        NgrxStoreModule.forRoot(reducers),
        EffectsModule.forRoot(effects)
    ],
})
export class StoreModule { }
