import { createAction, props } from '@ngrx/store';
import { Book } from 'src/app/shared/books/book.model';

export const loadBooksAction = createAction('[Books] Load books');

export const booksLoadedAction = createAction(
    '[Books] Books loaded',
    props<{ books: Book[] }>()
);

export const addBookAction = createAction(
    '[Books] Add book',
    props<{ book: Book }>()
);
