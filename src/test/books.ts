import * as faker from 'faker';
import { Book } from 'src/app/shared/books/book.model';
import { BookState } from '../app/store/books/books.reducer';

const books: BookState = {
    books: Array(20).fill(getBook())
};

export function getBook(): Book {
    return {
        author: faker.name.findName(),
        title: faker.commerce.productName(),
        year: faker.random.number({ min: 2000, max: 2018, precision: 10})
    };
}

export function getBooks(): BookState {
    return { ...books };
}
