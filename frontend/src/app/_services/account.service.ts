import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Auth } from '../_model/auth';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl = 'http://localhost:4000/api/v1/';
  private currentUserSource = new ReplaySubject<Auth>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) { }

  login(model: any) {
    return this.http.post(this.baseUrl +'login', model).pipe(
      map((response: Auth) => {
        const user = response;
        if(user) {
          const userSession = {
            token: response.token,
            name: response.user.name
          }
          localStorage.setItem('user', JSON.stringify(userSession));
          this.currentUserSource.next(user);
        }
      })
    );
  }

  setCurrentUser(user: Auth) {
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }
}
