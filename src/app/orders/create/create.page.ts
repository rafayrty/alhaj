import { Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import  { PhotoService } from '../../services/photo.service';
import { ModalController, NavController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { IonBackButtonDelegate } from '@ionic/angular';
import { trigger, state, style,query,stagger, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';
import '@capacitor-community/http';
import { Storage } from '@ionic/storage';
import {  SERVER_URL } from '../../../environments/environment';
import { AlertController } from '@ionic/angular';
import { DataService } from "../../services/data.service";

import {
  Plugins,
  HapticsImpactStyle,
  Capacitor
} from '@capacitor/core';

const { Haptics,Http } = Plugins;

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
  animations: [
    trigger("enterAnimation", [
      transition(":enter", [
          style({ transform: "translateX(10px)", opacity: 0 }),
            animate(
              ".4s ease",
              style({
                transform: "translateX(0px)",
                opacity: 1
              })
            )
      ]),
      transition(":leave", [
          style({ transform: "translateX(0px)", opacity: 1 }),
            animate(
              ".4s ease-out",
              style({
                transform: "translateX(10px)",
                opacity: 0
              })
            )
      ])
    ])
  ]
})
export class CreatePage implements OnInit {
  @ViewChild(IonBackButtonDelegate, { static: false }) backButton: IonBackButtonDelegate;
  public searchPilots: string = "";
  public searchVehicles: string = "";

pilots:any;
vehicles:any;
file:any;
image:any;
format:any;
step1:boolean = true;
step2:boolean = false;
step3:boolean = false;
errors:any=[];
form:any = {
  name:'',
  address:"",
  price:"",
  order:"",
  pilot:"",
  vehicle:""
}
title:string='Create A New Order'
  constructor(private dataService:DataService,  public alertController: AlertController,private storage:Storage,private platform:Platform,private nav:NavController,private router:Router,private sanitizer : DomSanitizer,private photo:PhotoService) {
    this.platform.backButton.subscribeWithPriority(10, () => {
this.back();
    });
   }

   
  hapticsImpact(style = HapticsImpactStyle.Heavy) {
    // Native StatusBar available
if (Capacitor.getPlatform() != 'web') {
  Haptics.impact({
    style: style
  });
}
 
  }



  hapticsImpactLight() {
    this.hapticsImpact(HapticsImpactStyle.Light);
  }


filterPilots(){

  this.pilots = this.dataService.filterPilots(this.searchPilots);

}


filterVehicles(){

  this.vehicles = this.dataService.filterVehicles(this.searchVehicles);

}
fetchPilots(){
  this.storage.get('USER_INFO').then(res=>{
  const doGet = async () => {
    const ret = await Http.request({
      method: 'GET',
      url: `${SERVER_URL}/api/users`,
      headers:{
        'Accept':'application/json',
        'Content-Type':'application/json',
        'Authorization': 'Bearer ' + res.token
      }
    });
    return ret;
  }
  doGet().then(res=>{
    console.log(res);
this.pilots = res['data'];
this.dataService.pilots = this.pilots;

})
})
 
}
fetchVehicles(){
  this.storage.get('USER_INFO').then(res=>{
  console.log(res.token);
  const doGet = async () => {
    const ret = await Http.request({
      method: 'GET',
      url: `${SERVER_URL}/api/vehicles`,
      headers:{
        'Accept':'application/json',
        'Content-Type':'application/json',
        'Authorization': 'Bearer ' + res.token
      }
    });
    return ret;
  }
  doGet().then(res=>{
this.vehicles = res['data'];
this.dataService.vehicles = this.vehicles;
})
})
 
}
  ngOnInit() {
    this.filterPilots()
    this.filterVehicles()
    this.fetchPilots();
    this.fetchVehicles();
  


  }


  openCamera(){
    this.photo.takePicture().then(res=>{
      this.image = this.sanitizer.bypassSecurityTrustUrl("data:image/png;base64,"+res.url);
      this.file = res.upload;
      this.format = res.format
    });
  }
  async presentAlert(msg) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Warning',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }
  async next(e,type){
    this.hapticsImpactLight();
    let data;
if(this.image){
data = {
  name:this.form.name,
  phone:this.form.phone,
  image:this.file,
  format:this.format,
  address:this.form.address,
  price:this.form.price
  }
}else{
data = {
  name:this.form.name,
  phone:this.form.phone,
  order:this.form.order,
  address:this.form.address,
  price:this.form.price
          }
}
if(type=='proceed'){

  e.target.innerHTML = '<ion-spinner></ion-spinner>';
  e.target.setAttribute('disabled','disabled');

  this.storage.get('USER_INFO').then(res=>{
    const doPost = async () => {
      const ret = await Http.request({
        method: 'POST',
        url: `${SERVER_URL}/api/orders/proceed`,
        headers:{
          'Accept':'application/json',
          'Content-Type':'application/json',
          'Authorization': 'Bearer ' + res.token
        },
        data:data
      });
      return ret;
    }
    doPost().then(res=>{
      e.target.innerHTML = 'Proceed';
      e.target.removeAttribute('disabled');
      if(res['status']==200){
        this.title = "Assign A Pilot";
        this.step1 = false;
        this.step2 = true;
        this.step3 = false;
      // this.router.navigate(["/settings/vehicles"], navigationExtras);
      }else if(res['status']==422){
        this.errors = res['data'].errors;

        }

        
  // this.vehicles = res['data'];
  //   this.loading = false;
})
  })








}

   if(this.step2==true){
if(this.form.pilot==""){
this.presentAlert("Please Select A Pilot");
}else{
  this.title = "Assign A Vehicle";

      this.step1 = false;
      this.step2 = false;
      this.step3 = true;
}

    

    }
  }
  back(){
    if(this.step3==true){
      this.title = "Assign A Pilot";

      this.step1 = false;
      this.step2 = true;
      this.step3 = false;
    }else if(this.step2==true){
      this.title = "Create A New Order";

      this.step1 = true;
      this.step2 = false;
      this.step3 = false;
    }
    else if(this.step1==true){

      this.nav.back();
      this.step2 = false;
      this.step3 = false;
    }
  }
  send(e){
    e.target.innerHTML = '<ion-spinner></ion-spinner>';
    e.target.setAttribute('disabled','disabled');
let data;
    if(this.image){
      data = {
        name:this.form.name,
        phone:this.form.phone,
        image:this.file,
        format:this.format,
        address:this.form.address,
        price:this.form.price,
        pilot:this.form.pilot,
        vehicle:this.form.vehicle
        }
      }else{
      data = {
        name:this.form.name,
        phone:this.form.phone,
        order:this.form.order,
        address:this.form.address,
        price:this.form.price,
        pilot:this.form.pilot,
        vehicle:this.form.vehicle
                }
      }
    this.storage.get('USER_INFO').then(res=>{
      const doPost = async () => {
        const ret = await Http.request({
          method: 'POST',
          url: `${SERVER_URL}/api/orders`,
          headers:{
            'Accept':'application/json',
            'Content-Type':'application/json',
            'Authorization': 'Bearer ' + res.token
          },
          data:data
        });
        return ret;
      }
      doPost().then(res=>{
        e.target.innerHTML = 'Send';
        e.target.removeAttribute('disabled');
        if(res['status']==200){
          this.router.navigateByUrl('/orders/confirm', { replaceUrl: true }) 

        // this.router.navigate(["/settings/vehicles"], navigationExtras);
        }else if(res['status']==422){
          this.errors = res['data'].errors;
  
          }
  
          
    // this.vehicles = res['data'];
    //   this.loading = false;
  })
    })












    // this.router.navigateByUrl('/orders/confirm', { replaceUrl: true }) 

  }

}
