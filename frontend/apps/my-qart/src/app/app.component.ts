import {Component, OnInit} from '@angular/core'
import {UsersService} from "@my-qart/users";

@Component({
  selector: 'my-qart-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'my-qart'
  constructor(private userService: UsersService) {

  }

  ngOnInit() {
    this.userService.initAppSession();
  }

}
