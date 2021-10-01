import { Actions } from "@ngrx/effects";
import { Action, createAction, createSelector, props } from "@ngrx/store";
import { getMockStore, MockStore } from "@ngrx/store/testing";
import { createStoreServiceMock, StoreServiceMock } from "./store-service-mock";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { Dispatcher, Selector, StoreService } from "../../../src/lib/store-service";
import { select, dispatch, observe, Select, Dispatch, Observe } from "../../../src/lib/store-service.annotations";

describe('StoreServiceMock', () => {
    interface State {
        books: string[]
    }

    const loadBook = createAction('Load Book', props<{ bookName: string }>());
    const loadBooks = createAction('Load all Books');
    const booksLoaded = createAction('All books loaded', props<{ books: string[] }>());

    const selectBooks = createSelector<State, any, string[]>(
        s => s,
        state => state.books
    );

    const selectBookByName = createSelector<State, string, any, string>(
        s => s,
        (state: State, bookName: string) => state.books.find(book => book === bookName)
    );


    class StoreServiceToTest extends StoreService<State> {

        books = select(selectBooks);
        bookByName = select(selectBookByName);

        loadBook = dispatch(loadBook);
        loadBooks = dispatch(loadBooks);

        booksLoaded = observe([booksLoaded]);
        goodBooksLoaded = observe([booksLoaded], action => action.books.filter(bookName => bookName.startsWith('Angular')));

        @Select(selectBooks)
        booksOld: Selector<typeof selectBooks>

        @Select(selectBookByName)
        bookByNameOld: Selector<typeof selectBookByName>

        @Dispatch(loadBook)
        loadBookOld: Dispatcher<typeof loadBook>

        @Dispatch(loadBooks)
        loadBooksOld: Dispatcher<typeof loadBooks>

        @Observe([booksLoaded])
        booksLoadedOld: Observable<{ books: string[] }>

        @Observe([booksLoaded], action => action.books.filter(bookName => bookName.startsWith('Angular')))
        goodBooksLoadedOld: Observable<{ books: string[] }>

    }


    describe('selectors', () => {
        it('mocks all selectors to BehaviourSubjects', () => {
            const mockStore = createStoreServiceMock(StoreServiceToTest);

            expect(mockStore.books()).toBeInstanceOf(BehaviorSubject);
            expect(mockStore.bookByName()).toBeInstanceOf(BehaviorSubject);
            expect(mockStore.booksOld()).toBeInstanceOf(BehaviorSubject);
            expect(mockStore.bookByNameOld()).toBeInstanceOf(BehaviorSubject);
        });
        it('mocks selector with initial value', (done) => {
            const bookByName = 'Svelte';
            const mockStore = createStoreServiceMock(StoreServiceToTest, {
                bookByName
            });

            mockStore.bookByName().subscribe(book => {
                expect(book).toBe(bookByName);
                done()
            })
        });
        it('mocks old selector with initial value', (done) => {
            const bookByNameOld = 'Svelte';
            const mockStore = createStoreServiceMock(StoreServiceToTest, {
                bookByNameOld
            });

            mockStore.bookByNameOld().subscribe(book => {
                expect(book).toBe(bookByNameOld);
                done()
            })
        });
    })


    describe('observers', () => {
        it('mocks all observers to BehaviourSubjects', () => {
            const mockStore = createStoreServiceMock(StoreServiceToTest);

            expect(mockStore.booksLoaded()).toBeInstanceOf(BehaviorSubject);
            expect(mockStore.goodBooksLoaded()).toBeInstanceOf(BehaviorSubject);
            expect((<any> mockStore).booksLoadedOld()).toBeInstanceOf(BehaviorSubject);
            expect((<any> mockStore).goodBooksLoadedOld()).toBeInstanceOf(BehaviorSubject);
        });
        it('mocks observer with initial value', (done) => {
            const goodBooks = ['Angular'];
            const mockStore = createStoreServiceMock(StoreServiceToTest, {
                goodBooksLoaded: goodBooks
            });

            mockStore.goodBooksLoaded().subscribe(books => {
                expect(books).toBe(goodBooks);
                done()
            })
        });
        it('mocks old observer with initial value', (done) => {
            const goodBooks = ['Angular'];
            const mockStore = createStoreServiceMock(StoreServiceToTest, {
                goodBooksLoadedOld: goodBooks
            });

            (<any> mockStore).goodBooksLoadedOld().subscribe(books => {
                expect(books).toBe(goodBooks);
                done()
            })
        });
    })
})
