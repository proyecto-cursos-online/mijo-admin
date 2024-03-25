import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserAddComponent } from '../user-add/user-add.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {

  constructor(
    public modalService: NgbModal
  ) { }

  openModalCreateUser() {
    const modalRef = this.modalService.open(UserAddComponent, {centered: true, size: 'md', scrollable: true});
  }
}
