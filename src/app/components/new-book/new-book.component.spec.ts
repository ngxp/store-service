import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockStore, NgrxStoreServiceTestingModule } from 'ngrx-store-service/testing';
import { AppModule } from 'src/app/app.module';
import { ActionTypes, AddBookAction } from 'src/app/store/books/books.actions';
import { getBook } from 'src/test/books';
import { NewBookComponent } from './new-book.component';

describe('NewBookComponent', () => {
    let component: NewBookComponent;
    let fixture: ComponentFixture<NewBookComponent>;
    let mockStore: MockStore;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                AppModule,
                NgrxStoreServiceTestingModule.withState(null)
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NewBookComponent);
        mockStore = TestBed.get(Store);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('dispatches an AddBookAction onAddBook', () => {
        const book = getBook();
        component.book = book;
        component.addBook(new Event('submit'));

        const action = <AddBookAction> mockStore.dispatchedActions[mockStore.dispatchedActions.length - 1];
        expect(action.type).toBe(ActionTypes.AddBook);
        expect(action.payload).toBe(book);
    });
});
