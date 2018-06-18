import { async, TestBed } from '@angular/core/testing';
import { NgrxStoreServiceTestingModule, MockStore } from 'ngrx-store-service/testing';
import { BookStoreService } from 'src/app/shared/books/book-store.service';
import { BookModule } from 'src/app/shared/books/book.module';
import { State } from 'src/app/store/store.model';
import { getBooks } from 'src/app/store/books/books.selectors';
import { getBook } from 'src/test/books';
import { Book } from 'src/app/shared/books/book.model';
import { Store } from '@ngrx/store';
import { AddBookAction, ActionTypes } from 'src/app/store/books/books.actions';

describe('BookStoreService', () => {
    let bookStoreService: BookStoreService;
    let mockStore: MockStore;
    const state: State = {
        books: {
            books: [
                {
                    author: 'Author',
                    title: 'Title',
                    year: 2018
                }
            ]
        }
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                BookModule,
                NgrxStoreServiceTestingModule.withState(state)
            ]
        });
    }));

    beforeEach(() => {
        bookStoreService = TestBed.get(BookStoreService);
        mockStore = TestBed.get(Store);
    });

    it('executes the getBooks Selector', () => {
        bookStoreService.getAllBooks()
            .subscribe(books => {
                expect(books).toBe(getBooks()(state));
            });
    });
    it('dispatches a new AddBookAction', () => {
        const book: Book = getBook();
        bookStoreService.addBook(book);

        const action = <AddBookAction> mockStore.dispatchedActions[mockStore.dispatchedActions.length - 1];

        expect(action.type).toBe(ActionTypes.AddBook);
        expect(action.payload).toBe(book);
    });
    it('dispatches a new LoadBooksAction', () => {
        bookStoreService.loadBooks();

        const action = <AddBookAction> mockStore.dispatchedActions[mockStore.dispatchedActions.length - 1];

        expect(action.type).toBe(ActionTypes.LoadBooks);
    });
});
