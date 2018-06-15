import { Injectable } from '@angular/core';
import { StoreService, Selector } from 'ngrx-store-service';
import { State } from 'src/app/store/store.model';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Book } from 'src/app/shared/books/book.model';
import { getBooks } from 'src/app/store/books/books.selectors';

@Injectable()
@StoreService()
export class BookStoreService {

    constructor(
        private store: Store<State>
    ) { }

    @Selector(getBooks)
    getAllBooks: () => Observable<Book[]>;
}
