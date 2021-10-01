import { Action, createReducer, on } from '@ngrx/store';
import { Book } from '../../shared/books/book.model';
import { addBookAction, booksLoadedAction } from './books.actions';

export interface BookState {
    books: Book[];
}

const initialState: BookState = {
    books: []
};

export const bookReducer = createReducer(
    initialState,
    on(booksLoadedAction, (state, { books }) => ({
        ...state,
        books
    })),
    on(addBookAction, (state, { book }) => ({
        ...state,
        books: [
            ...state.books,
            book
        ]
    }))
);

export function reducer(state: BookState, action: Action): BookState {
    return bookReducer(state, action);
}
