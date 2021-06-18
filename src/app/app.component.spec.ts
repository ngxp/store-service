import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { getStoreServiceMock, provideStoreServiceMock, StoreServiceMock } from '@ngxp/store-service/testing';
import { AppComponent } from 'src/app/app.component';
import { BookStoreService } from 'src/app/shared/books/book-store.service';

describe('AppComponent', () => {
    let fixture: ComponentFixture<AppComponent>;
    let component: AppComponent;
    let bookStoreService: StoreServiceMock<BookStoreService>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent,
            ],
            providers: [
                provideStoreServiceMock(BookStoreService)
            ],
            schemas: [
                NO_ERRORS_SCHEMA
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AppComponent);
        bookStoreService = getStoreServiceMock(BookStoreService);
        component = fixture.componentInstance;
        debugger;
        fixture.detectChanges();
    });

    it('should create the app', waitForAsync(() => {
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));

    it('loads books on init', () => {
        const loadBooksSpy = spyOn(bookStoreService, 'loadBooks');

        component.ngOnInit();
        expect(loadBooksSpy).toHaveBeenCalled();
    });
});
