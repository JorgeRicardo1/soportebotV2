import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { CrudService } from '../core/services/http/crud.service';
import { StorageKey } from '../core/services/storage/storage.model';

import { StorageService } from '../core/services/storage/storage.service';
import { DataAccess } from './interfaces/auth.interface';
import { UserInformation } from '../shared/interfaces/user-information.interface';

const { AUTH_TOKEN } = StorageKey;

@Injectable({
  providedIn: 'root',
})
export class AuthService extends CrudService {
  endpoint = 'auth';

  // BehaviorSubject para manejar el token, inicializado con una cadena vacía
  private tokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >('');

  userInformation!: UserInformation;

  constructor(http: HttpClient, private storage: StorageService) {
    super(http);
    // Leer el token del almacenamiento al iniciar el servicio
    const token = this.storage.read(AUTH_TOKEN) || '';
    this.tokenSubject.next(token);
  }

  get token$(): Observable<string | null> {
    return this.tokenSubject.asObservable();
  }

  getToken() {
    return this.storage.read(AUTH_TOKEN);
  }

  saveToken(token: string) {
    this.storage.save(AUTH_TOKEN, token);
    this.tokenSubject.next(token);
  }

  logOut(): void {
    // Elimina el token de autenticación y otros datos almacenados
    localStorage.removeItem('AUTH_TOKEN');
    sessionStorage.clear();
  }

  isLogged(): Observable<boolean> {
    return this.token$.pipe(map((token) => (token ? true : false)));
  }

  getUserInfo(): Observable<UserInformation> {
    return this.post<any>('', 'auth/decode-token');
  }
}
