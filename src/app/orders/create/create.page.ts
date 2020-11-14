import { Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import  { PhotoService } from '../../services/photo.service';
import { IonSelect, LoadingController, ModalController, NavController } from '@ionic/angular';
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
import { TranslateService } from '@ngx-translate/core';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

const { Haptics,Http } = Plugins;
@HostBinding('@enterAnimation')



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
  @ViewChild('Pilotselect', { static: false }) Pilotselect: IonSelect;
  @ViewChild('Vehicleselect', { static: false }) Vehicleselect: IonSelect;

  @ViewChild(IonBackButtonDelegate, { static: false }) backButton: IonBackButtonDelegate;
  public searchPilots: string = "";
  public searchVehicles: string = "";
  minDate: String = new Date().toISOString();
  maxDate: any = new Date(new Date().setDate(new Date().getDate() + 10)).toISOString();
  interfaceOptions:{
    cssClass:'pilot-class',
  }

  pilots:any;
vehicles:any;
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
receipt:any="";
customError:any= {receipt:false };
payment:any='cod'
type:any='normal'
form:any = {
  name:'',
  address:"",
  note:"",
  order:"",
  pilot:"",
  vehicle:""
}
loader:any;
selectedPilot:any;
selectedVehicle:any;
showSetting:boolean=false;

title:string='Create A New Order'
  constructor(private loadingController:LoadingController,   private translate:TranslateService, private dataService:DataService,  public alertController: AlertController,private storage:Storage,private platform:Platform,private nav:NavController,private router:Router,private sanitizer : DomSanitizer,private photo:PhotoService) {
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
async presentLoading() {
  this.loader = await this.loadingController.create({
   cssClass: 'my-custom-class',
   message: this.translate.instant('wait'),
 });
 await this.loader.present();

}

hideLoader() {
  if (this.loader != null) {
      this.loader.dismiss();
      this.loader = null;
  }
}

filterVehicles(){

  this.vehicles = this.dataService.filterVehicles(this.searchVehicles);

}
doRefresh(event) {


this.ngOnInit();


  setTimeout(() => {
    event.target.complete();
  }, 2000);
}
fetchPilots(){
  this.presentLoading();

  this.storage.get('USER_INFO').then(res=>{
  const doGet = async () => {
    const ret = await Http.request({
      method: 'GET',
      url: `${SERVER_URL}/api/pilots`,
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
this.form.pilot = this.pilots[0].id
this.selectedPilot = this.pilots[0];
this.filterPilots()
this.fetchVehicles();
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
this.form.vehicle = this.vehicles[0].id
this.selectedVehicle = this.vehicles[0];
this.filterVehicles()
this.hideLoader();

})
})
 
}
  ngOnInit() {
 
    this.fetchPilots();  

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
      header: this.translate.instant('warning'),
      message: msg,
      buttons: [this.translate.instant('okay')]
    });

    await alert.present();
  }
  changePilot(){

  //   let form = this.form;
  //   this.selectedPilot =  this.pilots.filter(function(pilot,form) {
  //     return pilot.id == form.pilot;
  // });
  let startsWith = id => (element, index, array) => {
    return element.id === id;
  }
   this.selectedPilot =  this.pilots.filter(startsWith(this.form.pilot));
   this.selectedPilot = this.selectedPilot[0];

}

  openPilot(){
    this.hapticsImpactLight();
    this.Pilotselect.open();
    setTimeout(() => {
      // According to the class style "div.alert-radio-group button" to get html elements
let buttonElements = document.querySelectorAll('div.alert-radio-group button');

      // Determine whether the obtained element is not null
if (!buttonElements.length) {
          // Empty, then get it again      
 this.openPilot();
} else {
          // If it is not empty, loop through the obtained html element (that is, the html element where the information of the AlertController list is traversed)
 for (let index = 0; index < buttonElements.length; index++) {
              // According to the subscript to take the html element
   let buttonElement = buttonElements[index];

              // Then take the information in the list according to the html element
   let optionLabelElement = buttonElement.querySelector('.alert-radio-label');
   
              // Splice the picture name to display the picture, pay attention to the picture naming, must be consistent with the binding field, then add Image for this element   
   optionLabelElement.innerHTML += '<img  src="'+this.pilots[index].image+'" style="width:20px;height:20px;float:right;margin-right: 15px;"/>';
 }
}
}, 100);
  }
  changeVehicle(){

    //   let form = this.form;
    //   this.selectedPilot =  this.pilots.filter(function(pilot,form) {
    //     return pilot.id == form.pilot;
    // });
    let startsWith = id => (element, index, array) => {
      return element.id === id;
    }
     this.selectedVehicle =  this.vehicles.filter(startsWith(this.form.vehicle));
     this.selectedVehicle = this.selectedVehicle[0];
  
  }

  openVehicle(){
    this.hapticsImpactLight();
    this.Vehicleselect.open();
    setTimeout(() => {
      // According to the class style "div.alert-radio-group button" to get html elements
let buttonElements = document.querySelectorAll('div.alert-radio-group button');

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
   let optionLabelElement = buttonElement.querySelector('.alert-radio-label');
   
              // Splice the picture name to display the picture, pay attention to the picture naming, must be consistent with the binding field, then add Image for this element   
   optionLabelElement.innerHTML += '<img  src="'+this.vehicles[index].image+'" style="width:20px;height:20px;float:right;margin-right: 15px;"/>';
 }
}
}, 100);
  }

  // schedule(e,type){
  //   this.hapticsImpactLight();
  //   let data;
  //   if(this.image){
  //     data = {
  //       name:this.form.name,
  //       phone:this.form.phone,
  //       image:this.file,
  //       format:this.format,
  //       address:this.form.address,
  //       note:this.form.note
  //       }
  //     }else{
  //     data = {
  //       name:this.form.name,
  //       phone:this.form.phone,
  //       order:this.form.order,
  //       address:this.form.address,
  //       note:this.form.note
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
  //           this.title = this.translate.instant('CREATE.PILOT.title');
  //           this.step1 = false;
  //           this.step2 = true;
  //           this.step3 = false;
  //           this.step4 = false;
  //         }else if(res['status']==422){
  //           this.errors = res['data'].errors;
  //         }
  //   })
  //     })







  // }




  settings(){
    this.router.navigate(['/settings']);
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
  note:this.form.note
  }
}else{
data = {
  name:this.form.name,
  phone:this.form.phone,
  order:this.form.order,
  address:this.form.address,
  note:this.form.note
          }
}
if(type=='proceed'){


  if(this.orderType=='schedule'){
    let ahead = true;
    if(this.payment=='scania' || this.payment=='inshop' || this.payment=='heno'){
      // console.log(this.receipt)
      // if(this.receipt==""){
      //   ahead = false; 
      //   this.customError.receipt = this.translate.instant('ALERTS.receipt')
      // }
  


    }
    
    if(this.date==null || this.time==null){
      ahead = false;
      this.presentAlert(this.translate.instant('ALERTS.time'));
    }


  if(ahead){
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
          this.title = this.translate.instant('ORDER.settings');
          this.step1 = false;
          this.step2 = true;
        // this.router.navigate(["/settings/vehicles"], navigationExtras);
        }else if(res['status']==422){
          this.errors = res['data'].errors;
  
          }
  })
    })
  
    
  }
  
  
  }else{
    let ahead = true;
    if(this.payment=='scania' || this.payment=='inshop' || this.payment=='heno'){
      // if(this.receipt==''){
      //   ahead = false;
      //   this.customError.receipt = this.translate.instant('ALERTS.receipt')
      // }
    }
    if(ahead){
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
          e.target.innerHTML = this.translate.instant('CREATE.proceed');
          e.target.removeAttribute('disabled');
          if(res['status']==200){
            this.title = this.translate.instant('ORDER.settings');
            this.step1 = false;
            this.step2 = true;
          // this.router.navigate(["/settings/vehicles"], navigationExtras);
          }else if(res['status']==422){
            this.errors = res['data'].errors;
    
            }
    })
      })
    
    }
    
  }

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
  
    this.hapticsImpactLight();
if(this.form.vehicle==""){
this.presentAlert(this.translate.instant('ALERTS.select_vehicle'));
}else{
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
        note:this.form.note,
        payment:this.payment,
        orderType:this.orderType,
        type:this.type,
        date:this.date,
        time:this.time,
        receipt:this.receipt,
        pilot:this.form.pilot,
        order:this.form.order,
        vehicle:this.form.vehicle
        }
      }else{
      data = {
        name:this.form.name,
        phone:this.form.phone,
        order:this.form.order,
        address:this.form.address,
        note:this.form.note,
        payment:this.payment,
        orderType:this.orderType,
        type:this.type,
        date:this.date,
        time:this.time,
        receipt:this.receipt,
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
  
          }else{
            e.target.innerHTML =  this.translate.instant('CREATE.VEHICLE.send');
            e.target.removeAttribute('disabled');
            alert("Unable To Communicate To Server")
          }
  
          
    // this.vehicles = res['data'];
    //   this.loading = false;
  })
    })


  }









    // this.router.navigateByUrl('/orders/confirm', { replaceUrl: true }) 

  }

}
