import { getBook, getBooks } from 'apps/store-service-sample/src/test/books';
import { getState } from 'apps/store-service-sample/src/test/state';
import { Book } from '../../shared/books/book.model';
import { addBookAction, booksLoadedAction } from './books.actions';
import { bookReducer, BookState } from './books.reducer';

describe('booksReducer', () => {
    const state: BookState = getState().books;
    const books: Book[] = getBooks().books;
    const book: Book = getBook();

    it('returns the same state if action is not applicable', () => {
        const action = { type: null };
        expect(bookReducer(state, action)).toBe(state);
    });

    describe('booksLoadedAction', () => {
        it('saves the books', () => {
            const action = booksLoadedAction({ books });

            const newState = bookReducer(state, action);
            expect(newState.books).toEqual(books);
        });
    });
    describe('addBookAction', () => {
        it('saves the new book', () => {
            const action = addBookAction({ book });

            const newState = bookReducer(state, action);
            expect(newState.books).toContain(book);
        });
    });
});
