import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, catchError, of, tap } from 'rxjs';
import { StorageKey } from '../../../core/services/storage/storage.model';
import { CrudService } from '../../../core/services/http/crud.service';
import { GetLogin } from '../interfaces/get-login.interface';
import { UserLogin } from '../interfaces/user-login.interface';
import { AuthService } from '../../../auth/auth.service';
import { URL } from '../../../core/services/http/baseurl'
import { UserInformation } from '../../../shared/interfaces/user-information.interface';



const { AUTH_TOKEN } = StorageKey;

@Injectable({
  providedIn: 'root'
})
export class LoginService extends CrudService {
  loginEndpoint = '/auth/login';
  endpoint = 'auth/login';
  token!: string;

  userInfo : UserInformation = {
    document: '1004752660',
    identityType: 0,
    firstName: '',
    lastName: '',
    email: '',
    passWord: '',
    role: 4,
    charge: '',
    contractType: '',
    dependency: '',
    country: 0,
    companyId: 0
  }

  private role!: string | undefined;



  private userInformationSubject = new BehaviorSubject<UserInformation>(this.userInfo);
  userInformation$ = this.userInformationSubject.asObservable();

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
