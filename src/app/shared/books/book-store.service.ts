import { Injectable } from '@angular/core';
import { Selector } from 'ngrx-store-service';
import { StoreServiceClass } from 'projects/ngrx-store-service/src/lib/ngrx-store-service';
import { Observable } from 'rxjs';
import { Book } from 'src/app/shared/books/book.model';
import { getBooks } from 'src/app/store/books/books.selectors';
import { State } from 'src/app/store/store.model';

@Injectable()
export class BookStoreService extends StoreServiceClass<State> {

    @Selector(getBooks)
    getAllBooks: () => Observable<Book[]>;
}
