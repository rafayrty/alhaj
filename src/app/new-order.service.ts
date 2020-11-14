import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NewOrderService {
orderExists:boolean=false;
  constructor() { }
}
