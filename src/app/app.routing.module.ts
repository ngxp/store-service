import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookDetailComponent } from './components/book-detail/book-detail.component';
import { BookListComponent } from './components/book-list/book-list.component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'books'
    },
    {
        path: 'books',
        component: BookListComponent
    },
    {
        path: 'books/:bookId',
        component: BookDetailComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { useHash: true })
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {
}
