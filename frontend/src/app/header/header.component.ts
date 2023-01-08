import { Component, OnInit } from '@angular/core';
import { Auth } from '../_model/auth';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  model: any = {};
  constructor(public accountService: AccountService) { }

  ngOnInit(): void {
  }

  login() {
    this.accountService.login(this.model).subscribe((response) => {
      
    }, err => {
      console.log(err);
    });
  }

  logout() {
    this.accountService.logout();
  }

}
