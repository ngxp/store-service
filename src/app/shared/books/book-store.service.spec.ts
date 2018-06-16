import { async, TestBed } from '@angular/core/testing';
import { NgrxStoreServiceTestingModule } from 'ngrx-store-service/testing';
import { BookStoreService } from 'src/app/shared/books/book-store.service';
import { BookModule } from 'src/app/shared/books/book.module';
import { State } from 'src/app/store/store.model';
import { getBooks } from 'src/app/store/books/books.selectors';

describe('BookStoreService', () => {
    let bookStoreService: BookStoreService;
    const state: State = {
        books: {
            books: [
                {
                    author: 'Author',
                    title: 'Title',
                    year: 2018
                }
            ]
        }
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                BookModule,
                NgrxStoreServiceTestingModule.withState(state)
            ]
        });
    }));

    beforeEach(() => {
        bookStoreService = TestBed.get(BookStoreService);
    });

    it('executes the getBooks Selector', () => {
        bookStoreService.getAllBooks()
            .subscribe(books => {
                expect(books).toBe(getBooks()(state));
            });
    });
});
