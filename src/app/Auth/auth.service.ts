import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

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
  isAuth = new Subject<boolean>();
  constructor(private http: HttpClient) { }
  addUser(user: Users) {
    this.http.post<{message: string, user: Users}>('http://localhost:3000/api/users/signup', user).subscribe( userData => {
      user.id = userData.user.id;
      console.log(userData);
    });
  }
  login(username: string, password: string) {
    const userLogin = {username: username, password: password}
    this.http.post<{token: string}>('http://localhost:3000/api/users/login', userLogin).subscribe( resData => {
      console.log(resData);
      const token = resData.token;
      this.token = token;
      this.isAuth.next(true);
    })
  }
}
