import { NgModule } from '@angular/core'
import { MenuComponent } from './components/menu/menu.component';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core'; // add this



@NgModule({
    declarations:[MenuComponent],
    exports:[MenuComponent],
    imports:[
        CommonModule,
        IonicModule,
        FormsModule,
        TranslateModule
    ]
})

export class ComponentsModule{}