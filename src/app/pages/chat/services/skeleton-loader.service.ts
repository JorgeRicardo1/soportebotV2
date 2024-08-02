import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SkeletonLoaderService {

  showLoader = false;

  constructor() {}

  show(): void {
    this.showLoader = true;
  }

  hide(): void {
    this.showLoader = false;
  }
}
