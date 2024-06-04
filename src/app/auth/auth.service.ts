import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { CrudService } from '../core/services/http/crud.service';
import { StorageKey } from '../core/services/storage/storage.model';

import { StorageService } from '../core/services/storage/storage.service';
import { DataAccess } from './interfaces/auth.interface';

const { AUTH_TOKEN } = StorageKey;

@Injectable({
  providedIn: 'root'
})
export class AuthService extends CrudService {
  endpoint = 'auth';

  // BehaviorSubject para manejar el token, inicializado con una cadena vacía
  private tokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<
  string | null
  >('');

  constructor(http: HttpClient, private storage: StorageService) {
    super(http);
    // Leer el token del almacenamiento al iniciar el servicio
    const token = this.storage.read(AUTH_TOKEN) || '';
    this.tokenSubject.next(token);
  }

  get token$(): Observable<string | null> {
    return this.tokenSubject.asObservable();
  }

  watchKey(key: string): Observable<string | null> {
    return new Observable<string | null>((observer) => {
      const handleStorageEvent = (event: StorageEvent) => {
        if (event.key === key) {
          observer.next(event.newValue);
          observer.complete();
        }
      };
      window.addEventListener('storage', handleStorageEvent);
      return () => {
        window.removeEventListener('storage', handleStorageEvent);
      };
    });
  }

  fixEncoding(str: string): string {
    const replacements: { [key: string]: string } = {
      'ï¿½': 'í',
      '&aacute;': 'á',
      '&eacute;': 'é',
      '&iacute;': 'í',
      '&oacute;': 'ó',
      '&uacute;': 'ú',
      '&Aacute;': 'Á',
      '&Eacute;': 'É',
      '&Iacute;': 'Í',
      '&Oacute;': 'Ó',
      '&Uacute;': 'Ú',
    };

    let result = str;
    for (const [original, replacement] of Object.entries(replacements)) {
      result = result.split(original).join(replacement);
    }

    return result;
  }

  decodeToken(): Observable<DataAccess | null> {
    return this.token$.pipe(
      map((token) => {
        try {
          if (!token) {
            return null;
          }

          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace('-', '+').replace('_', '/');
          const utf8Bytes = this.base64ToUint8Array(base64);
          const text = new TextDecoder('utf-8').decode(utf8Bytes);
          const tokenData = JSON.parse(text);
          delete tokenData.thirdpartyId;
          delete tokenData.iat;

          return tokenData;
        } catch (error) {
          console.error('Error decoding token', error);
          return null;
        }
      }),
    );
  }

  // Método adicional para convertir una cadena Base64 en un Uint8Array
  base64ToUint8Array(base64: string): Uint8Array {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  getToken() {
    return this.storage.read(AUTH_TOKEN);
  }

  saveToken(token: string) {
    this.storage.save(AUTH_TOKEN, token);
    this.tokenSubject.next(token); // Actualizar el BehaviorSubject con el nuevo token
  }

  logOut() {
    this.tokenSubject.next(null); // Resetear el BehaviorSubject al cerrar sesión
    this.storage.remove(AUTH_TOKEN);
  }

  isLogged(): Observable<boolean> {
    return this.token$.pipe(map((token) => (token ? true : false)));
  }
}
