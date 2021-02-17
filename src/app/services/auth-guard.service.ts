import { Injectable } from "@angular/core";
import { Router, CanActivate, ActivatedRouteSnapshot, UrlTree } from "@angular/router";
import { Store } from "@ngxs/store";
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';
import { AuthState } from "../state/auth.state";

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {
  constructor(private storage:StorageService,private state:Store,private router: Router) {}

  // canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    canActivate(route: ActivatedRouteSnapshot) {

  //   if (this.storage.ifLoggedIn()) {
  //     return true;
  // }else {
  //     this.router.navigate(['/login']);
  //     return false;
  // }
// if(this.storage.ifLoggedIn()){
//   return this.storage.isAuthenticatedUser;
// }else{
//   this.router.parseUrl('/login');
// }


const isAuthenticated = this.state.selectSnapshot(AuthState.isAuthenticated);
return isAuthenticated;
    
  }
}