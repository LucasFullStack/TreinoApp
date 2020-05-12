import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagesPage } from './pages.page';
import { AuthGuardService } from 'src/app/core/services/auth/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuardService],
    component: PagesPage,

    children: [
      {
        path: 'treinos',
        loadChildren: () => import('./treinos/treinos.module').then(m => m.TreinosPageModule)
      },
      {
        path: 'perfil',
        loadChildren: () => import('./perfil/perfil.module').then( m => m.PerfilPageModule)
      },
      {
        path: '',
        redirectTo: 'treinos',
        pathMatch: 'full'
      },
    ]
  },

  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthPageModule)
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesPageRoutingModule { }
