import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TechModeService {

  private techModeSubject = new BehaviorSubject<boolean>(false);
  techMode$ = this.techModeSubject.asObservable();

  setTechMode(isTech: boolean) {
    this.techModeSubject.next(isTech);
  }

  getTechMode() {
    return this.techModeSubject.getValue();
  }
}
