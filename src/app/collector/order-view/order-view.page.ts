import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import {  SERVER_URL } from '../../../environments/environment';
import '@capacitor-community/http';
import {  Capacitor, HapticsImpactStyle, HapticsNotificationType, Plugins } from '@capacitor/core';
import { AlertController, LoadingController,ModalController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ViewerModalComponent } from 'ngx-ionic-image-viewer';
import { Store } from '@ngxs/store';
import { AuthState } from 'src/app/state/auth.state';

const { Http,Haptics } = Plugins;

@Component({
  selector: 'app-order-view',
  templateUrl: './order-view.page.html',
  styleUrls: ['./order-view.page.scss'],
})


export class OrderViewPage implements OnInit {
id:any;
loader:any;
order:any;
showDelete=true;
role:any;
  currentLang: string;
  constructor(
    private navCtrl:NavController,
private route:ActivatedRoute,
private storage:Storage,
private loadingController:LoadingController,
private translate:TranslateService,
public modalController: ModalController,
public alertController:AlertController,
private router:Router,
private state:Store
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe( paramMap => {
      this.id = paramMap.get('id');
  })
  this.storage.get('USER_INFO').then(async res=>{
 this.role = res.user.role;
  });
  this.fetchOrder();
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
ionViewWillEnter(){
  this.currentLang = this.translate.currentLang;
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
time(time){
//   let lang = 'en-GB'
//   if(this.currentLang == 'en'){
// lang = 'en-GB';
//   }else{
//    lang = 'ar-EG';

//   }
 let dateOutput = new Date(time).toLocaleDateString(
   'en-GB',
    {
      year:'numeric',
      hour:'numeric',
      minute:'numeric'
    }
  ); 
  return dateOutput;
}
created(date){

 let dateOutput = new Date(date).toLocaleDateString(
   'en-GB',
    {
    //  weekday:'short',
     month: 'numeric',
     day: 'numeric',
    }
  ); 
  return dateOutput;
}
async updateStatus(e,status,id) {
  this.hapticsImpactLight();

  let msg = "";
 if(status=="Preparing"){
    msg = this.translate.instant('ALERTS.preparing');
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
      if(status=='Preparing'){
          e.target.innerHTML = `${this.translate.instant('ORDER.preparing')}`;
          this.navCtrl.back();
          e.target.removeAttribute('disabled');
        }
      }
      if(res.data){
        this.fetchOrder();
      }else{
        this.navCtrl.back();
        // this.order = false;
      }

    })

}
day(date){
  let lang = 'en-GB'
if(this.currentLang == 'en'){
lang = 'en-GB';
}else{
 lang = 'ar-SA';

}
let dateOutput = new Date(date).toLocaleDateString(
lang,
{
weekday:'short',
}
);

return dateOutput;
}
date(date){

  let dateOutput = new Date(date).toLocaleDateString(
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
 }
  doRefresh(event) {
    this.fetchOrder();
      setTimeout(() => {
          event.target.complete();
        }, 2000);
      }
  call(num){
    let tel_number = num;
    window.open(`tel:${tel_number}`, '_system')
  }
  location(lat,lng){
    let destination = lat + ',' + lng;
    window.open("https://www.google.com/maps/search/?api=1&query="+destination)
  }
fetchOrder(){
this.presentLoading();
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

      if(res.data){
        this.order = res.data;
      
      }else{
        this.order = false;
      }

    })

  }



}
