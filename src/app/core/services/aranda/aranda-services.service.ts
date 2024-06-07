import { Injectable } from '@angular/core';
import { CrudService } from '../http/crud.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArandaServicesService extends CrudService {
  override endpoint: string = 'users-crud';

  constructor(protected override http: HttpClient) {
    super(http);
  }

  insertUserAranda(body: any): Observable<boolean> {
    return this.post<any>(body, 'users-crud/register');
  }

  updateUserAranda(body: any, userID: number): Observable<boolean> {
    return this.post<any>(body, `users-crud/${userID}/update`);
  }

}
