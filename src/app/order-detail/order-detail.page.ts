import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import {  SERVER_URL } from '../../environments/environment';
import '@capacitor-community/http';
import {  Capacitor, HapticsImpactStyle, HapticsNotificationType, Plugins } from '@capacitor/core';
import { AlertController, LoadingController,ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ViewerModalComponent } from 'ngx-ionic-image-viewer';

const { Http,Haptics } = Plugins;

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.page.html',
  styleUrls: ['./order-detail.page.scss'],
})


export class OrderDetailPage implements OnInit {
id:any;
loader:any;
order:any;
showDelete=true;
role:any;
  currentLang: string;
  constructor(
private route:ActivatedRoute,
private storage:Storage,
private loadingController:LoadingController,
private translate:TranslateService,
public modalController: ModalController,
public alertController:AlertController,
private router:Router
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
  
  async delete(){
    let msg =this.translate.instant('ALERTS.orders')
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
  
            this.confirmDelete();
          }
        }
      ]
    });

    await alert.present();
  }
  edit(){
    let url = '/orders/edit/'+this.id;
    this.router.navigate([url]);
  }
  confirmDelete(){
    this.presentLoading();
  this.storage.get('USER_INFO').then(async res=>{
    const ret = await Http.request({
      method: 'GET',
      url: `${SERVER_URL}/api/orders/delete/${this.id}`,
      headers:{
        'Accept':'application/json',
        'Content-Type':'application/json',
        'Authorization': 'Bearer ' + res.token
      },
    });
this.hideLoader();
if(ret['status']==200){
  
  this.router.navigate(['orders/manage'],{ replaceUrl: true })

}else{
  alert("An Error Occurred")
}
    return ret;
  });
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
  // console.log(new Date(date.replace(/-/g, "/")).toDateString(),"normal");
  // console.log(date.replace(/ /g,"T"));
  let current_datetime = new Date(date)
let formatted_date = current_datetime.getDate() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getFullYear()
return formatted_date.replace(/-/g, "/");
// let dateOutput = new Date(date).toLocaleDateString(
//    'en-GB',
//     {
//     //  weekday:'short',
//      month: 'numeric',
//      day: 'numeric',
//     }
//   ); 
//  alert(dateOutput);
  // return dateOutput;
}
day(date){
  // date = date+" 14:03:35T12:03:45.000000Z";

// console.log(date);
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
fetchOrder(){
this.presentLoading();
  this.storage.get('USER_INFO').then(res=>{
    const doGet = async () => {
      const ret = await Http.request({
        method: 'GET',
        url: `${SERVER_URL}/api/showOrder/${this.id}`,
        headers:{
          'Accept':'application/json',
          'Content-Type':'application/json',
          'Authorization': 'Bearer ' + res.token
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
  });
}



}
