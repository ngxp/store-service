import { Actions } from "@ngrx/effects";
import { Action, createAction, createSelector, props } from "@ngrx/store";
import { getMockStore, MockStore } from "@ngrx/store/testing";
import { hot } from "jest-marbles";
import { of, Subject } from "rxjs";
import { StoreService } from "./store-service";
import { dispatch, observe, select, STORE_SERVICE_ACTIONS, STORE_SERVICE_OBSERVERS, STORE_SERVICE_SELECTORS } from "./store-service.annotations";

describe('StoreService Functions', () => {
    interface State {
        books: string[]
    }
    const initialState: State = {
        books: ['Angular', 'React']
    }

    const loadBook = createAction('Load Book', props<{ bookName: string }>());
    const loadBooks = createAction('Load all Books');
    const booksLoaded = createAction('All books loaded', props<{ books: string[] }>());
    const booksLoadFailed = createAction('Books load failed', props<{ error: string }>());

    const selectBooks = createSelector<State,[any],string[]>(
        s => s,
        state => state.books
    );

    const selectBookByName = createSelector<State, string, any, string>(
        s => s,
        (state: State, bookName: string) => state.books.find(book => book === bookName)
    );

    const selectBookByNameWithFactory = (props: { name: string }) => createSelector<State,[any],string>(
        s => s,
        (state: State) => state.books.find(book => book === props.name)
    );

    let store: MockStore<State>;
    let actionsSubject: Subject<Action>;
    let actions: Actions;


    class StoreServiceToTest extends StoreService<any> {

        books = select(selectBooks);
        bookByName = select(selectBookByName);
        bookByNameWithFactory = select(selectBookByNameWithFactory);

        loadBook = dispatch(loadBook);
        loadBooks = dispatch(loadBooks);

        booksLoaded = observe([booksLoaded]);
        goodBooksLoaded = observe([booksLoaded], action => action.books.filter(bookName => bookName.startsWith('Angular')));
    }

    let testService: StoreServiceToTest;

    beforeEach(() => {
        store = getMockStore({
            initialState
        });
        actionsSubject = new Subject<Action>();
        actions = new Actions(actionsSubject)
        testService = new StoreServiceToTest(store, actions);
    })


    describe('selectors', () => {
        it('provides observable without props', () => {
            const expected = hot('a', { a: initialState.books });

            expect(testService.books()).toBeObservable(expected);
        });
        it('provides observable with props', () => {
            const title = 'Angular';
            const expected = hot('a', { a: title });

            expect(testService.bookByName(title)).toBeObservable(expected);
        });
        it('provides observable with invalid props', () => {
            const title = 'Invalid';
            const expected = hot('a', { a: undefined });

            expect(testService.bookByName(title)).toBeObservable(expected);
        });
        it('provides observable with props with factory', () => {
            const title = 'React';
            const expected = hot('a', { a: title });

            expect(testService.bookByNameWithFactory({ name: title })).toBeObservable(expected);
        });
        it('provides observable with invalid props with factory', () => {
            const title = 'Invalid';
            const expected = hot('a', { a: undefined });

            expect(testService.bookByNameWithFactory({ name: title })).toBeObservable(expected);
        });
        it('can be spied upon', (done) => {
            const overwrittenValue = 'overwrittenProperty';
            const bookByNameSpy = jest.spyOn(testService, 'bookByName').mockReturnValue(of(overwrittenValue));

            testService.bookByName('Angular')
                .subscribe(value => {
                    expect(bookByNameSpy).toHaveBeenCalled();
                    expect(value).toBe(overwrittenValue);
                    done();
                });
        });

        it('sets the internal STORE_SERVICE_SELECTORS variable', () => {
            expect(testService.books[STORE_SERVICE_SELECTORS]).toBe(true);
            expect(testService.bookByName[STORE_SERVICE_SELECTORS]).toBe(true);
            expect(testService.bookByNameWithFactory[STORE_SERVICE_SELECTORS]).toBe(true);
        });
    });

    describe('actions / dispatchers', () => {
        it('dispatches action without props', () => {
            const dispatchSpy = jest.spyOn(store, 'dispatch');
            const action = loadBooks();
            testService.loadBooks();
            expect(dispatchSpy).toHaveBeenCalledWith(action);
        });
        it('dispatches action with props', () => {
            const dispatchSpy = jest.spyOn(store, 'dispatch');
            const bookName = 'Vue';
            const action = loadBook({ bookName });
            testService.loadBook({ bookName });
            expect(dispatchSpy).toHaveBeenCalledWith(action);
        });
        it('can be spied upon', () => {
            const loadBookSpy = jest.spyOn(testService, 'loadBook');
            testService.loadBook({ bookName: 'Angular' });
            expect(loadBookSpy).toHaveBeenCalledWith({ bookName: 'Angular' });
        });
        it('sets the internal STORE_SERVICE_ACTIONS variable', () => {
            expect(testService.loadBooks[STORE_SERVICE_ACTIONS]).toBe(true);
            expect(testService.loadBook[STORE_SERVICE_ACTIONS]).toBe(true);
        });

    });


    describe('observers', () => {
        it('emits when the action got dispatched', (done) => {
            const books = ['Svelte', 'NextJS'];
            const action = booksLoaded({ books });

            testService.booksLoaded().subscribe(a => {
                expect(a).toEqual(action);
                done();
            });

            actionsSubject.next(action);
        });
        it('does not emit for other actions', () => {
            const action = booksLoadFailed({ error: 'Load failed' });

            testService.booksLoaded().subscribe(() => {
                fail('Should not emit');
            });

            actionsSubject.next(action);
        });
        it('emits with custom mapper', (done) => {
            const books = ['Svelte', 'NextJS', 'Angular'];
            const action = booksLoaded({ books });

            testService.goodBooksLoaded().subscribe(a => {
                expect(a).toEqual(['Angular']);
                done();
            });

            actionsSubject.next(action);
        });
        it('sets the internal STORE_SERVICE_OBSERVERS variable', () => {
            expect(testService.booksLoaded[STORE_SERVICE_OBSERVERS]).toBe(true);
        });

    });
})
