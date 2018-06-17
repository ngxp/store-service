import { State } from 'src/app/store/store.model';
import { getBooks } from 'src/test/books';

const state: State = {
    books: getBooks()
};

export function getState(): State {
    return { ...state };
}
