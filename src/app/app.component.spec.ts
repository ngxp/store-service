import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { provideStoreServiceMock, StoreServiceMock } from '@ngx-patterns/store-service/testing';
import { AppComponent } from 'src/app/app.component';
import { AppModule } from 'src/app/app.module';
import { BookStoreService } from 'src/app/shared/books/book-store.service';

describe('AppComponent', () => {
    let fixture: ComponentFixture<AppComponent>;
    let component: AppComponent;
    let bookStoreService: StoreServiceMock<BookStoreService>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                AppModule
            ],
            providers: [
                provideStoreServiceMock(BookStoreService)
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AppComponent);
        bookStoreService = TestBed.get(BookStoreService);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the app', async(() => {
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));

    it('loads books on init', () => {
        const loadBooksSpy = spyOn(bookStoreService, 'loadBooks');

        component.ngOnInit();
        expect(loadBooksSpy).toHaveBeenCalled();
    });
});
