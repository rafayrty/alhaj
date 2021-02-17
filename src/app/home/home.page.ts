import { Component, OnInit } from '@angular/core';
import { Animation, AnimationController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { Storage } from '@ionic/storage';
import { Actions, ofActionDispatched, Store } from '@ngxs/store';

import '@capacitor-community/http';

import {
  Plugins,
  HapticsImpactStyle,
  Capacitor
} from '@capacitor/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';
import { SERVER_URL } from 'src/environments/environment';
import { AuthState } from '../state/auth.state';
import { Logout } from '../state/auth.actions';

import { VirtualTimeScheduler } from 'rxjs';

const { Haptics,Http } = Plugins;
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
hideDriver:any = true;
currentLang:any;
selectedLang:any;
user:any;
roles:any= {
manager:false,
driver:false,
collector:false,
office:false
}
  constructor(private actions: Actions,private translate:TranslateService,private state:Store, private languageService:LanguageService,private store:StorageService,private active:ActivatedRoute,private Storage:Storage,private route:Router,private animationCtrl: AnimationController) {
// this.Storage.get('USER_INFO').then((response)=>{
//   let  res = response;
//   if(res.user.role=='Pilot'){
//     this.hideDriver = false;
//   }
// });
this.active.paramMap.subscribe( paramMap => {
  let id =paramMap.get('reload');
  if(id=='1'){
this.route.navigateByUrl('order',{replaceUrl:true})
  }

})
    //     this.store.authState.subscribe(state => {
//       if (state) {
//         this.Storage.get('USER_INFO').then((response) => {
//         let  res = response;
//         console.log(res);
//        if(res.user.role=='Pilot'){
// this.hideDriver = false;
//       }
//         });   
//       }
//     });
   }
   changeLang(){
    
    this.languageService.setLanguage(this.selectedLang);
    // window.location.reload();

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
  ngOnInit() {
  this.user =  this.state.selectSnapshot(AuthState.user);
if(this.user.roles.find(x => x.name =='Manager')){
this.roles.manager = true;
}
if(this.user.roles.find(x => x.name =='Collector')){
  this.roles.collector = true;
}
 if(this.user.roles.find(x => x.name =='Driver')){
  this.roles.driver = true;
} 
if(this.user.roles.find(x => x.name =='Office')){
  this.roles.office = true;
}
console.log(this.roles);



// console.log(this.user);
  }
  ionViewDidEnter(){
    this.selectedLang = localStorage.getItem('SELECTED_LANGUAGE')
  }
  logOut(){
    // this.Storage.get('USER_INFO').then(async res=>{
    //   console.log(res);
    //   const ret = await Http.request({
    //     method: 'POST',
    //     url: `${SERVER_URL}/api/users/status`,
    //     headers:{
    //       'Accept':'application/json',
    //       'Content-Type':'application/json',
    //       'Authorization': 'Bearer ' + res.token
    //     },
    //     data:{
    //       status:"Logged Out"
    //     }
    //   });  
    //   this.store.logout();

    //   return ret;

    // })
    this.state.dispatch(new Logout()).subscribe(()=>{
      this.route.navigate(['/login']);
    })
    this.actions.pipe(ofActionDispatched(Logout)).subscribe(() => {
      this.route.navigate(['/login']);
    });
    //  this.route.navigateByUrl('/login');
  }
  async orderBTN(e,route){
    const animation: Animation = this.animationCtrl.create()
    .addElement(e.target)
    .duration(300)
    .keyframes([
      { offset: 0, transform: 'scale(1)' },
      { offset: 0.5, transform: 'scale(0.8)' },
      { offset: 1, transform: 'scale(1)' }
    ]);
    this.hapticsImpactLight();

    await animation.play().then(e=>{
      this.route.navigate([route]);
    });

  }



}
