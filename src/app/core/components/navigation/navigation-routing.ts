import { Injectable } from '@angular/core';
import { Routes } from '@angular/router';

export const sideNavigationPath = '';

export const navigationRoutes: Routes = [
  {
    path: '',
    redirectTo: 'chat',

  },
  {
    path: 'casos',
    loadChildren: () =>
      import('../../../pages/cases/cases.component').then((m) => m.CasesComponent),
  },
  {
    path: 'help',
    loadChildren: () =>
      import('../../../pages/help/help.component').then((m) => m.HelpComponent),
  },

];

@Injectable({ providedIn: 'root' })
export class NavigationRoutingService {
  constructor() {}
}
