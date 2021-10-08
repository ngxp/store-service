import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { getBook } from 'apps/store-service-sample/src/test/books';
import { BookListEntryComponent } from './book-list-entry.component';


describe('BookListEntryComponent', () => {
    let component: BookListEntryComponent;
    let fixture: ComponentFixture<BookListEntryComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [BookListEntryComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BookListEntryComponent);
        component = fixture.componentInstance;
        component.book = getBook();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
