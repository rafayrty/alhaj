import { Component, OnInit } from '@angular/core';
import  '@capacitor-community/http';
import {  SERVER_URL } from '../../../environments/environment';
import { Storage } from '@ionic/storage';
import { AlertController, IonItemSliding } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

import {
  Plugins,
  HapticsImpactStyle,
  Capacitor
} from '@capacitor/core';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { AuthState } from 'src/app/state/auth.state';
const { Haptics,Http } = Plugins;

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.page.html',
  styleUrls: ['./vehicles.page.scss'],
})
export class VehiclesPage implements OnInit {
vehicles:any = []
loading:boolean = true;
  constructor(private state:Store,private translate:TranslateService,private router:Router,private activated:ActivatedRoute,public alertController: AlertController,private storage:Storage) {
    this.activated.queryParams.subscribe(params => {
      if (params && params.reload) {
this.fetchVehicles();
      }
    });
   }
   share(slidingItem: IonItemSliding) {
    
    slidingItem.getOpenAmount().then(res=>{
alert("heyyy");
console.log(res);
      if(res==0){
    slidingItem.open("start");
  
  }else{
    slidingItem.close();
  
  }
  
    })
    }
  ngOnInit() {
    this.fetchVehicles();
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


  fetchVehicles(){
    let token = this.state.selectSnapshot(AuthState.token);
    const doGet = async () => {
      const ret = await Http.request({
        method: 'GET',
        url: `${SERVER_URL}/api/vehicles`,
        headers:{
          'Accept':'application/json',
          'Content-Type':'application/json',
          'Authorization': 'Bearer ' + token
        }
      });
      return ret;
    }
    doGet().then(res=>{
  this.vehicles = res['data'];
    this.loading = false;
})

   
  }
  deleteConfirm(id,index){
    this.hapticsImpactHeavy();
    this.vehicles.splice(index,1);

    this.storage.get('USER_INFO').then(async res=>{

    const ret = await Http.request({
      method: 'GET',
      url: `${SERVER_URL}/api/vehicles/delete/${id}`,
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
this.router.navigateByUrl('/settings/vehicles/edit/'+id);
}

  async delete(id,index) {
    this.hapticsImpactLight();
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: this.translate.instant('ALERTS.title'),
      message:this.translate.instant('ALERTS.vehicles'),
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
            this.deleteConfirm(id,index);

          }
        }
      ]
    });

    await alert.present();
  }
  doRefresh(event) {
    this.fetchVehicles();
      setTimeout(() => {
          event.target.complete();
        }, 2000);
      }
}
