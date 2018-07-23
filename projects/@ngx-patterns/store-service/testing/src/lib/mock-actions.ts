import { Subject } from 'node_modules/rxjs';
import { Actions } from '@ngrx/effects';

export class MockActions {
    private subject: Subject<any>;

    constructor() {
        this.subject = new Subject<any>();
    }

    actions(): Actions {
        return new Actions(this.subject);
    }

    next(value: any): void {
        return this.subject.next(value);
    }
}
