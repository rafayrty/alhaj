import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import  { PhotoService } from '../../services/photo.service';
import { NavController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { IonBackButtonDelegate } from '@ionic/angular';
import { trigger, state, style,query,stagger, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
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
export class CreatePage implements OnInit {
  @ViewChild(IonBackButtonDelegate, { static: false }) backButton: IonBackButtonDelegate;

file:any;
image:any;
step1:boolean = true;
step2:boolean = false;
step3:boolean = false;
title:string='Create A New Order'
  constructor(private platform:Platform,private nav:NavController,private router:Router,private sanitizer : DomSanitizer,private photo:PhotoService) {
    this.platform.backButton.subscribeWithPriority(10, () => {
this.back();
    });
   }

  ngOnInit() {
  }

  openCamera(){
    this.photo.takePicture().then(res=>{
      this.image = this.sanitizer.bypassSecurityTrustUrl(res.url);
      this.file = res.upload;
    });
  }
  next(){
    if(this.step1==true){
      this.title = "Assign A Pilot";
      this.step1 = false;
      this.step2 = true;
      this.step3 = false;

    }else if(this.step2==true){
      this.title = "Assign A Vehicle";

      this.step1 = false;
      this.step2 = false;
      this.step3 = true;

    }
  }
  back(){
    if(this.step3==true){
      this.step1 = false;
      this.step2 = true;
      this.step3 = false;
    }else if(this.step2==true){
      this.step1 = true;
      this.step2 = false;
      this.step3 = false;
    }
    else if(this.step1==true){
      this.nav.back();
      this.step2 = false;
      this.step3 = false;
    }
  }
  send(){
    this.router.navigateByUrl('/orders/confirm', { replaceUrl: true }) 

  }

}
