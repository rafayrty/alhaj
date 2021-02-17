import { Component, HostBinding, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import {  SERVER_URL } from '../../environments/environment';
import { Storage } from '@ionic/storage';
import { AlertController, ModalController,LoadingController, NavController } from '@ionic/angular';
import { ViewerModalComponent } from 'ngx-ionic-image-viewer';

import {
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed, 
  } from '@capacitor/core';

const { PushNotifications } = Plugins;
import {
  Plugins,
  HapticsImpactStyle,
  Capacitor,
  HapticsNotificationType
} from '@capacitor/core';
import { TranslateService } from '@ngx-translate/core';
import { NavigationExtras, Router } from '@angular/router';
import { NewOrderService } from '../new-order.service';
import { Store } from '@ngxs/store';
import { AuthState } from '../state/auth.state';
const { Http,Haptics } = Plugins;

@Component({
  selector: 'driver-collector',
  templateUrl: './driver.page.html',
  styleUrls: ['./driver.page.scss'],
})
export class DriverPage implements OnInit {
currentOrders:any=[];
loader:any;
ordersEmpty:any=false;

orders:any = [];
tab:any="ongoing";
push:any;
self:any;
  currentLang: string;

  constructor(private state:Store,private newOrder:NewOrderService,private router:Router,private navCtrl:NavController,private loadingController:LoadingController, private translate:TranslateService,public modalController: ModalController,public alertController: AlertController,private store:StorageService,private storage:Storage) { }
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
tabchange(event){
  if(this.tab=='ongoing'){

    this.fetchOrder();
      }else{
        this.fetchUpcoming();
      }  
}
doRefresh(event) {
  if(this.tab=='ongoing'){

this.fetchOrder();
  }else{
    this.fetchUpcoming();
  }  
setTimeout(() => {
      event.target.complete();
    }, 2000);
  }
hapticsNotification(type = 	HapticsNotificationType.SUCCESS) {
  // Native StatusBar available
if (Capacitor.getPlatform() != 'web') {
Haptics.notification({
  type: type
});
}

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
  hapticsImpactHeavy() {
    this.hapticsImpact(HapticsImpactStyle.Heavy);
  }
  async openViewer(src) {
    const modal = await this.modalController.create({
      component: ViewerModalComponent,
      componentProps: {
        src: src
      },
      cssClass: 'ion-img-viewer',
      keyboardClose: true,
      showBackdrop: true
    });
 
    return await modal.present();
  }
  async presentAlert(title,body) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: title,
      message:body,
      buttons: [this.translate.instant('okay')]
    });

    await alert.present();
  }
  ngOnInit(){
  }
  ionViewWillEnter() {
    this.tab = "ongoing";
   this.fetchOrder();
    this.fetchUpcoming();
      this.currentLang = this.translate.currentLang;
    
//  PushNotifications.addListener(
//   'pushNotificationActionPerformed',
//   async (notification: PushNotificationActionPerformed) => {
//     const data = notification.notification.data;
//     // if(data.role !="Manager"){
//     //   window.location.reload();
//     // }

//   });
    // Show us the notification payload if the app is open on our device
   
    // PushNotifications.addListener('pushNotificationReceived',this.pushOrder());
  //   this.hapticsImpactHeavy();
  //   this.pushOrder();
  //   this.fetchOrder();
  //  // this.router.navigate(['/order'],{replaceUrl:true});
   
  //  });
  }
  logOut(){


    this.hapticsImpactLight();

this.presentLoading();
  
let token = this.state.selectSnapshot(AuthState.token);
      const doGet = async () => {
        const ret = await Http.request({
          method: 'POST',
          url: `${SERVER_URL}/api/users/status`,
          headers:{
            'Accept':'application/json',
            'Content-Type':'application/json',
            'Authorization': 'Bearer ' + token
          },
          data:{
            status:"Logged Out"
          }
        });  
        return ret;
      }
doGet().then(res=>{

  this.store.logout();
this.hideLoader();
})
  

  

   //  this.route.navigateByUrl('/login');
 }
 call(num){
   this.hapticsImpactHeavy();
  let tel_number = num;
  window.open(`tel:${tel_number}`, '_system')

}
confirmStatus(e,status,id){

  e.target.setAttribute('disabled','disabled');


  let token = this.state.selectSnapshot(AuthState.token);
  const doGet = async () => {
      const ret = await Http.request({
        method: 'POST',
        url: `${SERVER_URL}/api/orders/status/${id}`,
        headers:{
          'Accept':'application/json',
          'Content-Type':'application/json',
          'Authorization': 'Bearer ' + token
        },
        data:{
          status:status
        }
      });
      return ret;
    }
    doGet().then(res=>{
      if(res){
        if(status=="On The Way"){
          e.target.innerHTML = `${this.translate.instant('ORDER.shipped')}`;
          e.target.removeAttribute('disabled');
        }else if(status=='Preparing'){
          e.target.innerHTML = `${this.translate.instant('ORDER.preparing')}`;
          e.target.removeAttribute('disabled');
        }else if(status=='Delivered'){
          e.target.innerHTML = `${this.translate.instant('ORDER.delivered')}`;
          e.target.removeAttribute('disabled');
        }
      }
      if(res.data){
        this.pushOrder();
      }else{
        this.currentOrders = [];
      }

    })


}

