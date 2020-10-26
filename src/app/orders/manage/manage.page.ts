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
currentPage:number=1;
totalPage:number;
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
  doRefresh(event) {
    this.currentPage = 1;
    this.fetchOrders();
      setTimeout(() => {
          event.target.complete();
        }, 2000);
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


 loadData(event) {
  setTimeout(() => {
    console.log('Done');
    event.target.complete();

if(this.currentPage != this.totalPage){
this.currentPage = this.currentPage + 1;
this.fetchOrders();
}else{
      event.target.disabled = true; 
}




  }, 500);
}






 hideLoader() {
  if (this.loader != null) {
      this.loader.dismiss();
      this.loader = null;
  }
}
fetchSearch(){
  if(this.searchOrders==""){
    this.currentPage = 1;
    this.fetchOrders();
  }else{
  this.storage.get('USER_INFO').then(res=>{
    const doGet = async () => {
      const ret = await Http.request({
        method: 'GET',
        url: `${SERVER_URL}/api/orders?search=${this.searchOrders}`,
        headers:{
          'Accept':'application/json',
          'Content-Type':'application/json',
          'Authorization': 'Bearer ' + res.token
        }
      });
      return ret;
    }
    doGet().then(res=>{
    this.orders = res['data'];

  })
  
  })
}
   
}
  fetchOrders(){
    this.presentLoading();
    this.storage.get('USER_INFO').then(res=>{
      const doGet = async () => {
        const ret = await Http.request({
          method: 'GET',
          url: `${SERVER_URL}/api/orders?page=${this.currentPage}`,
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
        if(this.currentPage==1){
      this.orders = res['data']['data'];
        }else{
          let datas = res['data']['data'];
          for(let data of datas){
           this.orders.push(data);
         }
          // console.log(res['data']['data']);
          // this.orders.push(res['data']['data']);
        }
    
    this.currentPage = res['data']['current_page'];
    this.totalPage = res['data']['last_page'];
    // console.log(this.orders);
    console.log(this.currentPage);
    this.dataService.orders = this.orders;
    // this.filterOrders();
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
