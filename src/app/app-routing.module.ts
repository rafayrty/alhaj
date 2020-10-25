import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from "./services/auth-guard.service";

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGuardService]

  },
  {
    path: 'orders/create',
    loadChildren: () => import('./orders/create/create.module').then( m => m.CreatePageModule),
    canActivate: [AuthGuardService]

  },
  {
    path: 'orders/confirm',
    loadChildren: () => import('./orders/confirm/confirm.module').then( m => m.ConfirmPageModule),
    canActivate: [AuthGuardService]

  },
  {
    path: 'orders/manage',
    loadChildren: () => import('./orders/manage/manage.module').then( m => m.ManagePageModule),
    canActivate: [AuthGuardService]

  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule),
    canActivate: [AuthGuardService]

  },
  {
    path: 'order',
    loadChildren: () => import('./order/order.module').then( m => m.OrderPageModule),
    canActivate: [AuthGuardService]

  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
