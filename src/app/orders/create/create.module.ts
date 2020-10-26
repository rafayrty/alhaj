import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreatePageRoutingModule } from './create-routing.module';

import { CreatePage } from './create.page';
import { ComponentsModule } from '../../components.module'
import { TranslateModule } from '@ngx-translate/core'; // add this

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreatePageRoutingModule,
    ComponentsModule,
    TranslateModule

  ],
  declarations: [CreatePage]
})
export class CreatePageModule {}
