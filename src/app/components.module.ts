import { NgModule } from '@angular/core'
import { MenuComponent } from './components/menu/menu.component';
import { CreditsComponent } from './components/credits/credits.component';

import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core'; // add this

import { IonicStorageModule } from '@ionic/storage';
import { StorageService } from './services/storage.service';


@NgModule({
    declarations:[MenuComponent,CreditsComponent],
    exports:[MenuComponent,CreditsComponent],
    providers:[
        StorageService
    ],
    imports:[
        CommonModule,
        IonicModule,
        FormsModule,
        TranslateModule,
        IonicStorageModule.forRoot(),

    ]
})

export class ComponentsModule{}