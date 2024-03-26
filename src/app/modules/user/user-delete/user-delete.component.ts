import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-delete',
  templateUrl: './user-delete.component.html',
  styleUrls: ['./user-delete.component.scss']
})
export class UserDeleteComponent implements OnInit {
  @Input() user: any;
  @Output() UserD: EventEmitter<any> = new EventEmitter();

  isLoading: any;

  constructor(
    public userService: UserService,
    private toaster: ToastrService,
    public modal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.isLoading = this.userService.isLoading$;
  }


  delete() {
    this.userService.delete(this.user.id).subscribe((res: any) => {
      this.UserD.emit("");
      this.modal.dismiss();
      this.toaster.success('Usuario eliminado satisfactoriamente', 'Eliminado');
    })
  }
}
