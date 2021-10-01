import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { BookDetailComponent } from './components/book-detail/book-detail.component';
import { BookListEntryComponent } from './components/book-list/book-list-entry/book-list-entry.component';
import { BookListComponent } from './components/book-list/book-list.component';
import { NewBookComponent } from './components/new-book/new-book.component';
import { BookModule } from './shared/books/book.module';

@NgModule({
    declarations: [
        AppComponent,
        BookListComponent,
        NewBookComponent,
        BookListEntryComponent,
        BookDetailComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        BookModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
