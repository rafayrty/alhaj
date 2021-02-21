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
import { Store } from '@ngxs/store';
import { AuthState } from 'src/app/state/auth.state';

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
  @ViewChild('Driverselect', { static: false }) Driverselect: IonSelect;
  @ViewChild('Vehicleselect', { static: false }) Vehicleselect: IonSelect;
  @ViewChild('Collectorselect', { static: false }) Collectorselect: IonSelect;

  @ViewChild(IonBackButtonDelegate, { static: false }) backButton: IonBackButtonDelegate;
  public searchDrivers: string = "";
  public searchVehicles: string = "";
  minDate: String = new Date().toISOString();
  maxDate: any = new Date(new Date().setDate(new Date().getDate() + 10)).toISOString();
  interfaceOptions:{
    cssClass:'driver-class',
  }
  lat = 32.701580;
  lng = 35.298149;
  drivers:any;
vehicles:any;
collectors:any;

date:any;
start_time:any;
end_time:any;
certificate:boolean = false;
file:any;
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
urgent:boolean = false;
shipping:boolean = false;

form:any = {
  name:'',
  address:"",
  note:"",
  order:"",
  driver:"",
  vehicle:"",
  collector:"",
}
loader:any;
selectedDriver:any = [];
selectedVehicle:any = [];
selectedCollector:any = [];

showSetting:boolean=false;

title:string='Create A New Order'
  constructor(private state:Store,private loadingController:LoadingController,   private translate:TranslateService, private dataService:DataService,  public alertController: AlertController,private storage:Storage,private platform:Platform,private nav:NavController,private router:Router,private sanitizer : DomSanitizer,private photo:PhotoService) {
    // this.storage.get('USER_INFO').then((response) => {
    //   let  res = response;
    //  if(res.user.role=='Manager'){
    //   this.showSetting = true;
    //     }
    //   });   
   
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


  updateLocation(e){
   this.lng = e.latLng.lng();
   this.lat = e.latLng.lat();
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


doRefresh(event) {


this.ngOnInit();


  setTimeout(() => {
    event.target.complete();
  }, 2000);
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
    console.log(res);
this.drivers = res['data'].drivers;
this.form.driver = this.drivers[0].id
this.selectedDriver.push(this.drivers[0]);

this.vehicles = res['data'].vehicles;
this.form.vehicle = this.vehicles[0].id
this.selectedVehicle.push(this.vehicles[0]);

this.collectors = res['data'].collectors;
this.form.collector = this.collectors[0].id
this.selectedCollector.push(this.collectors[0]);



this.hideLoader();
// this.fetchVehicles();
})
 
}

  ngOnInit() {
 
    this.fetchData();  

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
  note:this.form.note,
  lat:this.lat,
  lng:this.lng
  }
}else{
data = {
  name:this.form.name,
  phone:this.form.phone,
  order:this.form.order,
  address:this.form.address,
  note:this.form.note,
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
          // this.router.navigate(["/settings/vehicles"], navigationExtras);
          }else if(res['status']==422){
            this.errors = res['data'].errors;
    
            }
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
  
    this.hapticsImpactLight();
if(this.form.vehicle==""){
this.presentAlert(this.translate.instant('ALERTS.select_vehicle'));
}else{
    e.target.innerHTML = '<ion-spinner></ion-spinner>';
    e.target.setAttribute('disabled','disabled');
let data;
if(this.payment == 'shipping'){
  this.shipping = true;
}
    if(this.image){
      data = {
        name:this.form.name,
        phone:this.form.phone,
        image:this.file,
        format:this.format,
        address:this.form.address,
        note:this.form.note,
        payment:this.payment,
        urgent:this.urgent,
        certificate:this.shipping,
        
        date:this.date,
        start_time:this.start_time,
        end_time:this.end_time,
        receipt:this.receipt,
        driver:this.form.driver,
        order:this.form.order,
        vehicle:this.form.vehicle,
        collector:this.form.collector,
        lat:this.lat,
        lng:this.lng
        }
      }else{
      data = {
        name:this.form.name,
        phone:this.form.phone,
        order:this.form.order,
        address:this.form.address,
        note:this.form.note,
        payment:this.payment,
        urgent:this.urgent,
        certificate:this.shipping,

        date:this.date,
        start_time:this.start_time,
        end_time:this.end_time,
        receipt:this.receipt,
        driver:this.form.driver,
        vehicle:this.form.vehicle,
        collector:this.form.collector,
        lat:this.lat,
        lng:this.lng
                }
      }
      let token = this.state.selectSnapshot(AuthState.token);
      const doPost = async () => {
        const ret = await Http.request({
          method: 'POST',
          url: `${SERVER_URL}/api/orders`,
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
  
          }else{
            e.target.innerHTML =  this.translate.instant('CREATE.VEHICLE.send');
            e.target.removeAttribute('disabled');
            alert("Unable To Communicate To Server")
          }
  
          
    // this.vehicles = res['data'];
    //   this.loading = false;
  })


  }









    // this.router.navigateByUrl('/orders/confirm', { replaceUrl: true }) 

  }

}
