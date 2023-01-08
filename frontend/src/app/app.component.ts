import { Component, OnInit } from '@angular/core';
import { Auth } from './_model/auth';
import { AccountService } from './_services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  title = 'frontend';

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser() {
    const user: Auth = JSON.parse(localStorage.getItem('user'));
    this.accountService.setCurrentUser(user);
  }
}
