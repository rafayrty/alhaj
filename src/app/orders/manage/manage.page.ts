import { Component, OnInit } from '@angular/core';
import { DataService } from "../../services/data.service";
import {  SERVER_URL } from '../../../environments/environment';
import { Router } from '@angular/router';
import '@capacitor-community/http';
import { LoadingController, ModalController } from '@ionic/angular';
import { CallNumber } from '@ionic-native/call-number/ngx';

import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
  
import {
  Plugins,
  HapticsImpactStyle,
  Capacitor
} from '@capacitor/core';

const { Haptics,Http } = Plugins;

@Component({
  selector: 'app-manage',
  templateUrl: './manage.page.html',
  styleUrls: ['./manage.page.scss'],
})
export class ManagePage implements OnInit {
orders:any;
searchOrders:any = "";
loader:any;
  constructor(private translate:TranslateService,private callNumber: CallNumber,private loadingController:LoadingController,private dataService:DataService,private storage:Storage) { }
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
  ngOnInit() {

  }
  ionViewWillEnter(){
    this.fetchOrders();
  }
  call(num){
    this.hapticsImpactHeavy();
    // let tel_number = num;
    // window.open(`tel:${tel_number}`, '_system')
    this.callNumber.callNumber(num, true)
  .then(res => console.log('Launched dialer!', res))
  .catch(err => console.log('Error launching dialer', err));
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
  fetchOrders(){
    this.presentLoading();
    this.storage.get('USER_INFO').then(res=>{
      const doGet = async () => {
        const ret = await Http.request({
          method: 'GET',
          url: `${SERVER_URL}/api/orders`,
          headers:{
            'Accept':'application/json',
            'Content-Type':'application/json',
            'Authorization': 'Bearer ' + res.token
          }
        });
        return ret;
      }
      doGet().then(res=>{
        this.hideLoader();
    this.orders = res['data'];
    // console.log(this.orders);
    this.dataService.orders = this.orders;
    this.filterOrders();
    })
    })
     
  }
filterOrders(){

  this.orders = this.dataService.filterOrders(this.searchOrders);

}
date(date){
 let dateOutput = new Date(date).toLocaleDateString(
    'en-gb',
    {
      month: 'short',
      day: 'numeric',
      hour:'numeric',
      minute:'numeric'
    }
  ); 
  return dateOutput;
}

}
