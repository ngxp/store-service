import { State } from 'src/app/store/books/books.reducer';
import * as faker from 'faker';
import { Book } from 'src/app/shared/books/book.model';

const books: State = {
    books: Array(20).fill(getBook())
};

export function getBook(): Book {
    return {
        author: faker.name.findName(),
        title: faker.commerce.productName(),
        year: faker.random.number({ min: 2000, max: 2018, precision: 10})
    };
}

export function getBooks(): State {
    return { ...books };
}
