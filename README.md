# @ngx-patterns/store-service

Adds an abstraction layer between Angular components and the [@ngrx](https://github.com/ngrx/platform) store and effects. This decouples the components from the store, selectors, actions and effects and makes it easier to test components.

# Table of contents

* [Installation](#Installation)
* [Comparison](#Comparison)
    * [Before](#Before)
    * [After](#After)
* [Documentation](#Documentation)
    * [StoreService](#StoreService)
    * [Selectors](#Selectors)
    * [Actions](#Actions)
    * [Observers](#Observers)
        * [Observe multiple types](#Multiple-types)
        * [Use objects with type property](#Objects-with-type-property)
        * [Custom toPayload mapper](#Custom-toPayload-mapper)
* [Prerequisites](#Prerequisites)
    * [Selectors are functionss](#Selectors-are-functions)
    * [Actions are classes](#Actions-are-classes)
* [Testing](#Testing)
    * [Testing Selectors](#Testing-Selectors)
    * [Testing Actions](#Testing-Actions)
    * [Testing Observers](#Testing-Observers)
* [Examples](#Examples)
    * [Example Store Service](#Example-Store-Service)
    * [Example Tests](#Example-Tests)

# Installation

Get the latest version from NPM

```sh
npm install @ngx-patterns/store-service
```

# Comparison

## Before

> Component

```ts
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from 'src/app/shared/books/book.model';
// Tight coupling to ngrx, state model, selectors and actions
import { Store } from '@ngrx/store'; 
import { Actions, ofType } from '@ngrx/effects'; 
import { AppState } from 'src/app/store/appstate.model';
import { getAllBooks } from 'src/app/store/books/books.selectors'; 
import { ActionTypes, AddBookAction } from 'src/app/store/books/books.actions'; 
 
@Component({
    selector: 'nss-book-list',
    templateUrl: './book-list.component.html',
    styleUrls: ['./book-list.component.scss']
})
export class BookListComponent {

    books$: Observable<Book[]>;
    booksLoaded: boolean = false;

    constructor(
        private store: Store<AppState>
        private actions: Actions
    ) {
        this.books$ = this.store.select(getAllBooks());
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
    booksLoaded: boolean = false;

    constructor(
        private bookStore: BookStoreService // <- StoreService
    ) {
        this.books$ = this.bookStore.getAllBooks(); // <- Selector
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
import { Select, StoreService, Dispatch } from '@ngx-patterns/store-service';
import { Observable } from 'rxjs';
import { Book } from 'src/app/shared/books/book.model';
import { getBooks } from 'src/app/store/books/books.selectors';
import { State } from 'src/app/store/store.model';
import { AddBookAction } from 'src/app/store/books/books.actions';

@Injectable()
export class BookStoreService extends StoreService<State> {

    @Select(getBooks) // <- Selector
    getAllBooks: () => Observable<Book[]>;

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
import { StoreService } from '@ngx-patterns/store-service';
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
export function selectAllBooks() {
    return state => state.books;
}

...

// Use the selector function inside the @Select(...) annotation
@Select(selectAllBooks)
allBooks: () => Observable<Book[]>;
```
The selector needs to be a __function__.

Be sure to use correct typing for the property inside the `StoreService`. If a parameter is required inside the selector function it has to be required in the property typing.

```ts
export function selectBookById(id: number) {
                              ^^^^^^^^^^^^
    return state => state.books[id];
}

...

@Select(selectBookById)
getBook: (id: number) => Observable<Book>;
         ^^^^^^^^^^^^
// The typing of the selector function and the property have to match!
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

## Selectors are functions

```ts
// This will not work
const selector = state => state.property;
```

```ts
// This works
function selector() {
    return state => state.property;
}
```

If the selector is not a function, the typing of the StoreService Class won't work: `() => Observable<any>`

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
Testing your components and the StoreService is made easy. The `@ngx-patterns/store-service/testing` package provides helpful test-helpers to reduce testing friction.

## Testing Selectors

To test selectors you provide the `StoreService` using the `provideStoreServiceMock` method in the testing module of your component. Then cast the store service instance using the `StoreServiceMock<T>` class to get the correct typings.


```ts
import { provideStoreServiceMock, StoreServiceMock } from '@ngx-patterns/store-service/testing';
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

The `StoreServiceMock` class replaces all selector functions on the store service class with a `BehaviourSubject`. So now you can do the following to emit new values to the observables:

```ts
bookStoreService.getAllBooks().next(newBooks);
```

The `BehaviourSubject` is initialized with the value being `undefined`. If you want a custom initial value, the `provideStoreServiceMock` method offers an optional parameter. This is an object of key value pairs where the key is the name of the selector function, e.g. `getAllBooks`.

```ts
import { provideStoreServiceMock, StoreServiceMock } from '@ngx-patterns/store-service/testing';
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

The `BehaviourSubject` for `getAllBooks` is now initialized with an empty array instead of `undefined`.

## Testing Actions

To test if a component dispatches actions, you import the `NgrxStoreServiceTestingModule` inside the testing module.

To get the injected Store instance use the `MockStore` class for proper typings.

```ts
import { NgrxStoreServiceTestingModule, MockStore } from '@ngx-patterns/store-service/testing';
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
import { NgrxStoreServiceTestingModule} from '@ngx-patterns/store-service/testing';
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

To test the observers / actions stream, you import the `NgrxStoreServiceTestingModule` inside the testing module.

Get the `MockActions` instance from the `TestBed`

```ts
import { NgrxStoreServiceTestingModule, MockActions } from '@ngx-patterns/store-service/testing';
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
import { NgrxStoreServiceTestingModule, MockActions } from '@ngx-patterns/store-service/testing';
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
