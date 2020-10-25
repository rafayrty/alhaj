import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { StorageService } from './services/storage.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { LanguageService } from './services/language.service';
import { TranslateService } from '@ngx-translate/core';

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
    private languageService:LanguageService
  ) {
    this.translate.onLangChange.subscribe((event) => {
      this.lang=event.lang;
      if (event.lang == 'ar') {
      this.ltrrtl = 'rtl';
      }
      else {
      this.ltrrtl = 'ltr';
      }
      document.getElementsByTagName("html")[0].setAttribute('lang', this.lang);
      document.getElementsByTagName("body")[0].setAttribute('dir', this.ltrrtl);
      });
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.languageService.setInitialAppLanguage();
if(this.languageService.selected == 'ar'){

      document.getElementsByTagName("html")[0].setAttribute('lang',this.languageService.selected);
      document.getElementsByTagName("body")[0].setAttribute('dir', 'rtl');

      }
      this.Storage.authState.subscribe(state => {
        if (state) {
          this.store.get('USER_INFO').then((response) => {
          let  res = response;
         if(res.user.role=='Manager'){
              this.router.navigate(['home']);
            }else{
              this.router.navigate(['order']);

            }
          });   
        } else {
          this.router.navigate(['login']);
        }
      });
    });
  }
}
