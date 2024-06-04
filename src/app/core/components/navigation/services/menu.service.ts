import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MenuEntry } from '../interfaces/menu-entry.interface';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor() { }

  private menu: MenuEntry[] = [
    { text: 'Chat', route: 'chat', icon: 'people'},
    { text: 'Casos', route: 'casos', icon: 'speed'},
    { text: 'Help', route: 'help', icon: 'query_stats' },
  ]

  // Método que retorna el menú hardcodeado
  getMenu(): Observable<MenuEntry[]> {
    return of(this.menu);
  }

}
