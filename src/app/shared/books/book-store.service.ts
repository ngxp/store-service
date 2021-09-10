import { Injectable } from '@angular/core';
import { dispatch, observe, StoreService, select, Select, Selector } from '@ngxp/store-service';
import { addBookAction, booksLoadedAction, loadBooksAction } from '../../store/books/books.actions';
import { BookState } from '../../store/books/books.reducer';
import { selectBook, selectBookById, selectBooks } from '../../store/books/books.selectors';


@Injectable()
export class BookStoreService extends StoreService<BookState> {

    getAllBooks = select(selectBooks);

    getBookById = select(selectBookById);

    addBook = dispatch(addBookAction);


    loadBooks= dispatch(loadBooksAction);

    booksLoaded$ = observe([booksLoadedAction], action => action.books)
}

