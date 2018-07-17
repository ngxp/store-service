# ngrx-store-service

Adds an abstraction layer between Angular components and the [@ngrx](https://github.com/ngrx/platform) store. This decouples the components from the store, selectors and actions and makes it easier to test components.

# How to use

## Before

> Component

```ts
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from 'src/app/shared/books/book.model';
// So many dependencies
import { Store } from '@ngrx/store'; 
import { AppState } from 'src/app/store/appstate.model';
import { getAllBooks } from 'src/app/store/books/books.selectors'; 
import { AddBookAction } from 'src/app/store/books/books.actions'; 
 
@Component({
    selector: 'nss-book-list',
    templateUrl: './book-list.component.html',
    styleUrls: ['./book-list.component.scss']
})
export class BookListComponent {

    books$: Observable<Book[]>;

    constructor(
        private store: Store<AppState>
    ) {
        this.books$ = this.store.select(getAllBooks());
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
import { BookStoreService } from 'src/app/shared/books/book-store.service'; // <- Reduced to just one dependency

@Component({
    selector: 'nss-book-list',
    templateUrl: './book-list.component.html',
    styleUrls: ['./book-list.component.scss']
})
export class BookListComponent {

    books$: Observable<Book[]>;

    constructor(
        private bookStore: BookStoreService // <- StoreService
    ) {
        this.books$ = this.bookStore.getAllBooks(); // <- Selector
    }

    addBook(book: Book) {
        this.bookStore.addBook(book); // <- Action
    }
}
```

> BookStoreService

```ts
import { Injectable } from '@angular/core';
import { Selector, StoreServiceClass, Action } from 'ngrx-store-service';
import { Observable } from 'rxjs';
import { Book } from 'src/app/shared/books/book.model';
import { getBooks } from 'src/app/store/books/books.selectors';
import { State } from 'src/app/store/store.model';
import { AddBookAction } from 'src/app/store/books/books.actions';

@Injectable()
export class BookStoreService extends StoreServiceClass<State> {

    @Selector(getBooks) // <- Selector
    getAllBooks: () => Observable<Book[]>;

    @Action(AddBookAction) // <- Action
    addBook: (book: Book) => void;
}
```

## StoreServiceClass

The `StoreService` Injectable class should extend the `StoreServiceClass<State>` class where `State` is your ngrx state model.

## Selectors

To use selectors you have to use the `@Selector(...)` decorator inside the `StoreService`. Add the selector function inside the `@Selector(...)` annotation:

```ts
// Define the selector function
export function selectAllBooks() {
    return state => state.books;
}

...

// Use the selector function inside the @Selector(...) annotation
@Selector(selectAllBooks)
allBooks: () => Observable<Book[]>;
```
The selector needs to be a __function__.

Be sure to use correct typing for the property inside the `StoreService`. If a parameter is needed inside the selector function it also has to be defined in the property typing.

```ts
export function selectBookById(id: number) {
                              ^^^^^^^^^^^^
    return state => state.books[id];
}

...

@Selector(selectBookById)
getBook: (id: number) => Observable<Book>;
         ^^^^^^^^^^^^
// The typing of the selector function and the property have to match!
```

## Actions

To dispatch actions a similar approach as mentioned in the selectors is used. Add a property with the `@Action(...)` annotation.

```ts
// Defined the Action as a class
export class LoadBooksAction implements Action {
    public type = '[Books] Load books';
}

...
// Use the Action class inside the @Action(...) annotation
@Action(LoadBooksAction)
loadBooks: () => void;
```

If the Action class expects parameters the typings on the property inside the `StoreService` have to match the class constructor.

```ts
export class AddBookAction implements Action {
    public type = '[Books] Add book';
    constructor(
        public payload: Book
               ^^^^^^^^^^^^^
    ) {}
}

...
@Action(AddBookAction)
addBook: (book: Book) => void;
         ^^^^^^^^^^^^
// The typing of the action constructor and the property have to match!
```

# Prerequisites

## Selectors need to be functions

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

Otherwise the typing of the StoreService Class won't work: `() => Observable<any>`

## Actions need to be classes

```ts
export class LoadAction implements Action {
    public type: 'Load action';
    constructor(
        public payload: any
    ) { }
}
```

The actions are instantiated using the `new` keyword.

# Testing

## Selectors
Testing is made easy inside your components. You don't need to import the whole `StoreModule.forRoot(...)`.

Simply provide the `StoreService` using the `provideStoreServiceMock` method. Then cast the store service instance using the `StoreServiceMock<T>` class to get the correct typings.


```ts
import { provideStoreServiceMock, StoreServiceMock } from 'ngrx-store-service/testing';
...
let bookStoreService: StoreServiceMock<BookStoreService>;
...
TestBed.configureTestingModule({
    imports: [AppModule],
    providers: [
        {
            provide: BookStoreService,
            useValue: provideStoreServiceMock(BookStoreService)
        }
    ]
})
...
bookStoreService = TestBed.get(BookStoreService);
```

The `StoreServiceMock` class replaces all selector function on the store service class with `BehaviourSubjects`. So now you can do the following:

```ts
bookStoreService.getAllBooks().next(newBooks);
```
To emit a new list of books to the components observable. Super easy testing.

## Actions

To test if a component dispatches actions import the `NgrxStoreServiceTestingModule` inside your Testing Module.

To get the injected Store instance use the `MockStore` class to get the correct typings.

```ts
import { NgrxStoreServiceTestingModule, MockStore } from 'ngrx-store-service/testing';
...
let mockStore: MockStore;
...
TestBed.configureTestingModule({
    imports: [
        NgrxStoreServiceTestingModule.withState({})
    ]
})
...
mockStore = TestBed.get(Store);
```

The `withState(...)` function is __mandatory__. You can use an object that you can later manipulate to get a desired state.

The `MockStore` class has a `dispatchedActions` property which is an array of dispatched actions. The last dispatched action is added at the end.

```ts
const lastDispatchedAction = mockStore.dispatchedActions[mockStore.dispatchedActions.length - 1];

// Or with lodash

const lastDispatchedAction = last(mockStore.dispatchedActions);
```

# Example

For and example of all this have a look at the Angular Project in [the src/app folder](src/app).

## Store Service

Have a look at the [BookStoreService](src/app/shared/books/book-store.service.ts)

## Testing

For examples on Component Tests please have look at the test for the [BookListComponent](src/app/components/book-list/book-list.component.spec.ts) and the [NewBookComponent](src/app/components/new-book/new-book.component.spec.ts)

Testing the `StoreService` is also very easy. For an example have a look at the [BookStoreService](src/app/shared/books/book-store.service.spec.ts)
