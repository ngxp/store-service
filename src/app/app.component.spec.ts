import { async, TestBed } from '@angular/core/testing';
import { NgrxStoreServiceTestingModule } from 'ngrx-store-service/testing';
import { AppModule } from 'src/app/app.module';
import { getState } from 'src/test/state';
import { AppComponent } from './app.component';
describe('AppComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                AppModule,
                NgrxStoreServiceTestingModule.withState(getState())
            ],
        }).compileComponents();
    }));
    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));
});
