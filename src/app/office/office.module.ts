import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OfficePageRoutingModule } from './office-routing.module';

import { OfficePage } from './office.page';
import { TranslateModule } from '@ngx-translate/core'; // add this

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    OfficePageRoutingModule
  ],
  declarations: [OfficePage]
})
export class OfficePageModule {}
