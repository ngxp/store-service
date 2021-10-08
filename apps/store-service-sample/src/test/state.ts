import { getBooks } from "./books";

const state: any = {
    books: getBooks()
};

export function getState(): any {
    return { ...state };
}
