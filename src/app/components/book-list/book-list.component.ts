import { Component, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { BookStoreService } from 'src/app/shared/books/book-store.service';
import { Book } from 'src/app/shared/books/book.model';
import { distinctUntilChanged, takeWhile, filter } from 'rxjs/operators';

@Component({
    selector: 'nss-book-list',
    templateUrl: './book-list.component.html',
    styleUrls: ['./book-list.component.scss']
})
export class BookListComponent implements OnDestroy {

    books$: Observable<Book[]>;

    loaded = false;
    alive = true;

    constructor(
        private bookStore: BookStoreService
    ) {
        this.books$ = this.bookStore.getAllBooks();
        this.bookStore.booksLoaded$().pipe(
            filter(val => Array.isArray(val)),
            distinctUntilChanged(),
            takeWhile(() => this.alive)
        )
        .subscribe(() => {
            this.loaded = true;
        });
    }

    ngOnDestroy() {
        this.alive = false;
    }
}
