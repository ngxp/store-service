import { Actions } from '@ngrx/effects';
import { getBooks } from 'apps/store-service-sample/src/test/books';
import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';
import { BookService } from '../../shared/books/book.service';
import { BookEffects } from './book.effects';
import { booksLoadedAction, loadBooksAction } from './books.actions';

describe('BookEffects', () => {
    const service = new BookService();
    const books = getBooks().books;

    describe('loadBooks', () => {
        it('loads the books via service', () => {
            const source = of(loadBooksAction());

            const loadBooksSpy = jest.spyOn(service, 'loadBooks');

            const effects = new BookEffects(new Actions(source), service);

            effects.loadBooks.subscribe();

            expect(loadBooksSpy).toHaveBeenCalled();
        });
        it('dispatches a BooksLoadedAction', () => {
            const source = cold('a', { a: loadBooksAction() });
            const bookServiceReturn = cold('a', { a: books });
            jest.spyOn(service, 'loadBooks').mockReturnValue(bookServiceReturn);

            const expected = cold('a', { a: booksLoadedAction({ books }) });

            const effects = new BookEffects(new Actions(source), service);

            expect(effects.loadBooks).toBeObservable(expected);
        });
    });
});
