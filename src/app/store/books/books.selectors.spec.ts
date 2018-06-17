import { State } from 'src/app/store/store.model';
import { getState } from 'src/test/state';
import { getBooks } from 'src/app/store/books/books.selectors';

describe('bookSelectors', () => {
    const state: State = getState();

    it('returns the books', () => {
        expect(getBooks()(state)).toBe(state.books.books);
    });
});
