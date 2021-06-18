import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideStoreServiceMock } from '@ngxp/store-service/testing';
import { BookStoreService } from '../../shared/books/book-store.service';
import { BookListEntryComponent } from '../book-list/book-list-entry/book-list-entry.component';
import { BookDetailComponent } from './book-detail.component';


describe('BookDetailComponent', () => {
    let component: BookDetailComponent;
    let fixture: ComponentFixture<BookDetailComponent>;

    const activatedRoute = {
        snapshot: {
            params: {
                bookId: '1'
            }
        }
    };

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                BookDetailComponent,
                BookListEntryComponent
            ],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: activatedRoute
                },
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
