import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
  Capacitor
} from '@capacitor/core';
import { Router } from '@angular/router';
import '@capacitor-community/http';
import {  SERVER_URL } from '../../environments/environment';

const { PushNotifications,Http } = Plugins;
 
@Injectable({
  providedIn: 'root'
})
export class FcmService {
 token:any;
notify:any;
 constructor(private storage:Storage,public alertController: AlertController,private router: Router) { }
 
  initPush() {
    if (Capacitor.platform !== 'web') {
      this.registerPush();
    }

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
  private registerPush() {
    PushNotifications.requestPermission().then((permission) => {
      if (permission.granted) {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // No permission for push granted
      }
    });
 
    PushNotifications.addListener(
      'registration',
      (token: PushNotificationToken) => {
        this.token = token.value;
        console.log(this.token);
if(Capacitor.platform == 'android'){
    this.storage.get('USER_INFO').then(res=>{
      const doPost = async () => {
      const ret = await Http.request({
      method: 'POST',
      url: `${SERVER_URL}/api/users/fcm`,
      headers:{
        'Accept':'application/json',
        'Content-Type':'application/json',
        'Authorization': 'Bearer ' + res.token
      },
      data: {
        token: this.token,
      }
    });
    return ret;
  }

  doPost().then(res=>{
    console.log(res);
  })
});
}
      }
    );
 
    PushNotifications.addListener('registrationError', (error: any) => {
      alert('Error: ' + JSON.stringify(error));
    });
 
    PushNotifications.addListener(
      'pushNotificationReceived',
      async (notification: PushNotification) => {

this.notify = notification;
const data = notification.data;
if(data.role=='Manager'){
  var audio = new Audio('/assets/sound.mp3');
  audio.play();
  this.presentAlert(this.notify.title,this.notify.body);

}else{
  // if(this.router.url!='/order'){
 
  // }
  if(data.type=='normal'){
    if(this.router.url=='/order'){
      this.router.navigate(['home/1'],{replaceUrl:true});
    }else{
      var audio = new Audio('/assets/sound.mp3');
      audio.play();
      this.presentAlert(this.notify.title,this.notify.body);
    }
  }else{
    var audio = new Audio('/assets/sound.mp3');
    audio.play();
    this.presentAlert(this.notify.title,this.notify.body);

  }

  // this.router.navigate(['/order'],{replaceUrl:true});
}
        // console.log('Push received: ' + JSON.stringify(notification));
      }
    );
  //   PushNotifications.addListener('pushNotificationActionPerformed',
  //   (notification: PushNotificationActionPerformed) => {
  //     alert('Push action performed: ' + JSON.stringify(notification));
  //      const data = notification.notification.data;

  //     if(data.role=='Manager'){
  //             this.router.navigateByUrl('/orders/manage');
  //           }
  //   }
  // );
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      async (notification: PushNotificationActionPerformed) => {
        const data = notification.notification.data;
        if(data.role=='Manager'){
          this.router.navigateByUrl('/orders/manage');
        }else{
          this.router.navigateByUrl('/order');

        }
        // console.log('Action performed: ' + JSON.stringify(notification.notification));
        // if (data.detailsId) {
        //   this.router.navigateByUrl(`/home/${data.detailsId}`);
        // }
      }
    );
  }
}