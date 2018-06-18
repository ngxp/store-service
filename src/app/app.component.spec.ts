import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { provideStoreServiceMock, StoreServiceMock } from 'ngrx-store-service/testing';
import { AppModule } from 'src/app/app.module';
import { BookStoreService } from 'src/app/shared/books/book-store.service';
import { AppComponent } from './app.component';

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
                {
                    provide: BookStoreService,
                    useValue: provideStoreServiceMock(BookStoreService)
                }
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
