import { Injectable } from '@angular/core';
import { StorageKey } from './storage.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private storage: Storage;

  constructor() {
    this.storage = localStorage;
  }

  public save(key: StorageKey, value: any) {
    value = JSON.stringify(value);
    this.storage.setItem(key, value);
  }

  public read(key: StorageKey): any {
    const value = this.storage.getItem(key);
    if (value === null) {
      return null;
    }
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  }

  public remove(key: StorageKey) {
    return this.storage.removeItem(key);
  }

  public clear() {
    this.storage.clear();
  }
}
