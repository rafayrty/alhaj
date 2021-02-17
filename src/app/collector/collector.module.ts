import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CollectorPageRoutingModule } from './collector-routing.module';

import { CollectorPage } from './collector.page';
import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';
import { TranslateModule } from '@ngx-translate/core'; // add this

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxIonicImageViewerModule,
    CollectorPageRoutingModule,
    TranslateModule
  ],
  declarations: [CollectorPage]
})
export class CollectorPageModule {}
