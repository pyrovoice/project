import { OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

export abstract class Unsubscribing implements OnDestroy {
    private unsubscribeSubject = new Subject<void>();
    protected unsubscribe$ = this.unsubscribeSubject.asObservable();
  
    ngOnDestroy() {
      this.unsubscribeSubject.next();
      this.unsubscribeSubject.complete();
    }
  }
  