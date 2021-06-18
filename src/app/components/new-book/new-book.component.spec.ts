import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideStoreServiceMock, StoreServiceMock, getStoreServiceMock } from '@ngxp/store-service/testing';
import { AppModule } from 'src/app/app.module';
import { BookStoreService } from 'src/app/shared/books/book-store.service';
import { getBook } from 'src/test/books';
import { NewBookComponent } from './new-book.component';

describe('NewBookComponent', () => {
    let component: NewBookComponent;
    let fixture: ComponentFixture<NewBookComponent>;
    let bookStoreService: StoreServiceMock<BookStoreService>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                AppModule
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
        const addBookSpy = spyOn(bookStoreService, 'addBook');

        component.addBook(new Event('submit'));

        expect(addBookSpy).toHaveBeenCalledWith({ book });
    });
});
