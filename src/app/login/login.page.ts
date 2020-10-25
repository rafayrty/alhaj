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
    this.selectedLang = localStorage.getItem('SELECTED_LANGUAGE')
    console.log(this.selectedLang);
  }

  login(e){
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
    }
  });
  return ret;
}
doPost().then(res=>{
  e.target.innerHTML = 'Login';
  e.target.removeAttribute('disabled');
if(res['status']==200){
  this.fcm.initPush();

if(res['data'].user.role=='Manager'){
  this.store.login(res['data']);
  this.route.navigateByUrl('/home');
}else if(res['data'].user.role=='Pilot'){
  this.store.login(res['data']);

  this.route.navigateByUrl('/order');
}
// this.store.setObject(res['data']);
console.log(res['data']);
// this.roue.push
 
}else if(res['status']==422){
  this.errors = res['data'].errors;
}else if(res['status']==404){
  this.message = res['data'].message;
}


})
    
  }

  changeLang(){
    this.languageService.setLanguage(this.selectedLang);
    // window.location.reload();

  }


  // ionViewWillEnter(){
  //   this.store.authState.subscribe(state => {
  //     if (state) {
  //       this.storage.get('USER_INFO').then((response) => {
  //       let  res = response;
  //      if(res.user.role=='Manager'){
  //           this.route.navigate(['home'], { replaceUrl: true });

  //         }else{
  //           this.route.navigate(['order'], { replaceUrl: true });

  //         }
  //       });   
  //     }
  //   });

  // }

}
