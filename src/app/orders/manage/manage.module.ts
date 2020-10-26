import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManagePageRoutingModule } from './manage-routing.module';

import { ManagePage } from './manage.page';
import { ComponentsModule } from '../../components.module'
import { TranslateModule } from '@ngx-translate/core'; // add this

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ManagePageRoutingModule,
    ComponentsModule
    ],
  declarations: [ManagePage]
})
export class ManagePageModule {}
