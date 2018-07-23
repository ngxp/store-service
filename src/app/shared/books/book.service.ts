import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Book } from 'src/app/shared/books/book.model';
import { delay } from 'rxjs/operators';

export const books: Book[] = [
    {
        author: 'Joost',
        title: 'Ngrx Store Service',
        year: 2018
    }
];

@Injectable()
export class BookService {
    loadBooks(): Observable<Book[]> {
        return of(books).pipe(
            delay(2000)
        );
    }
}
