# @ngxp/store-service

Adds an abstraction layer between Angular components and the [@ngrx](https://github.com/ngrx/platform) store and effects. This decouples the components from the store, selectors, actions and effects and makes it easier to test components.

# Table of contents

* [Installation](#installation)
* [Comparison](#comparison)
    * [Before](#before)
    * [After](#after)
* [Documentation](#documentation)
    * [StoreService](#storeservice)
    * [Selectors](#selectors)
    * [Actions](#actions)
    * [Observers](#observers)
        * [Observe multiple types](#multiple-types)
        * [Use objects with type property](#objects-with-type-property)
        * [Custom toPayload mapper](#custom-topayload-mapper)
* [Prerequisites](#prerequisites)
    * [Selectors are functions](#selectors-are-functions)
    * [Actions are classes](#actions-are-classes)
* [Testing](#testing)
    * [Testing Selectors](#testing-selectors)
    * [Testing Actions](#testing-actions)
    * [Testing Observers](#testing-observers)
        * [StoreServiceMock](#storeservicemock)
        * [MockActions](#mockactions)
* [Examples](#examples)
    * [Example Store Service](#example-store-service)
    * [Example Tests](#example-tests)

# Installation

Get the latest version from NPM 
> The current version requires Angular 6.1

```sh
npm install @ngxp/store-service
```

> If you use Angular 6.0 please use version 3.0.0

```sh
npm install @ngxp/store-service@3.0.0
```

# Comparison
![Dependency diagram comparison](docs/diagram.png)

## Before

> Component

```ts
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from 'src/app/shared/books/book.model';
// Tight coupling to ngrx, state model, selectors and actions
import { Store, select } from '@ngrx/store'; 
import { Actions, ofType } from '@ngrx/effects'; 
import { AppState } from 'src/app/store/appstate.model';
import { getAllBooks, getBook } from 'src/app/store/books/books.selectors'; 
import { ActionTypes, AddBookAction } from 'src/app/store/books/books.actions'; 
 
@Component({
    selector: 'nss-book-list',
    templateUrl: './book-list.component.html',
    styleUrls: ['./book-list.component.scss']
})
export class BookListComponent {

    books$: Observable<Book[]>;
    book$: Observable<Book>;
    booksLoaded: boolean = false;

    constructor(
        private store: Store<AppState>
        private actions: Actions
    ) {
        this.books$ = this.store.pipe(select(getAllBooks));
        this.book$ = this.store.pipe(select(getBook, { id: 0 }));
        this.actions
            .pipe(
                ofType(ActionTypes.BooksLoaded),
                map(() => this.loaded = true)
            )
            .suscribe();
    }

    addBook(book: Book) {
        this.store.dispatch(new AddBookAction(book));
    }
}
```

## After

> Component

```ts
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from 'src/app/shared/books/book.model';
import { BookStoreService } from 'src/app/shared/books/book-store.service'; 
// Reduced to just one dependency. Loose coupling

@Component({
    selector: 'nss-book-list',
    templateUrl: './book-list.component.html',
    styleUrls: ['./book-list.component.scss']
})
export class BookListComponent {

    books$: Observable<Book[]>;
    book$: Observable<Book>;
    booksLoaded: boolean = false;

    constructor(
        private bookStore: BookStoreService // <- StoreService
    ) {
        this.books$ = this.bookStore.getAllBooks(); // <- Selector
        this.book$ = this.bookStore.getBook({ id: 0 }); // <- Selector
        this.bookStore.booksLoaded$ // <-- Observer / Action stream of type
            .pipe(
                map(() => this.loaded = true)
            )
            .subscribe();
    }

    addBook(book: Book) {
        this.bookStore.addBook(book); // <- Action
    }
}
```

> BookStoreService

```ts
import { Injectable } from '@angular/core';
import { Select, StoreService, Dispatch } from '@ngxp/store-service';
import { Observable } from 'rxjs';
import { Book } from 'src/app/shared/books/book.model';
import { getBooks } from 'src/app/store/books/books.selectors';
import { State } from 'src/app/store/store.model';
import { AddBookAction } from 'src/app/store/books/books.actions';

@Injectable()
export class BookStoreService extends StoreService<State> {

    @Select(getBooks) // <- Selector
    getAllBooks: () => Observable<Book[]>;

    @Select(getBook) // <- Selector
    getBook: (props: { id: number }) => Observable<Book>;

    @Dispatch(AddBookAction) // <- Action
    addBook: (book: Book) => void;

    @Observe([Actiontypes.BooksLoaded])
    booksLoaded$: Observable<Book[]>; // <- Observer / Action stream
}
```


# Documentation

## StoreService

The `BookStoreService` Injectable class has to extend the `StoreService<State>` class where `State` is your ngrx state model.

```ts
import { StoreService } from '@ngxp/store-service';
import { AppState } from 'app/store/state.model';

@Injectable()
export class BookStoreService extends StoreService<AppState> {
    ...
}
```

## Selectors

To use selectors you add the `@Select(...)` decorator inside the `StoreService`. Provide the selector function inside the `@Select(...)` annotation:

```ts
// Define the selector function
export const selectAllBooks = createSelector(
    (state: State) => state.books;
};

//Or with props
export const selectBook = createSelector(
    (state: State, props: { id: number }) => state.books[id];
};
...

// Use the selector function inside the @Select(...) annotation
@Select(selectAllBooks)
allBooks: () => Observable<Book[]>;

@Select(selectBook)
book: (props: { id: number }) => Observable<Book>;
```
Be sure to use correct typing for the property inside the `StoreService`. If you want to use props inside the selector function they have to be required in the property typing.

```ts
export const selectBook = createSelector(
    (state: State, props: { id: number }) => state.books[id];
                   ^^^^^^^^^^^^^^^^^^^^^^  
};

...

@Select(selectBookById)
getBook: (props: { id: number }) => Observable<Book>;
         ^^^^^^^^^^^^^^^^^^^^^^
// The typing of the props parameters have to match!
```

## Actions

To dispatch actions add a property with the `@Dispatch(...)` annotation.

```ts
// Defined the Action as a class
export class LoadBooksAction implements Action {
    public type = '[Books] Load books';
}

...
// Use the Action class inside the @Action(...) annotation
@Dispatch(LoadBooksAction)
loadBooks: () => void;
```

If the Action class expects parameters, the typings on the property inside the `StoreService` have to match the class constructor. Actions are instantiated using the `new` keyword.

```ts
export class AddBookAction implements Action {
    public type = '[Books] Add book';
    constructor(
        public payload: Book
               ^^^^^^^^^^^^^
    ) {}
}

...
@Dispatch(AddBookAction)
addBook: (book: Book) => void;
         ^^^^^^^^^^^^
// The typing of the action constructor and the property have to match!
```

## Observers

Observers are a way to listen for specific action types on the `Actions` stream from [@ngrx/effects](https://github.com/ngrx/platform/blob/master/docs/effects/README.md).

```ts
@Observe([Actiontypes.BooksLoaded])
booksLoaded$: Observable<Book[]>;
```

It will automatically map the action to it's `payload` property but this can be changed. 
The `@Observe(...)` decorator wraps the following functionality:

```ts
this.actions.pipe(
    ofType(ActionTypes.BooksLoaded),
    map(action => action.payload)
)
```

### Multiple types
You can provide multiple types, just like in the `ofType(...)` pipe.

```ts
@Observe([Actiontypes.BooksLoaded, Actiontypes.BookLoadFailed])
booksLoaded$: Observable<Book[] | string>;
```

### Objects with type property
Objects with a `type` property are also valid.

```ts
const action = { type: 'booksLoaded' };
...
@Observe([action])
booksLoaded$: Observable<Book[]>;
```

### Custom toPayload mapper
The `@Observe(...)` decorator has an additional parameter to provide a custom `toPayload` mapping function.
Initially this will be:
```ts
action => action.payload
```

To use a custom mapper, provide it as second argument in the `@Observe(...)` annotation.

```ts
export const toData = action => action.data;

...
@Observe([ActionTypes.DataLoaded], toData)
dataLoaded$: Observable<Data>;
```
  
# Prerequisites

## Use props for parameters in selectors

The `StoreService` uses the suggested way of passing props to selectors as defined by the NgRx team.
So you need to create your selectors accordingly.


```ts
export const selectoFn = createSelector(
    selectFeature,
    (state: FeatureState, props: { propA: number, propB: string }) => { ... }
)

this.store.pipe(select(selectorFn, { propA: 0, propB: 'a'}))
```

## Actions are classes

```ts
// This will not work
export function LoadAction(payload: any) {
    return {
        type: 'Load action',
        payload
    };
}
```
```ts
// This works
export class LoadAction implements Action {
    public type: 'Load action';
    constructor(
        public payload: any
    ) { }
}
```
This is mandatory because the actions are instantiated using the `new` keyword.

# Testing
Testing your components and the StoreService is made easy. The `@ngxp/store-service/testing` package provides helpful test-helpers to reduce testing friction.

## Testing Selectors

To test selectors you provide the `StoreService` using the `provideStoreServiceMock` method in the testing module of your component. Then cast the store service instance using the `StoreServiceMock<T>` class to get the correct typings.


```ts
import { provideStoreServiceMock, StoreServiceMock } from '@ngxp/store-service/testing';
...
let bookStoreService: StoreServiceMock<BookStoreService>;
...
TestBed.configureTestingModule({
    imports: [AppModule],
    providers: [
        provideStoreServiceMock(BookStoreService)
    ]
})
...
bookStoreService = TestBed.get(BookStoreService);
```

The `StoreServiceMock` class replaces all selector functions on the store service class with a `BehaviorSubject`. So now you can do the following to emit new values to the observables:

```ts
bookStoreService.getAllBooks().next(newBooks);
```

The `BehaviorSubject` is initialized with the value being `undefined`. If you want a custom initial value, the `provideStoreServiceMock` method offers an optional parameter. This is an object of key value pairs where the key is the name of the selector function, e.g. `getAllBooks`.

```ts
import { provideStoreServiceMock, StoreServiceMock } from '@ngxp/store-service/testing';
...
let bookStoreService: StoreServiceMock<BookStoreService>;
...
TestBed.configureTestingModule({
    imports: [AppModule],
    providers: [
        provideStoreServiceMock(BookStoreService, {
            getAllBooks: []
        })
    ]
})
...
bookStoreService = TestBed.get(BookStoreService);
```

The `BehaviorSubject` for `getAllBooks` is now initialized with an empty array instead of `undefined`.

## Testing Actions

To test if a component dispatches actions, you import the `NgrxStoreServiceTestingModule` inside the testing module.

To get the injected Store instance use the `MockStore` class for proper typings.

```ts
import { NgrxStoreServiceTestingModule, MockStore } from '@ngxp/store-service/testing';
...
let mockStore: MockStore;
...
TestBed.configureTestingModule({
    imports: [
        NgrxStoreServiceTestingModule
    ]
})
...
mockStore = TestBed.get(Store);
```

Optionally use the `withState(...)` function on the `NgrxStoreServiceTestingModule` to provide an object that should be used as the state.

```ts
import { NgrxStoreServiceTestingModule} from '@ngxp/store-service/testing';
...
const state = {
    books: []
}
...
TestBed.configureTestingModule({
    imports: [
        NgrxStoreServiceTestingModule.withState(state)
    ]
})
```

The `MockStore` class has a `dispatchedActions` property which is an array of all dispatched actions. The last dispatched action is appended at the end.

```ts
const lastDispatchedAction = mockStore.dispatchedActions[mockStore.dispatchedActions.length - 1];

// Or with lodash

const lastDispatchedAction = last(mockStore.dispatchedActions);
```

## Testing Observers

There are two different ways to test Observers depending on what you want to test. You can either use the `StoreServiceMock` or the `MockActions`. The `StoreServiceMock` replaces all Observers inside the `StoreService` with a `BehaviorSubject`. This should be used for component tests. The `MockActions` provide a custom `Actions` subject you can emit new actions to. This should be used to test the `StoreService` itself.

### StoreServiceMock

To test observers inside components you provide the `StoreService` using the `provideStoreServiceMock` method in the testing module of your component. Then cast the store service instance using the `StoreServiceMock<T>` class to get the correct typings.


```ts
import { provideStoreServiceMock, StoreServiceMock } from '@ngxp/store-service/testing';
...
let bookStoreService: StoreServiceMock<BookStoreService>;
...
TestBed.configureTestingModule({
    imports: [AppModule],
    providers: [
        provideStoreServiceMock(BookStoreService)
    ]
})
...
bookStoreService = TestBed.get(BookStoreService);
```

The `StoreServiceMock` class replaces all observer properties on the store service class with a `BehaviorSubject`. So now you can do the following to emit new values to the subscribers:

```ts
bookStoreService.booksLoaded$.next(true);
```

The `BehaviorSubject` is initialized with the value being `undefined`. If you want a custom initial value, the `provideStoreServiceMock` method offers an optional parameter. This is an object of key value pairs where the key is the name of the observer property, e.g. `booksLoaded$`.

```ts
import { provideStoreServiceMock, StoreServiceMock } from '@ngxp/store-service/testing';
...
let bookStoreService: StoreServiceMock<BookStoreService>;
...
TestBed.configureTestingModule({
    imports: [AppModule],
    providers: [
        provideStoreServiceMock(BookStoreService, {
            booksLoaded$: false
        })
    ]
})
...
bookStoreService = TestBed.get(BookStoreService);
```

The `BehaviorSubject` for `booksLoaded$` is now initialized with `false` instead of `undefined`.


### MockActions

To test the observers / actions stream, you import the `NgrxStoreServiceTestingModule` inside the testing module.

Get the `MockActions` instance from the `TestBed`

```ts
import { NgrxStoreServiceTestingModule, MockActions } from '@ngxp/store-service/testing';
...
let mockActions: MockActions;
...
TestBed.configureTestingModule({
    imports: [
        NgrxStoreServiceTestingModule
    ]
})
...
mockActions = TestBed.get(MockActions);
```

The `MockActions` class provides a `next(...)` function which will emit a new value to the `Actions` stream from @ngrx/effects.
This way you can emit new actions to the stream.

Here is an example on how to test this using the `MockActions` class.

```ts
import { NgrxStoreServiceTestingModule, MockActions } from '@ngxp/store-service/testing';
...
let mockActions: MockActions;
...
TestBed.configureTestingModule({
    imports: [
        NgrxStoreServiceTestingModule
    ]
})
...
mockActions = TestBed.get(MockActions);
...
it('test', () => {
    const expectedValue = [ { author: 'Author', title: 'Title', year: 2018 } ];
    storeService.booksLoaded$.subscribe(
        books => {
            expect(books).toBe(expectedValue);
        }
    );
    const action = new BooksLoadedAction(expectedValue);
    mockActions.next(action)
})
```

# Examples

For detailed examples of all this have a look at the Angular Project in [the src/app folder](src/app).

## Example Store Service

Have a look at the [BookStoreService](src/app/shared/books/book-store.service.ts)

## Example Tests

For examples on Component Tests please have look at the test for the [BookListComponent](src/app/components/book-list/book-list.component.spec.ts) and the [NewBookComponent](src/app/components/new-book/new-book.component.spec.ts)

Testing the `StoreService` is also very easy. For an example have a look at the [BookStoreService](src/app/shared/books/book-store.service.spec.ts)
