import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AppModule } from 'src/app/app.module';
import { NgrxStoreServiceTestingModule } from 'ngrx-store-service/testing';
import { State } from 'src/app/store/store.model';
describe('AppComponent', () => {
    const state: State = {
        books: {
            books: [
                {
                    author: 'Author',
                    title: 'Title',
                    year: 2018
                }
            ]
        }
    };
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                AppModule,
                NgrxStoreServiceTestingModule.withState(state)
            ],
        }).compileComponents();
    }));
    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));
});
