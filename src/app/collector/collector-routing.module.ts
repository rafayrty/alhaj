import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CollectorPage } from './collector.page';

const routes: Routes = [
  {
    path: '',
    component: CollectorPage
  },
  {
    path: 'order-view/:id',
    loadChildren: () => import('./order-view/order-view.module').then( m => m.OrderViewPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CollectorPageRoutingModule {}
