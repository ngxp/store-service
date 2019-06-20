import { async, TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { BehaviorSubject } from 'rxjs';
import { BookStoreService } from 'src/app/shared/books/book-store.service';
import { Book } from 'src/app/shared/books/book.model';
import { getBook } from 'src/test/books';
import { addBookAction, booksLoadedAction, loadBooksAction } from '../../store/books/books.actions';
import { BookState } from '../../store/books/books.reducer';
import { selectBook, selectBooks } from '../../store/books/books.selectors';

describe('BookStoreService', () => {
    let bookStoreService: BookStoreService;
    let mockStore: MockStore<{ books: BookState }>;
    const mockActions = new BehaviorSubject(undefined);
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
            providers: [
                BookStoreService,
                provideMockStore({
                    initialState: state
                }),
                provideMockActions(mockActions)

            ]
        });
    }));

    beforeEach(() => {
        bookStoreService = TestBed.get(BookStoreService);
        mockStore = TestBed.get(Store);
    });

    it('executes the getBooks Selector', () => {
        const expected = cold('a', { a: selectBooks(state) });

        expect(bookStoreService.getAllBooks()).toBeObservable(expected);
    });
    it('executes the getBook Selector', () => {
        const expected = cold('a', { a: selectBook(state, { id: 0 }) });

        expect(bookStoreService.getBook({ id: 0 })).toBeObservable(expected);
    });
    it('dispatches a new AddBookAction', () => {
        const book: Book = getBook();
        bookStoreService.addBook({ book });

        const expected = cold('a', { a: addBookAction({ book }) });
        expect(mockStore.scannedActions$).toBeObservable(expected);
    });
    it('dispatches a new LoadBooksAction', () => {
        bookStoreService.loadBooks();

        const expected = cold('a', { a: loadBooksAction() });
        expect(mockStore.scannedActions$).toBeObservable(expected);
    });
    it('filters the BooksLoadedActions in booksLoaded$', () => {
        const expectedValue: Book[] = [{
            author: 'Author',
            title: 'Title',
            year: 2018
        }];

        const action = booksLoadedAction({ books: expectedValue });
        mockActions.next(action);

        const expected = cold('a', { a: action });
        expect(bookStoreService.booksLoaded$).toBeObservable(expected);
    });
});
