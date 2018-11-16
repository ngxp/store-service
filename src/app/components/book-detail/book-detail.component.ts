import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { BookStoreService } from '../../shared/books/book-store.service';
import { Book } from '../../shared/books/book.model';

@Component({
    selector: 'nss-book-detail',
    templateUrl: './book-detail.component.html',
    styleUrls: ['./book-detail.component.scss']
})
export class BookDetailComponent {

    book$: Observable<Book>;

    constructor(
        private activatedRoute: ActivatedRoute,
        private bookStoreService: BookStoreService
    ) {
        const bookId = this.activatedRoute.snapshot.params.bookId;
        this.book$ = this.bookStoreService.getBook({ id: bookId });
    }

}
