import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';
import { StorageKey } from '../../../core/services/storage/storage.model';
import { CrudService } from '../../../core/services/http/crud.service';
import { GetLogin } from '../interfaces/get-login.interface';
import { UserLogin } from '../interfaces/user-login.interface';
import { AuthService } from '../../../auth/auth.service';
import { URL } from '../../../core/services/http/baseurl'



const { AUTH_TOKEN } = StorageKey;

@Injectable({
  providedIn: 'root'
})
export class LoginService extends CrudService {
  loginEndpoint = '/auth/login';
  endpoint = 'auth/login';
  token!: string;

  private role!: string | undefined;

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
          }
          else{
            console.log("paila2")
          }
        }),
        catchError((error) => {
          console.error('Login error:', error);
          return of(null);
        }),
      );
  }
}
