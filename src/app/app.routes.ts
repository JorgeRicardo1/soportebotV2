import { Routes } from '@angular/router';
import { NavigationComponent } from './core/components/navigation/components/navigation/navigation.component';
import { LoginComponent } from './pages/login/components/login/login.component';
import { AuthGuard } from './shared/guards/auth.guard';


export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: NavigationComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'chat',
        loadComponent: () => import('./pages/chat/chat.component').then(m => m.ChatComponent)
      },
      {
        path: 'casos',
        loadComponent: () => import('./pages/cases/cases.component').then(m => m.CasesComponent)
      },
      {
        path: 'help',
        loadComponent: () => import('./pages/help/help.component').then(m => m.HelpComponent)
      },
      {
        path: 'chatTech',
        loadComponent: () => import('./pages/chat-tech/chat-tech.component').then(m => m.ChatTechComponent)
      }
    ]
  }
];
