import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
export interface Users {
  username: string;
  password: string;
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token: string;
  public isAuthen = false;
  private tokenTimer: any;
  public isLoad = false;
  public userId: string;
  isAuth = new Subject<boolean>();
  constructor(private http: HttpClient, private router: Router) { }
  addUser(user: Users) {
    this.http.post<{message: string, user: Users}>('http://localhost:3000/api/users/signup', user).subscribe( userData => {
      this.isLoad = false;
      user.id = userData.user.id;
      console.log(userData);
      this.router.navigate(['/login'])
    });
  }
  login(username: string, password: string) {
    const userLogin = {username: username, password: password}
    this.http.post<{token: string, expiresIn: number, id: string}>('http://localhost:3000/api/users/login', userLogin).subscribe( resData => {
      this.isLoad = false
      const token = resData.token;
      this.token = token;
      const timmer = resData.expiresIn;
      const id = resData.id;
      this.userId = id;
      console.log(this.userId);
      console.log(timmer);
      this.autoLogout(timmer);
      if (this.token) {
        this.isAuthen = true;
        this.isAuth.next(true);
        const now = new Date();
        const expiration = new Date(now.getTime() + timmer*1000);
        this.stroage(this.token, expiration, this.userId);
        this.router.navigate(['/posts'])
      }
    })
  }
  logout() {
    this.token = null;
    this.isAuthen = false;
    this.isAuth.next(false);
    this.removeStroage();
    this.userId =null;
    this.router.navigate(['/login']);
    clearTimeout(this.tokenTimer);
  }
  autoLogin() {
    const authData = this.getStorage();
    if (!authData)
    {
      return;
    }
    const now  = new Date();
    const hasExpired = authData.expiration < now
    const expiresIn = authData.expiration.getTime() - now.getTime();
    if (!hasExpired) {
     this.token = authData.token;
     this.isAuthen = true;
     this.userId = authData.id;
     this.autoLogout(expiresIn/1000)
     this.isAuth.next(true);
    }
  }
  autoLogout(timmer: number) {
    this.tokenTimer = setTimeout(() =>{
      this.logout()
    },timmer*1000)
  }
  private stroage(token: any, expiration: Date, userId: string ) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expiration.toISOString());
    localStorage.setItem('id', userId);
  }
  private removeStroage()
  {
    localStorage.removeItem('token')
    localStorage.removeItem('expiration')
    localStorage.removeItem('id');
  }
  private getStorage() {
    const token = localStorage.getItem('token');
    const exp = localStorage.getItem('expiration')
    const id = localStorage.getItem('id');
   if (!token || !exp ) {
     return;
   }
   return {
     token: token,
     expiration: new Date(exp),
     id: id
   }
  }
}
