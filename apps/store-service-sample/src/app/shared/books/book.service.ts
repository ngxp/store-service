import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Book } from './book.model';

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
