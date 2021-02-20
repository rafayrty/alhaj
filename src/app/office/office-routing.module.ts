import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OfficePage } from './office.page';

const routes: Routes = [
  {
    path: '',
    component: OfficePage
  },
  {
    path: 'order-view/:id',
    loadChildren: () => import('./order-view/order-view.module').then( m => m.OrderViewPageModule)
  },
  {
    path: 'edit/:id',
    loadChildren: () => import('./edit/edit.module').then( m => m.EditPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfficePageRoutingModule {}
