import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookListComponent } from './book-list.component';
import { BookStoreService } from 'src/app/shared/books/book-store.service';
import { provideStoreServiceMock, StoreServiceMock } from 'ngrx-store-service/testing';
import { Book } from 'src/app/shared/books/book.model';
import { AppModule } from 'src/app/app.module';

describe('BookListComponent', () => {
    let component: BookListComponent;
    let fixture: ComponentFixture<BookListComponent>;
    let bookStoreService: StoreServiceMock<BookStoreService>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [AppModule],
            providers: [
                {
                    provide: BookStoreService,
                    useValue: provideStoreServiceMock(BookStoreService)
                }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BookListComponent);
        bookStoreService = TestBed.get(BookStoreService);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('renders no books if subject has not emitted', () => {
        const length = (<Element>fixture.nativeElement).querySelectorAll('nss-book-list-entry').length;

        expect(length).toBe(0);
    });

    it('renders n books', () => {
        const books: Book[] = [
            {
                title: 'Title',
                author: 'Author',
                year: 2018
            },
            {
                title: 'Title2',
                author: 'Author2',
                year: 2018
            }
        ];
        bookStoreService.getAllBooks().next(books);

        fixture.detectChanges();
        const length = (<Element>fixture.nativeElement).querySelectorAll('nss-book-list-entry').length;

        expect(books.length).toBe(length);

    });
});
