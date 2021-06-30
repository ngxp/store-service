import { Injectable } from '@angular/core';
import { dispatch, observe, StoreService, select } from '@ngxp/store-service';
import { addBookAction, booksLoadedAction, loadBooksAction } from '../../store/books/books.actions';
import { BookState } from '../../store/books/books.reducer';
import { selectBook, selectBooks } from '../../store/books/books.selectors';


@Injectable()
export class BookStoreService extends StoreService<BookState> {

    getAllBooks = select(selectBooks);

    getBook = select(selectBook);

    addBook = dispatch(addBookAction);


    loadBooks= dispatch(loadBooksAction);

    booksLoaded$ = observe([booksLoadedAction], action => action.books)
}

