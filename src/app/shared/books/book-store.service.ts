import { Injectable } from '@angular/core';
import { Selector, StoreServiceClass, Action } from 'ngrx-store-service';
import { Observable } from 'rxjs';
import { Book } from 'src/app/shared/books/book.model';
import { getBooks } from 'src/app/store/books/books.selectors';
import { State } from 'src/app/store/store.model';
import { AddBookAction, LoadBooksAction } from 'src/app/store/books/books.actions';

@Injectable()
export class BookStoreService extends StoreServiceClass<State> {

    @Selector(getBooks)
    getAllBooks: () => Observable<Book[]>;

    @Action(AddBookAction)
    addBook: (book: Book) => void;

    @Action(LoadBooksAction)
    loadBooks: () => void;
}
