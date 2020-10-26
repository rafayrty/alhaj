import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import {  SERVER_URL } from '../../environments/environment';
import { Storage } from '@ionic/storage';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { AlertController, ModalController,LoadingController } from '@ionic/angular';
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
const { Http,Haptics } = Plugins;
@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
  animations: [
    trigger(
      'inOutAnimation', 
      [
        transition(
          ':enter', 
          [
            style({ opacity: 0 }),
            animate('.3s ease-out', 
                    style({  opacity: 1 }))
          ]
        ),
        transition(
          ':leave', 
          [
            style({ opacity: 1 }),
            animate('.3s ease-in', 
                    style({opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class OrderPage implements OnInit {
order:any;
loader:any;

  constructor(private loadingController:LoadingController, private translate:TranslateService,public modalController: ModalController,public alertController: AlertController, private callNumber: CallNumber,private store:StorageService,private storage:Storage) { }
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
doRefresh(event) {
this.fetchOrder();
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
      buttons: ['OK']
    });

    await alert.present();
  }
  ngOnInit(){

  }
  ionViewWillEnter() {
    
    this.fetchOrder();
    let self = this;

PushNotifications.addListener(
  'pushNotificationActionPerformed',
  async (notification: PushNotificationActionPerformed) => {
    const data = notification.notification.data;
    if(data.role !="Manager"){
      window.location.reload();
    }

  });
    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotification) => {
      
this.hapticsImpactHeavy();
window.location.reload();



});



    
  }
  logOut(){


    this.hapticsImpactLight();

this.presentLoading();
  
    this.storage.get('USER_INFO').then(res=>{
      const doGet = async () => {
        const ret = await Http.request({
          method: 'POST',
          url: `${SERVER_URL}/api/users/status`,
          headers:{
            'Accept':'application/json',
            'Content-Type':'application/json',
            'Authorization': 'Bearer ' + res.token
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
    });

  

   //  this.route.navigateByUrl('/login');
 }
 call(num){
   this.hapticsImpactHeavy();
  // let tel_number = num;
  // window.open(`tel:${tel_number}`, '_system')
  this.callNumber.callNumber(num, true)
.then(res => console.log('Launched dialer!', res))
.catch(err => console.log('Error launching dialer', err));
}
confirmStatus(e,status,id){

  e.target.setAttribute('disabled','disabled');


  this.storage.get('USER_INFO').then(res=>{
    const doGet = async () => {
      const ret = await Http.request({
        method: 'POST',
        url: `${SERVER_URL}/api/orders/status/${id}`,
        headers:{
          'Accept':'application/json',
          'Content-Type':'application/json',
          'Authorization': 'Bearer ' + res.token
        },
        data:{
          status:status
        }
      });
      console.log(ret);

      return ret;
    }
    doGet().then(res=>{
      if(res){
        if(status=='Shipped'){
          e.target.innerHTML = `<ion-icon name="paper-plane-sharp"></ion-icon> <span>${this.translate.instant('ORDER.shipped')}</span>`;
          e.target.removeAttribute('disabled');
        }else{
          e.target.innerHTML = `<ion-icon name="checkmark-done-outline"></ion-icon> <span>${this.translate.instant('ORDER.delivered')}</span>`;
          e.target.removeAttribute('disabled');
        }
      }
      if(res.data){
        this.order = res.data;
      }else{
        this.order = false;
      }

    })
  });

}
async updateStatus(e,status,id) {
  this.hapticsImpactLight();

  let msg = "";
  if(status=="Shipped"){
    msg = this.translate.instant('ALERTS.shipped');
  }else if(status=="Delivered"){
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
pushOrder(){
  this.storage.get('USER_INFO').then(async res=>{
      const ret = await Http.request({
        method: 'GET',
        url: `${SERVER_URL}/api/orders/user/${res.user.id}`,
        headers:{
          'Accept':'application/json',
          'Content-Type':'application/json',
          'Authorization': 'Bearer ' + res.token
        },
      });


this.order = ret.data;
  console.log(this.order);
      return ret;
  });
}
 fetchOrder(){
   
  this.storage.get('USER_INFO').then(res=>{
    const doGet = async () => {
      const ret = await Http.request({
        method: 'GET',
        url: `${SERVER_URL}/api/orders/user/${res.user.id}`,
        headers:{
          'Accept':'application/json',
          'Content-Type':'application/json',
          'Authorization': 'Bearer ' + res.token
        },
      });

      return ret;
    }
    doGet().then(res=>{
      if(res.data){
       this.hapticsNotification(HapticsNotificationType.SUCCESS);
   
       var audio = new Audio('/assets/sound.mp3');
        audio.play();
        this.order = res.data;
        console.log(this.order);

      }else{
        this.order = false;
      }

    })
  });
  

  }
 }


