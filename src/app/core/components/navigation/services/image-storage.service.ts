import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageStorageService {

  private imageSubject = new BehaviorSubject<any>(null);
  image$ = this.imageSubject.asObservable();

  setImage(image: any): void {
    this.imageSubject.next(image);
  }
}
