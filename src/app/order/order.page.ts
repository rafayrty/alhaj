import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import {  SERVER_URL } from '../../environments/environment';
import { Storage } from '@ionic/storage';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { AlertController, ModalController } from '@ionic/angular';
import { ViewerModalComponent } from 'ngx-ionic-image-viewer';

import {
  Plugins,
  HapticsImpactStyle,
  Capacitor
} from '@capacitor/core';
const { Http,Haptics } = Plugins;
@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
  animations: [
    trigger(
      'inOutAnimation', 
      [
        transition(
          ':enter', 
          [
            style({ opacity: 0 }),
            animate('.3s ease-out', 
                    style({  opacity: 1 }))
          ]
        ),
        transition(
          ':leave', 
          [
            style({ opacity: 1 }),
            animate('.3s ease-in', 
                    style({opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class OrderPage implements OnInit {
order:any = false;
  constructor(public modalController: ModalController,public alertController: AlertController, private callNumber: CallNumber,private store:StorageService,private storage:Storage) { }


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

  ngOnInit() {
    this.fetchOrder();
  }
  logOut(){
    this.store.logout();
    this.storage.get('USER_INFO').then(res=>{
      const doGet = async () => {
        const ret = await Http.request({
          method: 'GET',
          url: `${SERVER_URL}/api/users/status`,
          headers:{
            'Accept':'application/json',
            'Content-Type':'application/json',
            'Authorization': 'Bearer ' + res.token
          },
          data:{
            status:status
          }
        });  
        return ret;
      }
doGet().then(res=>{
  console.log(res);
})
    });

   //  this.route.navigateByUrl('/login');
 }
 call(num){
   this.hapticsImpactHeavy();
  // let tel_number = num;
  // window.open(`tel:${tel_number}`, '_system')
  this.callNumber.callNumber(num, true)
.then(res => console.log('Launched dialer!', res))
.catch(err => console.log('Error launching dialer', err));
}
confirmStatus(e,status,id){
  e.target.innerHTML = '<ion-spinner></ion-spinner>';
  e.target.setAttribute('disabled','disabled');


  this.storage.get('USER_INFO').then(res=>{
    const doGet = async () => {
      const ret = await Http.request({
        method: 'POST',
        url: `${SERVER_URL}/api/orders/status/${id}`,
        headers:{
          'Accept':'application/json',
          'Content-Type':'application/json',
          'Authorization': 'Bearer ' + res.token
        },
        data:{
          status:status
        }
      });
      console.log(ret);

      return ret;
    }
    doGet().then(res=>{
      if(res){
        if(status=='Shipped'){
          e.target.innerHTML = ' <ion-icon name="paper-plane-sharp"></ion-icon> <span>Mark as shipped </span>';
          e.target.removeAttribute('disabled');
        }else{
          e.target.innerHTML = '<ion-icon name="checkmark-done-outline"></ion-icon> <span>Mark as Delivered </span>';
          e.target.removeAttribute('disabled');
        }
      }
      if(res.data){
        this.order = res.data;
      }else{
        this.order = false;
      }

    })
  });

}
async updateStatus(e,status,id) {
  const alert = await this.alertController.create({
    cssClass: 'my-custom-class',
    header: 'Confirmation!',
    message: `Are you sure you want to mark this order as ${status} ?`,
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
          this.confirmStatus(e,status,id);
        }
      }
    ]
  });

  await alert.present();
}
 fetchOrder(){
   
  this.storage.get('USER_INFO').then(res=>{
    const doGet = async () => {
      const ret = await Http.request({
        method: 'GET',
        url: `${SERVER_URL}/api/orders/user/${res.user.id}`,
        headers:{
          'Accept':'application/json',
          'Content-Type':'application/json',
          'Authorization': 'Bearer ' + res.token
        },
      });
      console.log(ret);

      return ret;
    }
    doGet().then(res=>{
      if(res.data){
        this.order = res.data;
      }else{
        this.order = false;
      }

    })
  });
  }
 }


