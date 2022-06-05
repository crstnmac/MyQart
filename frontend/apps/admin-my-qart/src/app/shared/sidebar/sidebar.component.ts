import { Component } from '@angular/core'
import { AuthService } from '@my-qart/users'

@Component({
  selector: 'admin-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  constructor(private authService: AuthService) {}

  logoutUser() {
    this.authService.logOut()
  }
}
