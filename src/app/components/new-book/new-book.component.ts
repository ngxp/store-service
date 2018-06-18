import { Component } from '@angular/core';
import { Book } from 'src/app/shared/books/book.model';
import { BookStoreService } from 'src/app/shared/books/book-store.service';
import { AddBookAction } from 'src/app/store/books/books.actions';

@Component({
    selector: 'nss-new-book',
    templateUrl: './new-book.component.html',
    styleUrls: ['./new-book.component.scss']
})
export class NewBookComponent {

    book: Book = {
        author: null,
        title: null,
        year: null
    };

    constructor(
        private bookStore: BookStoreService
    ) {}

    addBook(event: Event) {
        event.preventDefault();
        this.bookStore.addBook(this.book);
        this.resetForm();
    }

    private resetForm() {
        this.book = {
            author: null,
            title: null,
            year: null
        };
    }

}
