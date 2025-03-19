import { Component, Input } from '@angular/core';
import { Book } from '../../../shared/books/book.model';

@Component({
    selector: 'nss-book-list-entry',
    templateUrl: './book-list-entry.component.html',
    styleUrls: ['./book-list-entry.component.scss'],
    standalone: false
})
export class BookListEntryComponent {
    @Input()
    book: Book;
}
