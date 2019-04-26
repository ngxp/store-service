import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Book } from '../../shared/books/book.model';
import { BookState } from './books.reducer';

export const selectBooksFeature = createFeatureSelector<{ books: BookState }, BookState>('books');

export const selectBooks = createSelector(
    selectBooksFeature,
    booksState => booksState.books
);
export const selectBook = createSelector(
    selectBooks,
    (books: Book[], props: { id: number }) => books[props.id]
);
