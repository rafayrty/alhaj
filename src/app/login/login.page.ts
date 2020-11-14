import { Component } from '@angular/core';
// Must import the package once to make sure the web support initializes
import '@capacitor-community/http';
import {  SERVER_URL } from '../../environments/environment';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';

import { Plugins } from '@capacitor/core';
import { LanguageService } from '../services/language.service';
const { Http } = Plugins;
import { FcmService } from '../services/fcm.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage {
loginId:string = "";
message:string = "";
errors:any = [];
currentLang:any;
selectedLang:any;
  constructor(private fcm:FcmService,private translate:TranslateService, private languageService:LanguageService, private route:Router,private store:StorageService,private storage:Storage) {
    
  }
ionViewDidEnter(){
  this.selectedLang = localStorage.getItem('SELECTED_LANGUAGE')

  // this.store.authState.subscribe(state => {
  //   if (state) {
  //     this.storage.get('USER_INFO').then((response) => {
  //     let  res = response;
  //    if(res.user){
  //     this.route.navigateByUrl('/home');
  //   }
  //     });   
  //   }
  // });




}
  login(e){
    this.fcm.initPush();

    e.target.innerHTML = '<ion-spinner></ion-spinner>';
    e.target.setAttribute('disabled','disabled');
    // Example of a POST request. Note: data
// can be passed as a raw JS Object (must be JSON serializable)
const doPost = async () => {
  this.errors = [];
  this.message = '';
  const ret = await Http.request({
    method: 'POST',
    url: `${SERVER_URL}/api/token`,
    headers:{
      'Accept':'application/json',
      'Content-Type':'application/json',
    },
    data: {
      login_id: this.loginId,
      fcm:this.fcm.token
    }
  });
  return ret;
}
doPost().then(async res=>{

if(res['status']==200){
  let data = res['data'];
  // this.store.login(res['data']);
  this.store.login(res['data']).subscribe(
    async (res) => {
      console.log(res);
setTimeout(() => {
  e.target.innerHTML = this.translate.instant('LOGIN.btn');
  e.target.removeAttribute('disabled');
  if(data.user.role == 'Manager'){
    this.route.navigateByUrl('/orders/manage');
  }else{
    this.route.navigateByUrl('/home');
  }

}, 1000);
    }
  )
  const ret = await Http.request({
    method: 'POST',
    url: `${SERVER_URL}/api/users/status`,
    headers:{
      'Accept':'application/json',
      'Content-Type':'application/json',
      'Authorization': 'Bearer ' + res['data'].token
    },
    data:{
      status:"Available"
    }
  });  
  return ret;
// if(res['data'].user.role=='Manager'){
//   // this.storage.get('USER_INFO').then(res=>{
//   //   this.route.navigateByUrl('/home');

//   // })


// }else if(res['data'].user.role=='Pilot'){


//       const ret = await Http.request({
//         method: 'POST',
//         url: `${SERVER_URL}/api/users/status`,
//         headers:{
//           'Accept':'application/json',
//           'Content-Type':'application/json',
//           'Authorization': 'Bearer ' + res['data'].token
//         },
//         data:{
//           status:"Available"
//         }
//       });
   
//       // this.route.navigateByUrl('/order');

//       return ret;
    

// }
this.loginId = "";
// this.store.setObject(res['data']);// this.roue.push

// this.route.navigate(['home']);
}else if(res['status']==422){
  
  this.errors = res['data'].errors;
  e.target.innerHTML = this.translate.instant('LOGIN.btn');
  e.target.removeAttribute('disabled');
}else if(res['status']==404){
  e.target.innerHTML = this.translate.instant('LOGIN.btn');
  e.target.removeAttribute('disabled');
  this.message = res['data'].message;
}else{
  alert("Please Try Again");
  e.target.innerHTML = this.translate.instant('LOGIN.btn');
  e.target.removeAttribute('disabled');
  this.message = res['data'].message;
}


})
    
  }

  changeLang(){
    
    this.languageService.setLanguage(this.selectedLang);
    // window.location.reload();

  }


  ionViewWillEnter(){
 
        this.storage.get('USER_INFO').then((response) => {
        let  res = response;
       if(res.user.role=='Manager'){
            this.route.navigate(['/orders/manage'], { replaceUrl: true });

          }else{
            this.route.navigate(['home'], { replaceUrl: true });

          }
        });   
      
 

  }

}
