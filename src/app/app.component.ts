import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { StorageService } from './services/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { LanguageService } from './services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { FcmService } from './services/fcm.service';
import { Store } from '@ngxs/store';
import { AuthState } from './state/auth.state';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  lang:any;
  ltrrtl:any;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private Storage:StorageService,
    private store:Storage,
    private router:Router,
    private translate:TranslateService,
    private languageService:LanguageService,
    private fcm:FcmService,
    private route: ActivatedRoute,
    private state:Store
      ) {
    this.translate.onLangChange.subscribe((event) => {
      this.lang=event.lang;
      if (event.lang == 'ar') {
      this.ltrrtl = 'rtl';
      document.documentElement.setAttribute("style", '--ion-font-family: -apple-system-font, "Cairo", sans-serif');

      }
      else {
        document.documentElement.setAttribute("style", '--ion-font-family: -apple-system-font, "Roboto", "Segoe UI", sans-serif');
      this.ltrrtl = 'ltr';
      }
      document.getElementsByTagName("html")[0].setAttribute('lang', this.lang);
      document.getElementsByTagName("html")[0].setAttribute('dir', this.ltrrtl);
      });
    this.initializeApp();
  }

  initializeApp() {

    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.fcm.initPush();

      
      this.languageService.setInitialAppLanguage();
if(this.languageService.selected == 'ar'){

      document.getElementsByTagName("html")[0].setAttribute('lang',this.languageService.selected);
      document.getElementsByTagName("html")[0].setAttribute('dir', 'rtl');
      document.documentElement.setAttribute("style", '--ion-font-family: -apple-system-font, "Cairo", sans-serif');
      }else{
        document.documentElement.setAttribute("style", '--ion-font-family: -apple-system-font, "Roboto", "Segoe UI", sans-serif');
      }
      const isAuthenticated = this.state.selectSnapshot(AuthState.isAuthenticated);
          if(isAuthenticated){
            this.router.navigateByUrl('home',{replaceUrl:true});
          }
        //   this.store.get('USER_INFO').then((response) => {
        //   let  res = response;
        // if(res){
        //   // this.route.queryParams
        //   // .subscribe(params=>{
        //   //   console.log(params);
    
        //   // console.log(this.router.url);
        //   if(this.router.url == '/'){
        //     if(res.user.role=='Manager'){
        //       this.router.navigateByUrl('/orders/manage',{ replaceUrl: true });

        //     }else{
        //       this.router.navigateByUrl('home',{ replaceUrl: true });

        //     }
        //   }
        // }else{
        //   this.router.navigate(['login']);

        // }
        //   // if(this.router.url == '/'){

          
        // //  if(res.user.role=='Manager'){
        // //       this.router.navigate(['home']);
        // //     }else{
        // //       this.router.navigate(['order']);

        // //     }
        //   });   
       
    });
  }
}
