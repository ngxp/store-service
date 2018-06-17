import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from 'src/app/app.module';
import { NewBookComponent } from './new-book.component';

describe('NewBookComponent', () => {
    let component: NewBookComponent;
    let fixture: ComponentFixture<NewBookComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [AppModule]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NewBookComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
