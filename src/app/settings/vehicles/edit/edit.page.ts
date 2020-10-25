import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import  { PhotoService } from '../../../services/photo.service';
import { LoadingController } from '@ionic/angular';
import  '@capacitor-community/http';
import { Storage } from '@ionic/storage';
import {  SERVER_URL } from '../../../../environments/environment';
import { ActivatedRoute, NavigationExtras,Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import {
  Plugins,
  HapticsImpactStyle,
  Capacitor
} from '@capacitor/core';
import { decimalDigest } from '@angular/compiler/src/i18n/digest';
import { typeWithParameters } from '@angular/compiler/src/render3/util';

const { Haptics,Http } = Plugins;

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage {
loader:any;
errors:any = []
vehicle:any = {image:''};
file:any;
vehicleId:any;
format:any;
  constructor(private translate:TranslateService,private router:Router,private active: ActivatedRoute,private storage:Storage,private loadingController:LoadingController,private sanitizer : DomSanitizer,private photo:PhotoService) { }


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



  ionViewWillEnter() {
    this.presentLoading();
    const id = this.active.snapshot.paramMap.get('id');
       this.vehicleId = id;
    this.fetchVehicle(id);
  }
  fetchVehicle(id){

    this.storage.get('USER_INFO').then(res=>{
      const doGet = async () => {
        const ret = await Http.request({
          method: 'GET',
          url: `${SERVER_URL}/api/vehicles/${id}`,
          headers:{
            'Accept':'application/json',
            'Content-Type':'application/json',
            'Authorization': 'Bearer ' + res.token
          }
        });
        return ret;
      }
      doGet().then(res=>{
    this.vehicle = res['data'];
      this.hideLoader();
  })
    })
  }
  openCamera(){
    this.photo.takePicture().then(res=>{
      console.log(res);
      this.vehicle.image =  this.sanitizer.bypassSecurityTrustUrl("data:image/png;base64,"+res.url);
      this.file = res.upload;
      this.format = res.format;
    });
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
  edit(){
    this.errors = [];
    this.hapticsImpactLight();
  this.presentLoading();
  let data
if(this.file){
   data = {
    name:this.vehicle.name,
    file:this.file,
    format:this.format,
    
  }
}else{
 data = {
    name:this.vehicle.name,    
  }
}
  this.storage.get('USER_INFO').then(res=>{
    const doPost = async () => {
      const ret = await Http.request({
        method: 'POST',
        url: `${SERVER_URL}/api/vehicles/update/${this.vehicleId}`,
        headers:{
          'Accept':'application/json',
          'Content-Type':'application/json',
          'Authorization': 'Bearer ' + res.token
        },
        data:data
      });
      return ret;
    }
    doPost().then(res=>{
      this.hideLoader();

      if(res['status']==200){
        let navigationExtras: NavigationExtras = {
          queryParams: {
            reload:true,
          }
        };
      this.router.navigate(["/settings/vehicles"], navigationExtras);
      }else if(res['status']==422){
        this.errors = res['data']['errors'];
console.log(this.errors);
        }

        
  // this.vehicles = res['data'];
  //   this.loading = false;
})
  })


  }
  hideLoader() {
    if (this.loader != null) {
        this.loader.dismiss();
        this.loader = null;
    }
  }

  

}
