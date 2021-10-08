import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { getStoreServiceMock, provideStoreServiceMock, StoreServiceMock } from '@ngxp/store-service/testing';
import { getBook } from 'apps/store-service-sample/src/test/books';
import { BookStoreService } from '../../shared/books/book-store.service';
import { NewBookComponent } from './new-book.component';

describe('NewBookComponent', () => {
    let component: NewBookComponent;
    let fixture: ComponentFixture<NewBookComponent>;
    let bookStoreService: StoreServiceMock<BookStoreService>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                FormsModule
            ],
            declarations: [
                NewBookComponent
            ],
            providers: [
                provideStoreServiceMock(BookStoreService)
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NewBookComponent);
        bookStoreService = getStoreServiceMock(BookStoreService);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('dispatches an AddBookAction onAddBook', () => {
        const book = getBook();
        component.book = book;
        const addBookSpy = jest.spyOn(bookStoreService, 'addBook');

        component.addBook(new Event('submit'));

        expect(addBookSpy).toHaveBeenCalledWith({ book });
    });
});
