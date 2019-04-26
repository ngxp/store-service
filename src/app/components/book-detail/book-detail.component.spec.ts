import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideStoreServiceMock } from '@ngxp/store-service/testing';
import { BookStoreService } from '../../shared/books/book-store.service';
import { BookListEntryComponent } from '../book-list/book-list-entry/book-list-entry.component';
import { BookDetailComponent } from './book-detail.component';


describe('BookDetailComponent', () => {
    let component: BookDetailComponent;
    let fixture: ComponentFixture<BookDetailComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule
            ],
            declarations: [
                BookDetailComponent,
                BookListEntryComponent
            ],
            providers: [
                provideStoreServiceMock(BookStoreService)
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BookDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
