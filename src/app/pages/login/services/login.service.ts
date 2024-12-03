import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  Subject,
  catchError,
  of,
  tap,
} from 'rxjs';
import { StorageKey } from '../../../core/services/storage/storage.model';
import { CrudService } from '../../../core/services/http/crud.service';
import { GetLogin } from '../interfaces/get-login.interface';
import { UserLogin } from '../interfaces/user-login.interface';
import { AuthService } from '../../../auth/auth.service';
import { URL } from '../../../core/services/http/baseurl';
import { UserInformation } from '../../../shared/interfaces/user-information.interface';

const { AUTH_TOKEN } = StorageKey;

@Injectable({
  providedIn: 'root',
})
export class LoginService extends CrudService {
  loginEndpoint = '/auth/login';
  endpoint = 'auth/login';
  token!: string;

  constructor(public httpClient: HttpClient, private authService: AuthService) {
    super(httpClient);
    this.token = this.authService.getToken() || '';
  }

  login(userLogin: UserLogin): Observable<GetLogin | null> {
    return this.httpClient
      .post<GetLogin | null>(`${URL}${this.loginEndpoint}`, userLogin)
      .pipe(
        tap((response) => {
          if (response?.token) {
            this.authService.saveToken(response.token);
          } else {
            console.log(response?.token);
          }
        }),
        catchError((error) => {
          console.error('Login error:', error);
          return of(null);
        })
      );
  }
}
