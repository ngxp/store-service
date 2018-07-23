import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookListComponent } from './book-list.component';
import { BookStoreService } from 'src/app/shared/books/book-store.service';
import { provideStoreServiceMock, StoreServiceMock } from '@ngx-patterns/store-service/testing';
import { Book } from 'src/app/shared/books/book.model';
import { AppModule } from 'src/app/app.module';
import { BehaviorSubject } from '../../../../node_modules/rxjs';

describe('BookListComponent', () => {
    let component: BookListComponent;
    let fixture: ComponentFixture<BookListComponent>;
    let bookStoreService: StoreServiceMock<BookStoreService>;
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

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [AppModule],
            providers: [
                provideStoreServiceMock(BookStoreService)
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
        bookStoreService.getAllBooks().next(books);

        fixture.detectChanges();
        const length = (<Element>fixture.nativeElement).querySelectorAll('nss-book-list-entry').length;

        expect(books.length).toBe(length);
    });

    it('renders a non-loaded element initially', () => {
        const notLoadedEl = (<Element> fixture.nativeElement).querySelector('.not-loaded');
        const loadedEl = (<Element> fixture.nativeElement).querySelector('.loaded');

        expect(notLoadedEl).toBeTruthy();
        expect(loadedEl).toBeFalsy();
    });
    it('renders a non-loaded element initially', () => {
        (<any> bookStoreService.booksLoaded$).next(books);
        fixture.detectChanges();

        const notLoadedEl = (<Element> fixture.nativeElement).querySelector('.not-loaded');
        const loadedEl = (<Element> fixture.nativeElement).querySelector('.loaded');

        expect(loadedEl).toBeTruthy();
        expect(notLoadedEl).toBeFalsy();
    });
});
