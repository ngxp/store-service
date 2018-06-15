import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookStoreService } from 'src/app/shared/books/book-store.service';

@NgModule({
    imports: [
        CommonModule
    ],
    providers: [BookStoreService],
})
export class BookModule { }
