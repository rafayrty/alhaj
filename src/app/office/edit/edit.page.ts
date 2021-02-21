import { Component, OnInit } from '@angular/core';
import {  SERVER_URL } from '../../../environments/environment';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { trigger, state, style,query,stagger, animate, transition } from '@angular/animations';
import { Store } from '@ngxs/store';
import { AuthState } from 'src/app/state/auth.state';
import '@capacitor-community/http';
import {
  Plugins,
  HapticsImpactStyle,
  Capacitor
} from '@capacitor/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute,Router } from '@angular/router';
const { Haptics,Http } = Plugins;

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
  animations: [
    trigger("enterAnimation", [
      transition(":enter", [
          style({ transform: "translateX(10px)", opacity: 0 }),
            animate(
              ".4s ease",
              style({
                transform: "translateX(0px)",
                opacity: 1
              })
            )
      ]),
      transition(":leave", [
          style({ transform: "translateX(0px)", opacity: 1 }),
            animate(
              ".4s ease-out",
              style({
                transform: "translateX(10px)",
                opacity: 0
              })
            )
      ])
    ])
  ]
})
export class EditPage implements OnInit {
  minDate: String = new Date().toISOString();
  maxDate: any = new Date(new Date().setDate(new Date().getDate() + 10)).toISOString();
  loader: any;
  id:any;
  order:any;
  date:any;
  start_time:any;
  end_time:any;
  receipt:string;
  shipping:any;

  selectedCollector:any;
  selectedVehicle:any;
  selectedDriver:any;
  payment:any;
  errors:any = [];
  constructor(private state:Store,private loadingController:LoadingController,
    private translate:TranslateService,
    private route : ActivatedRoute,
    private nav:NavController,
    private router:Router

    ) { }

  ngOnInit() {
    this.route.paramMap.subscribe( paramMap => {
      this.id = paramMap.get('id');
  })
this.fetchOrder()

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
  fetchOrder(){
    this.presentLoading();

    let token = this.state.selectSnapshot(AuthState.token);
        const doGet = async () => {
          const ret = await Http.request({
            method: 'GET',
            url: `${SERVER_URL}/api/showOrder/${this.id}`,
            headers:{
              'Accept':'application/json',
              'Content-Type':'application/json',
              'Authorization': 'Bearer ' + token
            },
          });
    
          return ret;
        }
        doGet().then(res=>{
          this.hideLoader();

          if(res.data){     
                   this.order = res.data;
              this.date  = this.order.date+'T13:03:33.719+05:00';
              this.start_time = this.order.start_time;
              this.end_time = this.order.end_time;
              this.selectedCollector = this.order.collectors;
              this.selectedVehicle = this.order.vehicles;
              this.selectedDriver = this.order.drivers;
              this.receipt = this.order.receipt;
              this.shipping = this.order.certificate;
              this.payment = this.order.payment;
     
          }else{
            this.order = false;
          }
    
        })
    }

    doRefresh(event) {
      // this.fetchOrder();
    
      // this.fetchOrder();
      this.fetchOrder();  
    
    
    
      setTimeout(() => {
        event.target.complete();
      }, 2000);
    }
    
    hideLoader() {
      if (this.loader != null) {
          this.loader.dismiss();
          this.loader = null;
      }
    }
    back(){
      this.nav.back();
    }

    save(e){
      e.target.innerHTML = '<ion-spinner></ion-spinner>';
      e.target.setAttribute('disabled','disabled');
      let token = this.state.selectSnapshot(AuthState.token);
if(this.payment == 'shipping'){
  this.shipping = true;
}
      let data = {
        receipt:this.receipt,
        payment:this.payment,
        certificate:this.shipping
      }


      const doPost = async () => {
                const ret = await Http.request({
                  method: 'POST',
                  url: `${SERVER_URL}/api/orders/office/save/${this.id}`,
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
                
                e.target.innerHTML =this.translate.instant('save');
                e.target.removeAttribute('disabled');

                if(res['status']==200){
                    this.router.navigateByUrl(`/office`,{replaceUrl:true});
                }else if(res['status']==422){
                  this.errors = res['data'].errors;
                }
          })
    }
  
  
  }
