# ngrx-store-service

Adds an abstraction layer between Angular components and the [@ngrx](https://github.com/ngrx/platform) store. This decouples the components from the store, selectors and actions and makes it easier to test components.

# How to use

## Before

> Component

```ts
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from 'src/app/shared/books/book.model';
import { AppState } from 'src/app/store/appstate.model'; // So
import { getAllBooks } from 'src/app/store/books/books.selectors'; // many
import { AddBookAction } from 'src/app/store/books/books.actions'; // dependencies
 
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
import { BookStoreService } from 'src/app/shared/books/book-store.service';
import { Book } from 'src/app/shared/books/book.model';

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

Otherwise the typing of the StoreService Class won't work: `() => Observable<Book[]>`

# Testing

## Selectors
Testing is made easy inside your components. You don't need to import the whole `StoreModule.forRoot(...)`.

Simply provide the `StoreService` using the `provideStoreServiceMock` method. Then cast the store service instance using the `StoreServiceMock<T>` class to get the correct typings.


```ts
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

To get the injected Store instace the store instance using the `MockStore` class to get the correct typings.

```ts
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
