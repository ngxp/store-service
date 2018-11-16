import { Action } from '@ngrx/store';
import { Book } from 'src/app/shared/books/book.model';
import { ActionTypes, AddBookAction, BooksLoadedAction } from 'src/app/store/books/books.actions';

export interface BookState {
    books: Book[];
}

const initialState: BookState = {
    books: []
};

export function bookReducer(state: BookState = initialState, action: Action): BookState {
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
