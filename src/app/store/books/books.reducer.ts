import { createReducer, on } from '@ngrx/store';
import { Book } from 'src/app/shared/books/book.model';
import { addBookAction, booksLoadedAction } from 'src/app/store/books/books.actions';

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
