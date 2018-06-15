import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BookListComponent } from './pages/book-list/book-list.component';
import { StoreModule } from 'src/app/store/store.module';
import { BookModule } from 'src/app/shared/books/book.module';

@NgModule({
    declarations: [
        AppComponent,
        BookListComponent
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
