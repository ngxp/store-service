import { getBooks } from 'src/test/books';

const state: any = {
    books: getBooks()
};

export function getState(): any {
    return { ...state };
}
