import { LoadBooksAction, BooksLoadedAction } from 'src/app/store/books/books.actions';
import { cold } from 'jasmine-marbles';
import { BookEffects } from 'src/app/store/books/book.effects';
import { Actions } from '@ngrx/effects';
import { BookService } from 'src/app/shared/books/book.service';
import { getBooks } from 'src/test/books';

describe('BookEffects', () => {
    const service = new BookService();
    const books = getBooks().books;

    describe('loadBooks', () => {
        it('loads the books via service', () => {
            const source = cold('a', { a: new LoadBooksAction() });

            const loadBooksSpy = spyOn(service, 'loadBooks').and.callThrough();

            const effects = new BookEffects(new Actions(source), service);

            effects.loadBooks
                .subscribe(() => {
                    expect(loadBooksSpy).toHaveBeenCalled();
                });
        });
        it('dispatches a BooksLoadedAction', () => {
            const source = cold('a', { a: new LoadBooksAction() });
            const bookServiceReturn = cold('a', { a: books });
            spyOn(service, 'loadBooks').and.returnValue(bookServiceReturn);

            const expected = cold('a', { a: new BooksLoadedAction(books) });

            const effects = new BookEffects(new Actions(source), service);

            expect(effects.loadBooks).toBeObservable(expected);
        });
    });
});
