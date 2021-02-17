import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import  { PhotoService } from '../../../services/photo.service';
import { LoadingController, ModalController } from '@ionic/angular';
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
import { ViewerModalComponent } from 'ngx-ionic-image-viewer';
import { Store } from '@ngxs/store';
import { AuthState } from 'src/app/state/auth.state';

const { Haptics,Http } = Plugins;

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage {
loader:any;
errors:any = []
pilot:any = {image:''};
file:any;
pilotId:any;
format:any;
role:any = {
  manager:false,
driver:false,
collector:false,
office:false
};
  constructor(private translate:TranslateService,private state:Store,public modalController: ModalController,private router:Router,private active: ActivatedRoute,private storage:Storage,private loadingController:LoadingController,private sanitizer : DomSanitizer,private photo:PhotoService) { }


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
       this.pilotId = id;
    this.fetchPilot(id);
  }
  fetchPilot(id){

    let token = this.state.selectSnapshot(AuthState.token);
      const doGet = async () => {
        const ret = await Http.request({
          method: 'GET',
          url: `${SERVER_URL}/api/users/${id}`,
          headers:{
            'Accept':'application/json',
            'Content-Type':'application/json',
            'Authorization': 'Bearer ' + token
          }
        });
        return ret;
      }
      doGet().then(res=>{
    this.pilot = res['data'];
    this.pilot.roles.forEach(role => {
      if(role.name == 'Manager'){
        this.role.manager = true;
      }
      if(role.name == 'Driver'){
        this.role.driver = true;
      }
      if(role.name == 'Collector'){
        this.role.collector = true;
      }
      if(role.name == 'Office'){
        this.role.office = true;
      }
    });
      this.hideLoader();
  })
  }
  async openViewer(src) {
    const modal = await this.modalController.create({
      component: ViewerModalComponent,
      componentProps: {
        src: src
      },
      cssClass: 'ion-img-viewer',
      keyboardClose: true,
      showBackdrop: true
    });
 
    return await modal.present();
  }

  openCamera(){
    this.photo.takePicture().then(res=>{
      console.log(res);
      this.pilot.image = this.sanitizer.bypassSecurityTrustUrl("data:image/png;base64,"+res.url);
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
    name:this.pilot.name,
    phone:this.pilot.phone,
    file:this.file,
    format:this.format,
    role:this.role,
    login_id:this.pilot.login_id,
    
  }
}else{
 data = {
    name:this.pilot.name,
    phone:this.pilot.phone,
    role:this.role,
    login_id:this.pilot.login_id,
    
  }
} 

let token = this.state.selectSnapshot(AuthState.token);

    const doPost = async () => {
      const ret = await Http.request({
        method: 'POST',
        url: `${SERVER_URL}/api/users/update/${this.pilotId}`,
        headers:{
          'Accept':'application/json',
          'Content-Type':'application/json',
          'Authorization': 'Bearer ' + token
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
      this.router.navigate(["/settings/pilots"], navigationExtras);
      }else if(res['status']==422){
        this.errors = res['data']['errors'];
console.log(this.errors);
        }

        
  // this.pilots = res['data'];
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
