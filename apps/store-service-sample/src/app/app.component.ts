import { Component, OnInit } from '@angular/core';
import { BookStoreService } from './shared/books/book-store.service';

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
        this.bookStore.loadBooks();
    }
}
