import { UsersService } from '@my-qart/users'
import { Component, OnInit } from '@angular/core'
import { ConfirmationService, MessageService } from 'primeng/api'
import { Router } from '@angular/router'
import { interval, lastValueFrom, take } from 'rxjs'
import { User } from '@my-qart/users'

@Component({
  selector: 'admin-users-list',
  templateUrl: './users-list.component.html',
  styles: [],
})
export class UsersListComponent implements OnInit {
  users: User[] = []

  constructor(
    private usersService: UsersService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUsers()
  }

  deleteUser(categoryId: string) {
    async function execute() {
      const source$ = interval(2000).pipe(take(1))
      await lastValueFrom(source$)
    }

    const deleteUse = () => {
      this.usersService.deleteUser(categoryId).subscribe({
        complete: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'User deleted',
            detail: 'User deleted successfully',
          })
          this.getUsers()
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'User deletion failed',
            detail: `User deletion failed: ${error.message}`,
          })
        },
        next: () => {
          execute().then(() => {
            this.messageService.clear()
          })
        },
      })
    }

    this.confirmationService.confirm({
      message: 'Do you want to delete this user?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        deleteUse()
      },
    })
  }

  updateUser(userId: string) {
    this.router.navigateByUrl(`users/form/${userId}`)
  }

  getCountryName(countryCode: string) {
    if (countryCode) {
      return this.usersService.getCountry(countryCode)
    } else return ''
  }

  private getUsers() {
    this.usersService.getUsers().subscribe((users) => {
      this.users = users
    })
  }
}
