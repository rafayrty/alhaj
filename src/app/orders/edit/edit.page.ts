import { Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import  { PhotoService } from '../../services/photo.service';
import { IonSelect, LoadingController, ModalController, NavController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { IonBackButtonDelegate } from '@ionic/angular';
import { trigger, state, style,query,stagger, animate, transition } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
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
import { TranslateService } from '@ngx-translate/core';
import { AuthState } from 'src/app/state/auth.state';
import { Store } from '@ngxs/store';

const { Haptics,Http } = Plugins;
@HostBinding('@enterAnimation')

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
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
export class EditPage implements OnInit {
  @ViewChild('Driverselect', { static: false }) Driverselect: IonSelect;
  @ViewChild('Vehicleselect', { static: false }) Vehicleselect: IonSelect;
  @ViewChild('Collectorselect', { static: false }) Collectorselect: IonSelect;

  @ViewChild(IonBackButtonDelegate, { static: false }) backButton: IonBackButtonDelegate;

  minDate: String = new Date().toISOString();
  maxDate: any = new Date(new Date().setDate(new Date().getDate() + 10)).toISOString();
drivers:any;
vehicles:any;
collectors:any;

date:any;
time:any;
file:any;
orderType:any;
image:any;
format:any;
step1:boolean = true;
step2:boolean = false;
step3:boolean = false;
step4:boolean = false;
errors:any=[];
receipt:any;
customError:any= {receipt:false }
id:any;
order:any;
selectedDriver:any = [];
selectedVehicle:any = [];
selectedCollector:any = [];
lat:any = 0;
lng:any = 0;
showSetting:boolean=false;
loader:any;
form:any = {
  vehicle:[],
  collector:[],
  driver:[]
}
title:string='Edit A New Order'
  constructor(
    private loadingController:LoadingController,
       private translate:TranslateService,
        private dataService:DataService, 
         public alertController: AlertController,
         private storage:Storage,
         private platform:Platform,
         private nav:NavController,
         private router:Router,
         private sanitizer : DomSanitizer,
         private route : ActivatedRoute,
         private state:Store,
         private photo:PhotoService) {

          this.storage.get('USER_INFO').then((response) => {
            let  res = response;
           if(res.user.role=='Manager'){
            this.showSetting = true;
              }
            });   


    this.platform.backButton.subscribeWithPriority(10, () => {
this.back();
    });
    this.title = this.translate.instant('CREATE.title');
   }

   ngOnInit() {
    this.route.paramMap.subscribe( paramMap => {
      this.id = paramMap.get('id');
  })
this.fetchOrder();

  }
  
  settings(){
    this.router.navigate(['/settings']);
  }
  fetchOrder(){
    let token = this.state.selectSnapshot(AuthState.token);
        const doGet = async () => {
          const ret = await Http.request({
            method: 'GET',
            url: `${SERVER_URL}/api/showOrder/${this.id}`,
            headers:{
              'Accept':'application/json',
              'Content-Type':'application/json',
              'Authorization': 'Bearer ' + token
            },
          });
    
          return ret;
        }
        doGet().then(res=>{
          this.hideLoader();
          this.fetchData();

          if(res.data){     
                   this.order = res.data;
                   this.lat = parseFloat(this.order.lat);
                   this.lng = parseFloat(this.order.lng);
                   console.log(this.lat);

            if(this.order.date!=null){
              this.date  = this.order.date+'T13:03:33.719+05:00';
              // this.start_time = this.order.time;
            }
     
          }else{
            this.order = false;
          }
    
        })
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



async presentLoading() {
  this.loader = await this.loadingController.create({
   cssClass: 'my-custom-class',
   message: this.translate.instant('wait'),
 });
 await this.loader.present();

 const { role, data } = await this.loader.onDidDismiss();
 console.log('Loading dismissed!');
}

hideLoader() {
  if (this.loader != null) {
      this.loader.dismiss();
      this.loader = null;
  }
}
updateLocation(e){
  this.lng = e.latLng.lng();
  this.lat = e.latLng.lat();
 }

doRefresh(event) {
  // this.fetchOrder();

  // this.fetchOrder();
  this.fetchData();  



  setTimeout(() => {
    event.target.complete();
  }, 2000);
}

changeCollector(){


  if(this.form.collector.length != 0){
    let selected = this.form.collector;
  this.selectedCollector = this.collectors.filter((collector) => selected.includes(collector.id));
  }


}

openCollector(){
  this.hapticsImpactLight();
  this.Collectorselect.open();
  setTimeout(() => {
    // According to the class style "div.alert-radio-group button" to get html elements
let buttonElements = document.querySelectorAll('div.alert-checkbox-group button');

    // Determine whether the obtained element is not null
if (!buttonElements.length) {
        // Empty, then get it again      
this.openCollector();
} else {
        // If it is not empty, loop through the obtained html element (that is, the html element where the information of the AlertController list is traversed)
for (let index = 0; index < buttonElements.length; index++) {
            // According to the subscript to take the html element
 let buttonElement = buttonElements[index];

            // Then take the information in the list according to the html element
 let optionLabelElement = buttonElement.querySelector('.alert-checkbox-label');
 
            // Splice the picture name to display the picture, pay attention to the picture naming, must be consistent with the binding field, then add Image for this element   
 optionLabelElement.innerHTML += '<img  src="'+this.collectors[index].image+'" style="width:20px;height:20px;float:right;margin-right: 15px;"/>';
}
}
}, 100);
}

changeDriver(){

if(this.form.driver.length != 0){
let selected = this.form.driver;
this.selectedDriver = this.drivers.filter((driver) => selected.includes(driver.id));
}
}

openDriver(){
  this.hapticsImpactLight();
  this.Driverselect.open();
  setTimeout(() => {
    // According to the class style "div.alert-radio-group button" to get html elements
let buttonElements = document.querySelectorAll('div.alert-checkbox-group button');

    // Determine whether the obtained element is not null
if (!buttonElements.length) {
        // Empty, then get it again      
this.openDriver();
} else {
        // If it is not empty, loop through the obtained html element (that is, the html element where the information of the AlertController list is traversed)
for (let index = 0; index < buttonElements.length; index++) {
            // According to the subscript to take the html element
 let buttonElement = buttonElements[index];

            // Then take the information in the list according to the html element
 let optionLabelElement = buttonElement.querySelector('.alert-checkbox-label');
 
            // Splice the picture name to display the picture, pay attention to the picture naming, must be consistent with the binding field, then add Image for this element   
 optionLabelElement.innerHTML += '<img  src="'+this.drivers[index].image+'" style="width:20px;height:20px;float:right;margin-right: 15px;"/>';
}
}
}, 100);
}
changeVehicle(){

if(this.form.vehicle.length != 0){
let selected = this.form.vehicle;
this.selectedVehicle = this.vehicles.filter((vehicle) => selected.includes(vehicle.id));
}

}

openVehicle(){
  this.hapticsImpactLight();
  this.Vehicleselect.open();
  setTimeout(() => {
    // According to the class style "div.alert-radio-group button" to get html elements
let buttonElements = document.querySelectorAll('div.alert-checkbox-group button');

    // Determine whether the obtained element is not null
if (!buttonElements.length) {
        // Empty, then get it again      
this.openVehicle();
} else {
        // If it is not empty, loop through the obtained html element (that is, the html element where the information of the AlertController list is traversed)
for (let index = 0; index < buttonElements.length; index++) {
            // According to the subscript to take the html element
 let buttonElement = buttonElements[index];

            // Then take the information in the list according to the html element
 let optionLabelElement = buttonElement.querySelector('.alert-checkbox-label');
 
            // Splice the picture name to display the picture, pay attention to the picture naming, must be consistent with the binding field, then add Image for this element   
 optionLabelElement.innerHTML += '<img  src="'+this.vehicles[index].image+'" style="width:20px;height:20px;float:right;margin-right: 15px;"/>';
}
}
}, 100);
}












fetchData(){
  this.presentLoading();
  let token = this.state.selectSnapshot(AuthState.token);

  const doGet = async () => {
    const ret = await Http.request({
      method: 'GET',
      url: `${SERVER_URL}/api/data`,
      headers:{
        'Accept':'application/json',
        'Content-Type':'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
    return ret;
  }
  doGet().then(res=>{
    // console.log(res);
    this.drivers = res['data'].drivers;
this.order.drivers.forEach(driver => {
  this.selectedDriver.push(driver);
  this.form.driver.push(driver.id);

});


    this.vehicles = res['data'].vehicles;
    this.order.vehicles.forEach(vehicle => {
      this.selectedVehicle.push(vehicle);
      this.form.vehicle.push(vehicle.id);

    });
    this.collectors = res['data'].collectors;
    this.order.collectors.forEach(collector => {
      this.selectedCollector.push(collector);
    // if(this.order.collectors.length==1){
    //   this.form.collector = this.order.collectors[0].id;
    // }else{
      this.form.collector.push(collector.id);
    // }

    });
    console.log(this.form.collector);

// this.dataService.drivers = this.drivers;
// this.dataService.vehicles = this.vehicles;

// this.changeDriver();
// this.changeVehicle();
this.hideLoader();
})
 
}
// fetchVehicles(){
//   let token = this.state.selectSnapshot(AuthState.token);
//   const doGet = async () => {
//     const ret = await Http.request({
//       method: 'GET',
//       url: `${SERVER_URL}/api/vehicles`,
//       headers:{
//         'Accept':'application/json',
//         'Content-Type':'application/json',
//         'Authorization': 'Bearer ' + token
//       }
//     });
//     return ret;
//   }
//   doGet().then(res=>{
// this.vehicles = res['data'];
// console.log(this.vehicles);
// this.filterVehicles()
// this.hideLoader();

// })
 
// }


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
      header: this.translate.instant('warning'),
      message: msg,
      buttons: [this.translate.instant('okay')]
    });

    await alert.present();
  }
  // schedule(e,type){
  //   this.hapticsImpactLight();
  //   let data;
  //   if(type=='schedule'){
  //     this.orderType = 'schedule';
  //   }
  //   if(this.image){
  //     data = {
  //       name:this.order.client,
  //       phone:this.order.phone,
  //       image:this.file,
  //       format:this.format,
  //       address:this.order.shipping,
  //       note:this.order.note
  //       }
  //     }else{
  //     data = {
  //       name:this.order.client,
  //       phone:this.order.phone,
  //       order:this.order.details,
  //       address:this.order.shipping,
  //       note:this.order.note
  //               }

  //     }

  //     e.target.innerHTML = '<ion-spinner></ion-spinner>';
  //     e.target.setAttribute('disabled','disabled');
    
  //     this.storage.get('USER_INFO').then(res=>{
  //       const doPost = async () => {
  //         const ret = await Http.request({
  //           method: 'POST',
  //           url: `${SERVER_URL}/api/orders/proceed`,
  //           headers:{
  //             'Accept':'application/json',
  //             'Content-Type':'application/json',
  //             'Authorization': 'Bearer ' + res.token
  //           },
  //           data:data
  //         });
  //         return ret;
  //       }
  //       doPost().then(res=>{
  //         if(type=='schedule'){
          
  //           e.target.innerHTML = this.translate.instant('CREATE.schedule');

  //         }else{
  //           e.target.innerHTML = this.translate.instant('CREATE.proceed');

  //         }
          
  //         e.target.removeAttribute('disabled');
  //         if(res['status']==200){
  //           this.title = this.translate.instant('ORDER.settings');
  //           this.step1 = false;
  //           this.step2 = true;
  //         }else if(res['status']==422){
  //           this.errors = res['data'].errors;
  //         }
  //   })
  //     })







  // }
  async next(e,type){
    this.changeVehicle();
    this.changeDriver();
    this.hapticsImpactLight();
    let data;





if(this.image){
data = {
  name:this.order.client,
  phone:this.order.phone,
  order:this.order.details,
  address:this.order.shipping,
  note:this.order.note,
  lat:this.lat,
  lng:this.lng,
  image:this.file,
  format:this.format,
  }
}else{
data = {
  name:this.order.client,
  phone:this.order.phone,
  order:this.order.details,
  address:this.order.shipping,
  note:this.order.note,
  lat:this.lat,
  lng:this.lng
          }
}
if(type=='proceed'){

   
  e.target.innerHTML = '<ion-spinner></ion-spinner>';
  e.target.setAttribute('disabled','disabled');

  let token = this.state.selectSnapshot(AuthState.token);
  const doPost = async () => {
      const ret = await Http.request({
        method: 'POST',
        url: `${SERVER_URL}/api/orders/proceed`,
        headers:{
          'Accept':'application/json',
          'Content-Type':'application/json',
          'Authorization': 'Bearer ' + token
        },
        data:data
      });
      return ret;
    }
    doPost().then(res=>{
      e.target.innerHTML = this.translate.instant('CREATE.proceed');
      e.target.removeAttribute('disabled');
      if(res['status']==200){
        this.title = this.translate.instant('ORDER.settings');
        this.step1 = false;
        this.step2 = true;
        // this.orderType = 'normal';
        // alert(this.order.orderType);

      // this.router.navigate(["/settings/vehicles"], navigationExtras);
      }else if(res['status']==422){
        this.errors = res['data'].errors;

        }

        
  // this.vehicles = res['data'];
  //   this.loading = false;
})





}

  }
  removeError(){
    this.customError.receipt = false;
  }
  back(){
    if(this.step4==true){
      this.title = this.translate.instant('CREATE.PILOT.title');

      this.step1 = false;
      this.step2 = false;
      this.step3 = true;
    }else if(this.step3==true){
      this.title = this.translate.instant('CREATE.PILOT.title');

      this.step1 = false;
      this.step2 = true;
      this.step3 = false;
    }else if(this.step2==true){
      this.title = this.translate.instant('CREATE.title');

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
    console.log(this.form.vehicle);
  // if(this.order.orde)
    this.hapticsImpactLight();
if(this.order.vehicle==""){
this.presentAlert(this.translate.instant('ALERTS.select_vehicle'));
}else{
    e.target.innerHTML = '<ion-spinner></ion-spinner>';
    e.target.setAttribute('disabled','disabled');
let data;
    if(this.file){
      data = {
        name:this.order.client,
        phone:this.order.phone,
        image:this.file,
        format:this.format,
        address:this.order.shipping,
        note:this.order.note,
        payment:this.order.payment,
        order:this.order.details,
        date:this.date,
        start_time:this.order.start_time,
        end_time:this.order.end_time,
        receipt:this.order.receipt,
        driver:this.form.driver,
        vehicle:this.form.vehicle,
        collector:this.form.collector,
        lat:this.order.lat,
        lng:this.order.lng,
        urgent:this.order.urgent,
        certificate:this.order.certificate
        }
      }else{
      data = {
        name:this.order.client,
        phone:this.order.phone,
        order:this.order.details,
        address:this.order.shipping,
        note:this.order.note,
        payment:this.order.payment,
        date:this.date,
        start_time:this.order.start_time,
        end_time:this.order.end_time,
        receipt:this.order.receipt,
        driver:this.form.driver,
        vehicle:this.form.vehicle,
        collector:this.form.collector,
        lat:this.lat,
        lng:this.lng,
        urgent:this.order.urgent,
        certificate:this.order.certificate
                }
      }
      let token = this.state.selectSnapshot(AuthState.token);

      const doPost = async () => {
        const ret = await Http.request({
          method: 'POST',
          url: `${SERVER_URL}/api/orders/dummy/${this.id}`,
          headers:{
            'Accept':'application/json',
            'Content-Type':'application/json',
            'Authorization': 'Bearer ' + token
          },
          data:data
        });
        return ret;
      }
      doPost().then(res=>{

        if(res['status']==200){
          e.target.innerHTML =  this.translate.instant('CREATE.VEHICLE.send');
          e.target.removeAttribute('disabled');
          this.router.navigateByUrl('/orders/confirm', { replaceUrl: true }) 

        // this.router.navigate(["/settings/vehicles"], navigationExtras);
        }else if(res['status']==422){
          e.target.innerHTML =  this.translate.instant('CREATE.VEHICLE.send');
          e.target.removeAttribute('disabled');
          alert("Form Validation Error Occurred");
          this.errors = res['data'].errors;
  
          }
  
          
    // this.vehicles = res['data'];
    //   this.loading = false;
  })
  


  }









    // this.router.navigateByUrl('/orders/confirm', { replaceUrl: true }) 

  }

}