async updateStatus(e,status,id) {
  this.hapticsImpactLight();

  let msg = "";
  if(status=="On The Way"){
    msg = this.translate.instant('ALERTS.shipped');
  }else if(status=="Preparing"){
    msg = this.translate.instant('ALERTS.preparing');
  }else if(status=='Delivered'){
    msg = this.translate.instant('ALERTS.delivered');

  }
  const alert = await this.alertController.create({
    cssClass: 'my-custom-class',
    header: this.translate.instant('ALERTS.title'),
    message: msg,
    buttons: [
      {
        text: this.translate.instant('ALERTS.cancel'),
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
          console.log('Confirm Cancel: blah');
        }
      }, {
        text: this.translate.instant('ALERTS.confirm'),
        handler: () => {
          this.hapticsImpactLight();

          this.confirmStatus(e,status,id);
        }
      }
    ]
  });

  await alert.present();
}
  async pushOrder(){
  this.presentLoading();
  
  let token = this.state.selectSnapshot(AuthState.token);
  let user = this.state.selectSnapshot(AuthState.user);

      const ret = await Http.request({
        method: 'GET',
        url: `${SERVER_URL}/api/orders/user/${user.id}`,
        headers:{
          'Accept':'application/json',
          'Content-Type':'application/json',
          'Authorization': 'Bearer ' + token
        },
      });

      this.hideLoader();

this.currentOrders = ret.data;
  console.log(this.currentOrders);
      return ret;

}
fetchUpcoming(){
  this.presentLoading();
let token = this.state.selectSnapshot(AuthState.token)
    const doGet = async () => {
      const ret = await Http.request({
        method: 'GET',
        url: `${SERVER_URL}/api/upcomingOrders`,
        headers:{
          'Accept':'application/json',
          'Content-Type':'application/json',
          'Authorization': 'Bearer ' + token
        },
      });
 
      return ret;
    }
    doGet().then(res=>{
      if(res.data){
      this.orders = res.data;
      if(this.orders.length==0 || this.orders == undefined){
        this.ordersEmpty = true;
      }else{
        this.ordersEmpty = false;
      }
      this.hideLoader();
        // this.order = false;
      }

    })
  

  }
  open(id){
    let url ='/order-view/'+id;
    this.router.navigate([url]);
  }
view(id){
  let url ='/order-detail/'+id;
  this.router.navigate([url]);
}

created(date){
  //    let lang = 'en-GB'
  //    if(this.currentLang == 'en'){
  // lang = 'en-GB';
  //    }else{
  //     lang = 'ar-EG';
  
  //    }

    let dateOutput = new Date(date).toLocaleDateString(
      'en-GB',
       {
        // weekday:'short',
        month: 'numeric',
        day: 'numeric',
        year:'numeric',
       }
     ); 
     return dateOutput;
   }
day(date){
      let lang = 'en-GB'
    if(this.currentLang == 'en'){
 lang = 'en-GB';
    }else{
     lang = 'ar-SA';
 
    }
let dateOutput = new Date(date.replace(/ /g,"T")).toLocaleDateString(
  lang,
  {
    weekday:'short',
  }
); 
return dateOutput;
}
  date(date){
//     let lang = 'en-GB'
//     if(this.currentLang == 'en'){
//  lang = 'en-GB';
//     }else{
//      lang = 'ar-EG';
 
//     }
    let dateOutput = new Date(date.replace(/ /g,"T")).toLocaleDateString(
       'en-GB',
       {
        //  weekday:'short',
         month: 'numeric',
         day: 'numeric',
         year:'numeric',
         hour:'numeric',
         minute:'numeric'
       }
     ); 
     return dateOutput;
    //  return dateOutput.replace(/-/g, '/');
   }
   time(time){
  //   let lang = 'en-GB'
  //   if(this.currentLang == 'en'){
  // lang = 'en-GB';
  //   }else{
  //    lang = 'ar-EG';
  
  //   }
  
    let dateOutput = new Date(time).toLocaleTimeString(
     'en-GB',
      {
        hour:'numeric',
        minute:'numeric'
      }
    ); 
    return dateOutput;
  }

 fetchOrder(){
  let token = this.state.selectSnapshot(AuthState.token);
  let user = this.state.selectSnapshot(AuthState.user);
      const doGet = async () => {
      const ret = await Http.request({
        method: 'GET',
        url: `${SERVER_URL}/api/orders/user/${user.id}`,
        headers:{
          'Accept':'application/json',
          'Content-Type':'application/json',
          'Authorization': 'Bearer ' + token
        },
      });

      return ret;
    }
    doGet().then(res=>{
      if(res.data.length != 0){
        alert(JSON.stringify(res.data));
       this.hapticsNotification(HapticsNotificationType.SUCCESS);
   
       var audio = new Audio('/assets/sound.mp3');
        audio.play();
        this.currentOrders = res.data;

      }else{
        this.currentOrders = [];
      }

    })
  

  }
 }


