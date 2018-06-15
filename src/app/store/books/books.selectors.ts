import { State } from 'src/app/store/store.model';

export function getBooks() {
    return (state: State) => {
        return state.books.books;
    };
}
