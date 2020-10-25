import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PilotsPageRoutingModule } from './pilots-routing.module';

import { PilotsPage } from './pilots.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PilotsPageRoutingModule
  ],
  declarations: [PilotsPage]
})
export class PilotsPageModule {}
