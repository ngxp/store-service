import { getBooks } from '../../../test/books';
import { selectBook, selectBooks } from './books.selectors';

describe('bookSelectors', () => {
    const books = getBooks();

    it('returns the books', () => {
        expect(selectBooks.projector(books)).toBe(books.books);
    });
    it('returns the book identified by index', () => {
        expect(selectBook.projector(books.books, { id: 0 })).toBe(books.books[0]);
    });
});
