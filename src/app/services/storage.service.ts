import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { ToastController, Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { SERVER_URL } from 'src/environments/environment';
import '@capacitor-community/http';
import {
  Plugins,
  HapticsImpactStyle,
  Capacitor
} from '@capacitor/core';
const { Haptics,Http } = Plugins;

@Injectable()
export class StorageService {

  // authState = new BehaviorSubject(false);
  // authState: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  isAuthenticatedUser: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  constructor(
    private router: Router,
    private storage: Storage,
    private platform: Platform,
    public toastController: ToastController
  ) {
    this.platform.ready().then(() => {
      this.ifLoggedIn();
    });
  }
  async getInfo(){
     let res = "";
    this.storage.get('USER_INFO').then((response) => {
    res = response;

    });
    return res;
    }
    
    ifLoggedIn() {
      this.storage.get('USER_INFO').then((response) => {
        if (response) {
          this.isAuthenticatedUser.next(true);
        }
      });
      return this.isAuthenticatedUser.value;

    }
  
  
    login(data):  Observable<boolean> {
      this.storage.set('USER_INFO', data).then((response) => {
        this.isAuthenticatedUser.next(true);
        if(response.user.role=='Manager'){
          this.router.navigateByUrl('/orders/manage',{replaceUrl:true});

        }else{
          this.router.navigateByUrl('home',{replaceUrl:true});
        }
        return response;

      });
      return this.isAuthenticatedUser;
    }
  
    logout() {
      this.storage.remove('USER_INFO').then((response) => {
if(response==undefined){
  this.isAuthenticatedUser.next(false);
   window.location.reload();
  // this.router.navigate(['login'],{replaceUrl:true});
}

       
      });

    
    }
  




}