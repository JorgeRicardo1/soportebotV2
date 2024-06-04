import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CrudService } from '../../../core/services/http/crud.service';
import { Caso } from '../interfaces/caso'

@Injectable({
  providedIn: 'root'
})
export class CasosService extends CrudService{

  override endpoint = 'casos/completion';

  listCasos : Caso[] = [
    {
      ticket: '1234-kkk-55679-15377',
      user: {name : 'Andres', code : '1088035677'},
      date: new Date(),
      resume: '',
      state : {
        recibido : true,
        enviado : true,
        enRevision: false,
        solucionado: false
      }
    },
    {
      ticket: '9101-yyy-12347-1234',
      user: {name : 'Andres', code : '1088035677'},
      date: new Date(),
      resume: '',
      state: {
        recibido : true,
        enviado : true,
        enRevision: true,
        solucionado: true
      }
    },
  ]


  constructor(http: HttpClient) {
    super(http);
  }

  sendCasePost(body: any): Observable<any> {
    return this.post<any>(body);
  }

  getCasos() : Caso[]{
    return this.listCasos;
  }

  addCaso( caso : Caso){
    this.listCasos.push(caso);
  }
}
