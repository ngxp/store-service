import { Book } from 'src/app/shared/books/book.model';
import { AddBookAction, BooksLoadedAction } from 'src/app/store/books/books.actions';
import { getBook, getBooks } from 'src/test/books';
import { getState } from 'src/test/state';
import { bookReducer, BookState } from './books.reducer';

describe('booksReducer', () => {
    const state: BookState = getState().books;
    const books: Book[] = getBooks().books;
    const book: Book = getBook();

    it('returns the same state if action is not applicable', () => {
        const action = { type: null };
        expect(bookReducer(state, action)).toBe(state);
    });

    describe('BooksLoadedAction', () => {
        it('saves the books', () => {
            const action = new BooksLoadedAction(books);

            const newState = bookReducer(state, action);
            expect(newState.books).toEqual(books);
        });
    });
    describe('AddBookAction', () => {
        it('saves the new book', () => {
            const action = new AddBookAction(book);

            const newState = bookReducer(state, action);
            expect(newState.books).toContain(book);
        });
    });
});
