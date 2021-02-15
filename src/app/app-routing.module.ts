import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "./services/auth-guard.service";

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
    path: 'home/:reload',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGuard]

  },{
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGuard]

  },
  {
    path: 'orders/create',
    loadChildren: () => import('./orders/create/create.module').then( m => m.CreatePageModule),
    canActivate: [AuthGuard]

  },
  {
    path: 'orders/edit/:id',
    loadChildren: () => import('./orders/edit/edit.module').then( m => m.EditPageModule),
    canActivate: [AuthGuard]

  },
  {
    path: 'orders/confirm',
    loadChildren: () => import('./orders/confirm/confirm.module').then( m => m.ConfirmPageModule),
    canActivate: [AuthGuard]

  },
  {
    path: 'orders/manage',
    loadChildren: () => import('./orders/manage/manage.module').then( m => m.ManagePageModule),
    canActivate: [AuthGuard]

  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule),
    canActivate: [AuthGuard]

  },
  {
    path: 'order',
    loadChildren: () => import('./order/order.module').then( m => m.OrderPageModule),
    canActivate: [AuthGuard]

  },
  {
    path: 'order-detail/:id',
    loadChildren: () => import('./order-detail/order-detail.module').then( m => m.OrderDetailPageModule),
    canActivate: [AuthGuard]

  },
  {
    path: 'order-view/:id',
    loadChildren: () => import('./order-view/order-view.module').then( m => m.OrderViewPageModule),
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
