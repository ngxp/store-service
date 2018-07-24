import { Injectable } from '@angular/core';
import { Select, StoreService, Dispatch, Observe } from '@ngx-patterns/store-service';
import { Observable } from 'rxjs';
import { Book } from 'src/app/shared/books/book.model';
import { getBooks } from 'src/app/store/books/books.selectors';
import { State } from 'src/app/store/store.model';
import { AddBookAction, LoadBooksAction, ActionTypes } from 'src/app/store/books/books.actions';

@Injectable()
export class BookStoreService extends StoreService<State> {

    @Select(getBooks)
    getAllBooks: () => Observable<Book[]>;

    @Dispatch(AddBookAction)
    addBook: (book: Book) => void;

    @Dispatch(LoadBooksAction)
    loadBooks: () => void;

    @Observe([ActionTypes.BooksLoaded])
    booksLoaded$: Observable<Book[]>;
}
