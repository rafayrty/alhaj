import { Platform } from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import {Storage} from '@ionic/storage';
const LNG_KEY = 'SELECTED_LANGUAGE';
@Injectable({
  providedIn: 'root'
})
export class LanguageService {
selected:string = '';
  constructor(private translate:TranslateService, private storage: Storage, private plt: Platform) { }

  setInitialAppLanguage(){

let language = "ar";
this.translate.setDefaultLang(language);
if(localStorage.getItem(LNG_KEY)){
this.selected = localStorage.getItem(LNG_KEY);
this.translate.use(this.selected)

}else{
  localStorage.setItem(LNG_KEY,language)
  this.selected = language;
}
return this.selected;
}

  setLanguage(lng){
this.translate.use(lng);
this.selected = lng;
localStorage.setItem(LNG_KEY, lng);

// this.set(LNG_KEY,lng)
  }
  
}
