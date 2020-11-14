import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
@Input() title: string;
showSetting:boolean=false;
  constructor(private Storage:StorageService,private store:Storage,private route:Router) { 
        this.store.get('USER_INFO').then((response) => {
        let  res = response;
       if(res.user.role=='Manager'){
        this.showSetting = true;
          }
        });   
  }

  ngOnInit() {
  }

  settings(){
    this.route.navigate(['/settings']);
  }
}
