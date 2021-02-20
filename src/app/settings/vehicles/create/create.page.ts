import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import  { PhotoService } from '../../../services/photo.service';
import { LoadingController } from '@ionic/angular';
import '@capacitor-community/http';
import { Storage } from '@ionic/storage';
import {  SERVER_URL } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

import {
  Plugins,
  HapticsImpactStyle,
  Capacitor
} from '@capacitor/core';
import { decimalDigest } from '@angular/compiler/src/i18n/digest';
import { NavigationExtras,Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthState } from 'src/app/state/auth.state';

const { Haptics,Http } = Plugins;

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {
image:any;
file:any;
name:any = "";
loader:any;
format:any;
errors:any = []
  constructor(private state:Store,private translate:TranslateService,private router:Router,private http:HttpClient,private storage:Storage,private loadingController:LoadingController,private sanitizer : DomSanitizer,private photo:PhotoService) { }


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
  }
  openCamera(){
    this.photo.takePicture().then(res=>{
      console.log(res);
      this.image = this.sanitizer.bypassSecurityTrustUrl("data:image/png;base64,"+res.url);
      this.file = res.upload;
      this.format = res.format
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
  insert(){
    this.hapticsImpactLight();
  this.presentLoading();


  let token = this.state.selectSnapshot(AuthState.token);
  const doPost = async () => {
      const ret = await Http.request({
        method: 'POST',
        url: `${SERVER_URL}/api/vehicles`,
        headers:{
          'Accept':'application/json',
          'Content-Type':'application/json',
          'Authorization': 'Bearer ' + token
        },
        data:{
          name:this.name,
          file:this.file,
          format:this.format
        }
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
        this.errors = res['data'].errors;

        }

        
  // this.vehicles = res['data'];
  //   this.loading = false;
})



  }
  hideLoader() {
    if (this.loader != null) {
        this.loader.dismiss();
        this.loader = null;
    }
  }

  

}
