import { ActionReducerMap } from '@ngrx/store';
import { State } from 'src/app/store/store.model';
import { reducer as bookReducer } from 'src/app/store/books/books.reducer';

export const reducers: ActionReducerMap<State> = {
    books: bookReducer
};
