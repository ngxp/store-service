import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { provideStoreServiceMock, StoreServiceMock } from '@ngxp/store-service/testing';
import { AppModule } from 'src/app/app.module';
import { BookStoreService } from 'src/app/shared/books/book-store.service';
import { getBook } from 'src/test/books';
import { NewBookComponent } from './new-book.component';

describe('NewBookComponent', () => {
    let component: NewBookComponent;
    let fixture: ComponentFixture<NewBookComponent>;
    let bookStoreService: StoreServiceMock<BookStoreService>;

    beforeEach(async(() => {
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
        bookStoreService = TestBed.get(BookStoreService);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('dispatches an AddBookAction onAddBook', () => {
        const book = getBook();
        component.book = book;
        const addBookSpy = spyOn(bookStoreService, 'addBook').and.callThrough();

        component.addBook(new Event('submit'));

        expect(addBookSpy).toHaveBeenCalledWith({ book });
    });
});
