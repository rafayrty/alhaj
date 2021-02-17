import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { AuthService } from "../services/auth.service";
import { Login,Logout } from "./auth.actions";
import { AuthStateModel } from "./auth.model";
import {map,tap} from 'rxjs/operators';
import { HttpResponse } from "@capacitor-community/http";


  @State<AuthStateModel>({
    name: 'auth',
    defaults: {
      token: null,
      user: null,

    }
  })
  @Injectable()
  export class AuthState {
    @Selector()
    static token(state: AuthStateModel): string | null {
      return state.token;
    }
  
    @Selector()
    static isAuthenticated(state: AuthStateModel): boolean {
      return !!state.token;
    }
      
    @Selector()
    static user(state: AuthStateModel): any {
      return state.user;
    }
 
  
    constructor(private authService: AuthService) {}


    @Action(Login)
    login(ctx: StateContext<AuthStateModel>, action: Login) {
        // console.log("From Store",action.payload);
          ctx.patchState({
            token: action.payload.token,
            user: action.payload.user
          });
    }
  
    @Action(Logout)
    logout(ctx: StateContext<AuthStateModel>) {
        console.log("Action Called",ctx);
      const state = ctx.getState();
          ctx.setState({
            token: null,
            user: null
          });
    }
  }