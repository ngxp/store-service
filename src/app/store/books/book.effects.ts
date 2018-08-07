import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';
import { BookService } from 'src/app/shared/books/book.service';
import { ActionTypes, BooksLoadedAction } from 'src/app/store/books/books.actions';
@Injectable()
export class BookEffects {

    @Effect()
    loadBooks = this.actions
        .pipe(
            ofType(ActionTypes.LoadBooks),
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
