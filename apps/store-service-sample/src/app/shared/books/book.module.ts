import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { BookEffects } from '../../store/books/book.effects';
import { reducer } from '../../store/books/books.reducer';
import { BookStoreService } from './book-store.service';
import { BookService } from './book.service';

@NgModule({
    imports: [
        CommonModule,
        StoreModule.forFeature('books', reducer),
        EffectsModule.forFeature([BookEffects])
    ],
    providers: [
        BookStoreService,
        BookService
    ],
})
export class BookModule { }
