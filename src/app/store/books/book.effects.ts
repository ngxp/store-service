import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';
import { BookService } from 'src/app/shared/books/book.service';
import { booksLoadedAction, loadBooksAction } from './books.actions';
@Injectable()
export class BookEffects {

    loadBooks = createEffect(() =>
        this.actions
            .pipe(
                ofType(loadBooksAction),
                switchMap(() => {
                    return this.bookService.loadBooks()
                        .pipe(
                            map(books => booksLoadedAction({ books }))
                        );
                })
            )
    );

    constructor(
        private actions: Actions,
        private bookService: BookService
    ) { }
}
