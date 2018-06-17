import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { StoreModule } from 'src/app/store/store.module';
import { BookModule } from 'src/app/shared/books/book.module';
import { NewBookComponent } from './components/new-book/new-book.component';
import { BookListEntryComponent } from './components/book-list/book-list-entry/book-list-entry.component';
import { BookListComponent } from 'src/app/components/book-list/book-list.component';

@NgModule({
    declarations: [
        AppComponent,
        BookListComponent,
        NewBookComponent,
        BookListEntryComponent
    ],
    imports: [
        BrowserModule,
        StoreModule,
        BookModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
