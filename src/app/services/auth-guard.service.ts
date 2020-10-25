import { Injectable } from "@angular/core";
import { Router, CanActivate, ActivatedRouteSnapshot } from "@angular/router";
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: "root"
})
export class AuthGuardService implements CanActivate {
  constructor(private storage:StorageService,private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
      if(!this.storage.isAuthenticated()){
        this.router.navigateByUrl('/login');
      }else{
        return this.storage.isAuthenticated();

      }

    
  }
}