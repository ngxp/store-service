import { Action } from '@ngrx/store';
import { Book } from 'src/app/shared/books/book.model';

export enum ActionTypes {
    LoadBooks = '[Books] Load books',
    BooksLoaded = '[Books] Books loaded',
    AddBook = '[Books] Add book'
}

export class LoadBooksAction implements Action {
    public type = ActionTypes.LoadBooks;
}

export class BooksLoadedAction implements Action {
    public type = ActionTypes.BooksLoaded;

    constructor(
        public payload: Book[]
    ) {}
}

export class AddBookAction implements Action {
    public type = ActionTypes.AddBook;

    constructor(
        public payload: Book
    ) {}
}
