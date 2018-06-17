import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { ActionTypes, BooksLoadedAction } from 'src/app/store/books/books.actions';
import { switchMap, map } from 'rxjs/operators';
import { BookService } from 'src/app/shared/books/book.service';
@Injectable()
export class BookEffects {

    @Effect()
    loadBooks = this.actions
        .ofType(ActionTypes.LoadBooks)
        .pipe(
            switchMap(() => {
                return this.bookService.loadBooks()
                    .pipe(
                        map(books => new BooksLoadedAction(books))
                    );
            })
        );

    constructor(
        private actions: Actions,
        private bookService: BookService
    ) { }
}
