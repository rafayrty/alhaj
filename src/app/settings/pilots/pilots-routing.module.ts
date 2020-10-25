import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PilotsPage } from './pilots.page';

const routes: Routes = [
  {
    path: '',
    component: PilotsPage
  },
  {
    path: 'create',
    loadChildren: () => import('./create/create.module').then( m => m.CreatePageModule)
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
export class PilotsPageRoutingModule {}
