import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { BookStoreService } from 'src/app/shared/books/book-store.service';
import { Book } from 'src/app/shared/books/book.model';

@Component({
    selector: 'nss-book-list',
    templateUrl: './book-list.component.html',
    styleUrls: ['./book-list.component.scss']
})
export class BookListComponent {

    books$: Observable<Book[]>;

    constructor(
        private bookStore: BookStoreService
    ) {
        this.books$ = this.bookStore.getAllBooks();
    }
}
