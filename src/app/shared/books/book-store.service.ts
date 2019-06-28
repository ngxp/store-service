import { Injectable } from '@angular/core';
import { Dispatch, Dispatcher, Observe, Select, Selector, StoreService } from '@ngxp/store-service';
import { Observable } from 'rxjs';
import { Book } from 'src/app/shared/books/book.model';
import { addBookAction, booksLoadedAction, loadBooksAction } from '../../store/books/books.actions';
import { BookState } from '../../store/books/books.reducer';
import { selectBook, selectBooks } from '../../store/books/books.selectors';

@Injectable()
export class BookStoreService extends StoreService<BookState> {

    @Select(selectBooks)
    getAllBooks: Selector<typeof selectBooks>;

    @Select(selectBook)
    getBook: Selector<typeof selectBook>;

    @Dispatch(addBookAction)
    addBook: Dispatcher<typeof addBookAction>;

    @Dispatch(loadBooksAction)
    loadBooks: Dispatcher<typeof loadBooksAction>;

    @Observe([booksLoadedAction], action => action.books)
    booksLoaded$: Observable<Book[]>;
}

