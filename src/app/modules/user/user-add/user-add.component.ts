import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent implements OnInit {

  @Output() UserC: EventEmitter<any> = new EventEmitter();

  name: any = null;
  surname: any = null;
  email: any = null;
  password: any = null;
  confirm_password: any = null;
  image_prev: any = "./assets/media/avatars/300-6.jpg";
  file_avatar: any = null;
  isLoading: any;

  constructor(
    public userService: UserService,
    private toaster: ToastrService,
    public modal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.isLoading = this.userService.isLoading$;
  }

  processAvatar($event: any) {
    const file = $event.target.files[0];
    if (!file.type.startsWith("image/")) {
      this.toaster.error('Solamente se aceptan imágenes', 'Error de validación');
      return;
    }
    this.file_avatar = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.file_avatar);
    reader.onloadend = () => this.image_prev = reader.result;
  }

  save() {
    if (
      !this.name ||
      !this.surname ||
      !this.email ||
      !this.password ||
      !this.confirm_password ||
      !this.file_avatar
    ) {
      this.toaster.error('Ingrese datos correctos', 'Error de registro');
      return;
    }
    if (this.password != this.confirm_password) {
      this.toaster.error('Las contraseñas son incorrectas', 'Error de registro');
      return;
    }
    let formData = new FormData();
    formData.append("name", this.name);
    formData.append("surname", this.surname);
    formData.append("email", this.email);
    formData.append("password", this.password);
    formData.append("role_id", '1');
    formData.append("type_user", '2');
    formData.append("image", this.file_avatar);
    this.userService.register(formData).subscribe(
      (res: any) => {
        this.UserC.emit(res.user);
        console.log(res);
        console.log(formData.get("image"));
        this.modal.dismiss();
      },
      (error) => {
        console.error(error);
        this.toaster.error('Ha ocurrido un error. Por favor, inténtalo de nuevo.', 'Error');
      }
    );
  }
}
