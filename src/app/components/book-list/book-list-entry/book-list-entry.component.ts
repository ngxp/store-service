import { Component, Input } from '@angular/core';
import { Book } from 'src/app/shared/books/book.model';

@Component({
    selector: 'nss-book-list-entry',
    templateUrl: './book-list-entry.component.html',
    styleUrls: ['./book-list-entry.component.scss']
})
export class BookListEntryComponent {
    @Input()
    book: Book;
}
