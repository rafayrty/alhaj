import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditPageRoutingModule } from './edit-routing.module';

import { EditPage } from './edit.page';
import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';
import { TranslateModule } from '@ngx-translate/core'; // add this

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditPageRoutingModule,
    NgxIonicImageViewerModule,
    TranslateModule
    
  ],
  declarations: [EditPage]
})
export class EditPageModule {}
