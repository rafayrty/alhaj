import { Injectable } from "@angular/core";
import { Storage } from '@ionic/storage';
import {  SERVER_URL } from '../../environments/environment';
import '@capacitor-community/http';
import { Plugins } from '@capacitor/core';
import { Store } from "@ngxs/store";
import { AuthState } from "../state/auth.state";

const { Http } = Plugins;

@Injectable({
  providedIn: "root"
})
export class DataService {
vehicles: any = [];
 drivers: any = [];
 orders: any = [];

  constructor(private state:Store,private storage:Storage) { }

  
  filterDrivers(searchTerm) {
    return this.drivers.filter(item => {
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

  filterVehicles(searchTerm)  {
    return this.vehicles.filter(item => {
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }
    filterOrders(searchTerm) {
    return this.orders.filter(item => {
      return item.client.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }
  fetchDrivers(){
    let token = this.state.selectSnapshot(AuthState.token);
    const doGet = async () => {
      const ret = await Http.request({
        method: 'GET',
        url: `${SERVER_URL}/api/drivers`,
        headers:{
          'Accept':'application/json',
          'Content-Type':'application/json',
          'Authorization': 'Bearer ' + token
        }
      });
      return ret;
    }
    doGet().then(res=>{
      console.log(res);
  this.drivers = res['data'];
})
   
  }
  fetchVehicles(){
    let token = this.state.selectSnapshot(AuthState.token);
    const doGet = async () => {
      const ret = await Http.request({
        method: 'GET',
        url: `${SERVER_URL}/api/vehicles`,
        headers:{
          'Accept':'application/json',
          'Content-Type':'application/json',
          'Authorization': 'Bearer ' + token
        }
      });
      return ret;
    }
    doGet().then(res=>{
  this.vehicles = res['data'];
})
   
  }
}