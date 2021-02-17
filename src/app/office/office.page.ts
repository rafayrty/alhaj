import { Component, OnInit } from '@angular/core';
import { DataService } from "../services/data.service";
import {  SERVER_URL } from '../../environments/environment';
import { Router } from '@angular/router';
import '@capacitor-community/http';
import { LoadingController, ModalController } from '@ionic/angular';

import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
  
import {
  Plugins,
  HapticsImpactStyle,
  Capacitor
} from '@capacitor/core';
import { StorageService } from 'src/app/services/storage.service';
import { Store } from '@ngxs/store';
import { AuthState } from 'src/app/state/auth.state';

const { Haptics,Http } = Plugins;

@Component({
  selector: 'app-office',
  templateUrl: './office.page.html',
  styleUrls: ['./office.page.scss'],
})
export class OfficePage implements OnInit {
orders:any=[];
searchOrders:any = "";
loader:any;
currentPage:number=1;
totalPage:number;
ordersEmpty:any;
showSetting:boolean=false;
logOutBtn:boolean=false;
currentLang:any;
refreshed:any=false;
searchDate:any=new Date().toISOString();
maxDate:  String = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString();
maxDateUpcoming:String = new Date(new Date().setDate(new Date().getDate() + 12)).toISOString();
minDate: String = new Date(new Date().setDate(new Date().getDate() + 2)).toISOString();

currentTab:any = 'history'
  constructor(private state:Store,private store:StorageService,private router:Router, private translate:TranslateService,private loadingController:LoadingController,private dataService:DataService,private storage:Storage) {


   }
  hapticsImpact(style = HapticsImpactStyle.Heavy) {
    // Native StatusBar available
if (Capacitor.getPlatform() != 'web') {
  Haptics.impact({
    style: style
  });
}
 
  }
  logOut(){
          this.storage.get('USER_INFO').then(async res=>{
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

      })
    this.store.logout();
   //  this.route.navigateByUrl('/login');
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
    this.currentLang = this.translate.currentLang;
    this.fetchOrders();

    // if(!this.refreshed){
      // this.refreshed = true
    // }

 if(this.state.selectSnapshot(AuthState.isAuthenticated)){
  if(this.state.selectSnapshot(AuthState.user).roles.find(x=> x.name='Manager')){
    this.showSetting = true;
    this.logOutBtn = true;
      }
 }
    
  }
  
changedTab(){
    this.searchDate = new Date().toISOString();
    this.currentPage = 1;
    this.searchOrders = "";
    this.refreshed = true;

      this.fetchOrders();

    

}


  doRefresh(event) {
    this.currentPage = 1;
    this.searchDate = new Date().toISOString();
    this.refreshed = true;

    this.fetchOrders();
    
      setTimeout(() => {
          event.target.complete();
        }, 2000);
      }
  call(num){
    this.hapticsImpactHeavy();
    let tel_number = num;
    window.open(`tel:${tel_number}`, '_system')
  
  }
  async presentLoading() {
    this.loader = await this.loadingController.create({
     cssClass: 'my-custom-class',
     message: this.translate.instant('wait'),
     duration:1500
   });
   await this.loader.present();

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

 loadData(event) {
   if(this.searchOrders != ''){
    event.target.complete();

   }else{
  setTimeout(() => {
    event.target.complete();
if(this.currentPage != this.totalPage){
this.currentPage = this.currentPage + 1;
this.fetchOrders();
}else{
      event.target.disabled = true; 
}
  }, 500);
}
}




view(id){
  let url ='/order-detail/'+id;
  this.router.navigate([url]);
}

 hideLoader() {
  if (this.loader != null) {
      this.loader.dismiss();
      this.loader = null;
  }
}



fetchSearch2(e){
  if(this.searchOrders==""){
    this.currentPage = 1;
this.fetchOrders();
  }else{
  this.storage.get('USER_INFO').then(res=>{
    const doGet = async () => {
      const ret = await Http.request({
        method: 'GET',
        url: `${SERVER_URL}/api/fetchOrders/${this.currentTab}?search=${this.searchOrders}`,
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
    console.log(this.orders)
    if(this.orders.length==0 || this.orders.length == undefined){
      this.ordersEmpty = true;
    }else{
        this.ordersEmpty = false;
    }
  })
  
  })
}
}


fetchSearch(e){

if(this.searchDate.substr(0,10)!=new Date().toISOString().substr(0,10)){
  this.refreshed = false;
}
  if(!this.refreshed){
  if(this.searchOrders=="" && this.searchDate.substr(0,10)==new Date().toISOString().substr(0,10)){

    this.currentPage = 1;
    this.refreshed = true;
      this.fetchOrders();
 
    // this.fetchOrders();
    // alert("date");
  }else{
    let url;

    if(this.searchDate.substr(0,10)==new Date().toISOString().substr(0,10)){
      url =`${SERVER_URL}/api/fetchOrders/${this.currentTab}?search=${this.searchOrders}`
    }else if(this.searchOrders!="" && this.searchDate!=new Date().toISOString()){
      url =`${SERVER_URL}/api/fetchOrders/${this.currentTab}?search=${this.searchOrders}&date=${this.searchDate.substr(0,10)}`
    }else if(this.searchOrders=="" && this.searchDate==new Date().toISOString() || this.searchDate == new Date(new Date().setDate(new Date().getDate() + 2)).toISOString()){
      url =`${SERVER_URL}/api/fetchOrders/${this.currentTab}`
    }else{
      url =`${SERVER_URL}/api/fetchOrders/${this.currentTab}?date=${this.searchDate.substr(0,10)}`

    }
  this.storage.get('USER_INFO').then(res=>{
    const doGet = async () => {
      const ret = await Http.request({
        method: 'GET',
        url: url,
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
    console.log(this.orders)
    if(this.orders.length==0 || this.orders.length == undefined){
      this.ordersEmpty = true;
    }else{
        this.ordersEmpty = false;
    }
  })
  
  })
}

}
this.refreshed = false



}
navigate(url){
  this.hapticsImpactLight();
  this.router.navigate([url]);
}
  fetchOrders(){
    this.presentLoading();
    this.storage.get('USER_INFO').then(res=>{
      const doGet = async () => {
        const ret = await Http.request({
          method: 'GET',
          url: `${SERVER_URL}/api/fetchOrders/${this.currentTab}?page=${this.currentPage}`,
          headers:{
            'Accept':'application/json',
            'Content-Type':'application/json',
            'Authorization': 'Bearer ' + res.token
          }
        });
        return ret;
      }
      doGet().then(res=>{
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
    if(this.orders.length==0 || this.orders == undefined){
      this.ordersEmpty = true;
    }else{
        this.ordersEmpty = false;
    }
    this.hideLoader();
    })
    })
     
  }
filterOrders(){

  this.orders = this.dataService.filterOrders(this.searchOrders);
 
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
// date(date){
//  let dateOutput = new Date(date).toLocaleDateString(
//     'en-GB',
//     {
//       month: 'short',
//       day: 'numeric',
//       hour:'numeric',
//       minute:'numeric'
//     }
//   ); 
//   return dateOutput;
// }

}
