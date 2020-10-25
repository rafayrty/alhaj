import { Injectable } from "@angular/core";
import { Storage } from '@ionic/storage';
import {  SERVER_URL } from '../../environments/environment';
import '@capacitor-community/http';
import { Plugins } from '@capacitor/core';

const { Http } = Plugins;

@Injectable({
  providedIn: "root"
})
export class DataService {
vehicles: any = [];
 pilots: any = [];
 orders: any = [];

  constructor(private storage:Storage) { }

  filterPilots(searchTerm) {
    return this.pilots.filter(item => {
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

  filterVehicles(searchTerm) {
    return this.vehicles.filter(item => {
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }
    filterOrders(searchTerm) {
    return this.orders.filter(item => {
      return item.client.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }
  fetchPilots(){
    this.storage.get('USER_INFO').then(res=>{
    const doGet = async () => {
      const ret = await Http.request({
        method: 'GET',
        url: `${SERVER_URL}/api/users`,
        headers:{
          'Accept':'application/json',
          'Content-Type':'application/json',
          'Authorization': 'Bearer ' + res.token
        }
      });
      return ret;
    }
    doGet().then(res=>{
      console.log(res);
  this.pilots = res['data'];
})
  })
   
  }
  fetchVehicles(){
    this.storage.get('USER_INFO').then(res=>{
    console.log(res.token);
    const doGet = async () => {
      const ret = await Http.request({
        method: 'GET',
        url: `${SERVER_URL}/api/vehicles`,
        headers:{
          'Accept':'application/json',
          'Content-Type':'application/json',
          'Authorization': 'Bearer ' + res.token
        }
      });
      return ret;
    }
    doGet().then(res=>{
  this.vehicles = res['data'];
})
  })
   
  }
}