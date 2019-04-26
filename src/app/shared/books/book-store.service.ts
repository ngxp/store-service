import { Injectable } from '@angular/core';
import { Dispatch, Observe, Select, StoreService } from '@ngxp/store-service';
import { Observable } from 'rxjs';
import { Book } from 'src/app/shared/books/book.model';
import { ActionTypes, AddBookAction, LoadBooksAction } from 'src/app/store/books/books.actions';
import { BookState } from '../../store/books/books.reducer';
import { selectBook, selectBooks } from '../../store/books/books.selectors';

@Injectable()
export class BookStoreService extends StoreService<BookState> {

    @Select(selectBooks)
    getAllBooks: () => Observable<Book[]>;

    @Select(selectBook)
    getBook: (props: { id: number }) => Observable<Book>;

    @Dispatch(AddBookAction)
    addBook: (book: Book) => void;

    @Dispatch(LoadBooksAction)
    loadBooks: () => void;

    @Observe([ActionTypes.BooksLoaded])
    booksLoaded$: Observable<Book[]>;
}
