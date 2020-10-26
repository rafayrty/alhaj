import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfirmPageRoutingModule } from './confirm-routing.module';

import { ConfirmPage } from './confirm.page';
import { ComponentsModule } from '../../components.module'
import { TranslateModule } from '@ngx-translate/core'; // add this

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    TranslateModule,
    ConfirmPageRoutingModule
  ],
  declarations: [ConfirmPage]
})
export class ConfirmPageModule {}
