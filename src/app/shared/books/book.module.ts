import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookStoreService } from 'src/app/shared/books/book-store.service';
import { BookService } from 'src/app/shared/books/book.service';

@NgModule({
    imports: [
        CommonModule
    ],
    providers: [
        BookStoreService,
        BookService
    ],
})
export class BookModule { }
