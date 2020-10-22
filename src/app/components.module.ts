import { NgModule } from '@angular/core'
import { MenuComponent } from './components/menu/menu.component';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';



@NgModule({
    declarations:[MenuComponent],
    exports:[MenuComponent],
    imports:[
        CommonModule,
        IonicModule,
        FormsModule
    ]
})

export class ComponentsModule{}