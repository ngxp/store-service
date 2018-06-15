import { Book } from 'src/app/shared/books/book.model';
import { Action } from '@ngrx/store';

export interface State {
    books: Book[];
}

const initialState: State = {
    books: [
        {
            author: 'Me',
            title: 'About Me',
            year: 2018
        }
    ]
};

export function reducer(state = initialState, action: Action): State {
    return state;
}
