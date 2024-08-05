import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CrudService } from '../../../core/services/http/crud.service';
import { Caso } from '../interfaces/caso'
import { WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CasosService extends CrudService{

  override endpoint = 'aranda-api/list-cases';
  private customEndpoint = 'aranda-api/create-case'

  casosListSignal: WritableSignal<any[]> = signal([]);


  constructor(http: HttpClient) {
    super(http);
  }


  getCasosPost() : Observable<any>{
    return this.post<any>('');

  }

  createCasoPost( body : any ): Observable<any>{
    return this.post<any>(body, this.customEndpoint);;
  }
}
