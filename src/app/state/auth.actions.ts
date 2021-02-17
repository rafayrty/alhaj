export class Login {
    static readonly type = '[Auth] Login';
    constructor(public payload: { token: string;user:any }) {}
  }
  export class Logout {
    static readonly type = '[Auth] Logout';
  }