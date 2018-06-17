import { Book } from 'src/app/shared/books/book.model';
import { Action } from '@ngrx/store';
import { ActionTypes, BooksLoadedAction, AddBookAction } from 'src/app/store/books/books.actions';

export interface State {
    books: Book[];
}

const initialState: State = {
    books: []
};

export function reducer(state: State = initialState, action: Action): State {
    switch (action.type) {
        case ActionTypes.BooksLoaded:
            const books = (<BooksLoadedAction>action).payload;
            return {
                ...state,
                books
            };
        case ActionTypes.AddBook:
            const book = (<AddBookAction> action).payload;
            return {
                ...state,
                books: [
                    ...state.books,
                    book
                ]
            };

    }
    return state;
}
