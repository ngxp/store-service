import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { getStoreServiceMock, provideStoreServiceMock, StoreServiceMock } from '@ngxp/store-service/testing';
import { BookStoreService } from '../../shared/books/book-store.service';
import { Book } from '../../shared/books/book.model';
import { BookListComponent } from './book-list.component';


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

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
            ],
            declarations: [BookListComponent],
            providers: [
                provideStoreServiceMock(BookStoreService)
            ],
            schemas: [
                NO_ERRORS_SCHEMA
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BookListComponent);
        bookStoreService = getStoreServiceMock(BookStoreService);
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
        bookStoreService.booksLoaded$().next(books);
        fixture.detectChanges();

        const notLoadedEl = (<Element> fixture.nativeElement).querySelector('.not-loaded');
        const loadedEl = (<Element> fixture.nativeElement).querySelector('.loaded');

        expect(loadedEl).toBeTruthy();
        expect(notLoadedEl).toBeFalsy();
    });
});
