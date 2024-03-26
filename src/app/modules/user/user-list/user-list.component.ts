import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserAddComponent } from '../user-add/user-add.component';
import { UserService } from '../services/user.service';
import { UserEditComponent } from '../user-edit/user-edit.component';
import { UserDeleteComponent } from '../user-delete/user-delete.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  users: any = [];
  isLoading: any = null;
  search: any = null;
  state: any = 0;

  constructor(
    public modalService: NgbModal,
    public userService: UserService
  ) { }

  ngOnInit(): void {
    this.isLoading = this.userService.isLoading$;
    this.listUser();
  }

  clearFilters() {
    this.search = null;
    this.state = 0;
    this.listUser();
  }

  openModalCreateUser() {
    const modalRef = this.modalService.open(UserAddComponent, { centered: true, size: 'md', scrollable: true });
    modalRef.componentInstance.UserC.subscribe((userRes: any) => {
      console.log(userRes);
      this.users.unshift(userRes);
    });
  }

  listUser() {
    this.userService.listUsers(this.search, this.state).subscribe((res: any) => {
      this.users = res.users.data;
      console.log(this.users);
    });
  }

  editUser(user: any) {
    const modalRef = this.modalService.open(UserEditComponent, { centered: true, size: 'md', scrollable: true });
    modalRef.componentInstance.user = user;
    modalRef.componentInstance.UserE.subscribe((userRes: any) => {
      console.log(userRes);
      let index = this.users.findIndex((item: any) => item.id == userRes.id);
      this.users[index] = userRes;
    });
  }

  deleteUser(user: any) {
    const modalRef = this.modalService.open(UserDeleteComponent, { centered: true, size: 'md', scrollable: true });
    modalRef.componentInstance.user = user;
    modalRef.componentInstance.UserD.subscribe((userRes: any) => {
      console.log(userRes);
      let index = this.users.findIndex((item: any) => item.id == userRes.id);
      this.users.splice(index, 1)
    });
  }
}
