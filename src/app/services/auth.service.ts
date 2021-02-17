import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import {  SERVER_URL } from '../../environments/environment';
import { FcmService } from '../services/fcm.service';

const { Http } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private fcm:FcmService) { }


   async login(data){

     const ret = await Http.request({
      method: 'POST',
      url: `${SERVER_URL}/api/token`,
      headers:{
        'Accept':'application/json',
        'Content-Type':'application/json',
      },
      data: {
        login_id: data,
        fcm:this.fcm.token
      }
    });

    return  ret ;

  }
}
