import { Actions } from '@ngrx/effects';
import { cold } from 'jasmine-marbles';
import { BookService } from 'src/app/shared/books/book.service';
import { BookEffects } from 'src/app/store/books/book.effects';
import { getBooks } from 'src/test/books';
import { booksLoadedAction, loadBooksAction } from './books.actions';

describe('BookEffects', () => {
    const service = new BookService();
    const books = getBooks().books;

    describe('loadBooks', () => {
        it('loads the books via service', () => {
            const source = cold('a', { a: loadBooksAction() });

            const loadBooksSpy = spyOn(service, 'loadBooks').and.callThrough();

            const effects = new BookEffects(new Actions(source), service);

            effects.loadBooks
                .subscribe(() => {
                    expect(loadBooksSpy).toHaveBeenCalled();
                });
        });
        it('dispatches a BooksLoadedAction', () => {
            const source = cold('a', { a: loadBooksAction() });
            const bookServiceReturn = cold('a', { a: books });
            spyOn(service, 'loadBooks').and.returnValue(bookServiceReturn);

            const expected = cold('a', { a: booksLoadedAction({ books }) });

            const effects = new BookEffects(new Actions(source), service);

            expect(effects.loadBooks).toBeObservable(expected);
        });
    });
});
