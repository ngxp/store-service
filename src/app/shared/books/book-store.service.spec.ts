import { async, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockActions, MockStore, NgrxStoreServiceTestingModule } from '@ngxp/store-service/testing';
import { BookStoreService } from 'src/app/shared/books/book-store.service';
import { Book } from 'src/app/shared/books/book.model';
import { ActionTypes, AddBookAction, BooksLoadedAction } from 'src/app/store/books/books.actions';
import { getBook } from 'src/test/books';
import { BookState } from '../../store/books/books.reducer';
import { selectBook, selectBooks } from '../../store/books/books.selectors';

describe('BookStoreService', () => {
    let bookStoreService: BookStoreService;
    let mockStore: MockStore;
    let mockActions: MockActions;
    const state: { books: BookState } = {
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
                NgrxStoreServiceTestingModule.withState(state)
            ],
            providers: [
                BookStoreService
            ]
        });
    }));

    beforeEach(() => {
        bookStoreService = TestBed.get(BookStoreService);
        mockStore = TestBed.get(Store);
        mockActions = TestBed.get(MockActions);
    });

    it('executes the getBooks Selector', () => {
        bookStoreService.getAllBooks()
            .subscribe(books => {
                expect(books).toBe(selectBooks(state));
            });
    });
    it('executes the getBook Selector', () => {
        bookStoreService.getBook({ id: 0 })
            .subscribe(books => {
                expect(books).toBe(selectBook(state, { id: 0 }));
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
    it('filters the BooksLoadedActions in booksLoaded$', () => {
        bookStoreService.booksLoaded$.subscribe(
            books => {
                expect(books).toBe(expectedValue);
            }
        );
        const expectedValue: Book[] = [{
            author: 'Author',
            title: 'Title',
            year: 2018
        }];

        const action = new BooksLoadedAction(expectedValue);

        mockActions.next(action);
    });
});
