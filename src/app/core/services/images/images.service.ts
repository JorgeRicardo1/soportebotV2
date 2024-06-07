import { Injectable } from '@angular/core';
import { CrudService } from '../http/crud.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImagesService extends CrudService{
  endpoint = 'images';

  constructor(protected override http: HttpClient) {
    super(http);
  }

  getImageThirdPartyId(): Observable<Blob> {
    return this.get('reduced-image3', undefined, 'blob');
  }

  // getImage(encryptedId: string, size: number): Observable<Blob> {
  //   return this.get(`reduced-image/${encryptedId}/${size}`, undefined, 'blob');
  // }

  getImage(): Observable<Blob>{
    return this.get('reduced-image', this.endpoint, 'blob');
  }
}
