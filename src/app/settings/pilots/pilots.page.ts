import { Component, OnInit } from '@angular/core';
import  '@capacitor-community/http';
import {  SERVER_URL } from '../../../environments/environment';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

import {
  Plugins,
  HapticsImpactStyle,
  Capacitor
} from '@capacitor/core';
const { Haptics,Http } = Plugins;

@Component({
  selector: 'app-pilots',
  templateUrl: './pilots.page.html',
  styleUrls: ['./pilots.page.scss'],
})
export class PilotsPage implements OnInit {
pilots:any = []
loading:boolean = true;
  constructor(private router:Router,private activated:ActivatedRoute,public alertController: AlertController,private storage:Storage) {
    this.activated.queryParams.subscribe(params => {
      if (params && params.reload) {
this.fetchPilots();
      }
    });
   }

  ngOnInit() {
    this.fetchPilots();
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
  hapticsImpactHeavy() {
    this.hapticsImpact(HapticsImpactStyle.Heavy);
  }


  fetchPilots(){
    this.storage.get('USER_INFO').then(res=>{
    console.log(res.token);
    const doGet = async () => {
      const ret = await Http.request({
        method: 'GET',
        url: `${SERVER_URL}/api/users`,
        headers:{
          'Accept':'application/json',
          'Content-Type':'application/json',
          'Authorization': 'Bearer ' + res.token
        }
      });
      return ret;
    }
    doGet().then(res=>{
  this.pilots = res['data'];
    this.loading = false;
})
  })
   
  }
  deleteConfirm(id,index){
    this.hapticsImpactHeavy();
    this.pilots.splice(index);

    this.storage.get('USER_INFO').then(async res=>{

    const ret = await Http.request({
      method: 'GET',
      url: `${SERVER_URL}/api/users/delete/${id}`,
      headers:{
        'Accept':'application/json',
        'Content-Type':'application/json',
        'Authorization': 'Bearer ' + res.token
      }
    });
    return ret;

  });

  }
edit(id){
this.router.navigateByUrl('/settings/pilots/edit/'+id);
}

  async delete(id,index) {
    this.hapticsImpactLight();
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirmation!',
      message: 'Are You Sure You Want To Delete This <strong>Pilot</strong>!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Confirm',
          handler: () => {
            this.deleteConfirm(id,index);

          }
        }
      ]
    });

    await alert.present();
  }
}
