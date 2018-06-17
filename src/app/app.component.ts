import { Component, OnInit } from '@angular/core';
import { BookStoreService } from 'src/app/shared/books/book-store.service';
import { LoadBooksAction } from 'src/app/store/books/books.actions';

@Component({
    selector: 'nss-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    constructor(
        private bookStore: BookStoreService
    ) {}

    ngOnInit() {
        this.bookStore.dispatch(new LoadBooksAction());
    }
}
