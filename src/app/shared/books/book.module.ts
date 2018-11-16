import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { BookStoreService } from 'src/app/shared/books/book-store.service';
import { BookService } from 'src/app/shared/books/book.service';
import { BookEffects } from '../../store/books/book.effects';
import { bookReducer } from '../../store/books/books.reducer';

@NgModule({
    imports: [
        CommonModule,
        StoreModule.forFeature('books', bookReducer),
        EffectsModule.forFeature([BookEffects])
    ],
    providers: [
        BookStoreService,
        BookService
    ],
})
export class BookModule { }
