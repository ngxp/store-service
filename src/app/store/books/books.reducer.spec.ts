import { State } from 'src/app/store/books/books.reducer';
import { getState } from 'src/test/state';
import { reducer } from 'src/app/store/books/books.reducer';
import { BooksLoadedAction, AddBookAction } from 'src/app/store/books/books.actions';
import { getBooks, getBook } from 'src/test/books';
import { Book } from 'src/app/shared/books/book.model';

describe('booksReducer', () => {
    const state: State = getState().books;
    const books: Book[] = getBooks().books;
    const book: Book = getBook();

    it('returns the same state if action is not applicable', () => {
        const action = { type: null };
        expect(reducer(state, action)).toBe(state);
    });

    describe('BooksLoadedAction', () => {
        it('saves the books', () => {
            const action = new BooksLoadedAction(books);

            const newState = reducer(state, action);
            expect(newState.books).toEqual(books);
        });
    });
    describe('AddBookAction', () => {
        it('saves the new book', () => {
            const action = new AddBookAction(book);

            const newState = reducer(state, action);
            expect(newState.books).toContain(book);
        });
    });
});
