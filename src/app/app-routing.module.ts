import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'orders/create',
    loadChildren: () => import('./orders/create/create.module').then( m => m.CreatePageModule)
  },
  {
    path: 'orders/confirm',
    loadChildren: () => import('./orders/confirm/confirm.module').then( m => m.ConfirmPageModule)
  },
  {
    path: 'orders/manage',
    loadChildren: () => import('./orders/manage/manage.module').then( m => m.ManagePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
