import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderPageRoutingModule } from './order-routing.module';

import { OrderPage } from './order.page';
import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';
import { TranslateModule } from '@ngx-translate/core'; // add this

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxIonicImageViewerModule,
    OrderPageRoutingModule,
    TranslateModule
  ],
  declarations: [OrderPage]
})
export class OrderPageModule {}
