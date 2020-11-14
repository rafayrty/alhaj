import { Injectable } from "@angular/core";
import { Router, CanActivate, ActivatedRouteSnapshot, UrlTree } from "@angular/router";
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {
  constructor(private storage:StorageService,private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
  //   if (this.storage.ifLoggedIn()) {
  //     return true;
  // }else {
  //     this.router.navigate(['/login']);
  //     return false;
  // }
if(this.storage.ifLoggedIn()){
  return this.storage.isAuthenticatedUser;
}else{
  this.router.parseUrl('/login');
}
    
  }
}