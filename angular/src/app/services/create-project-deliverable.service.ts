import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreateProjectDeliverableService {
  private dataSubject = new BehaviorSubject<any>(null);
  public data$ = this.dataSubject.asObservable();

  setData(data: any) {
    this.dataSubject.next(data);
  }

  clearData() {
    this.dataSubject.next(null);
  }

  private userChoiceSubject = new BehaviorSubject<string | null>(null);
  userChoice$ = this.userChoiceSubject.asObservable();
  setUserChoice(choice: string) {
    this.userChoiceSubject.next(choice);
  }
}
