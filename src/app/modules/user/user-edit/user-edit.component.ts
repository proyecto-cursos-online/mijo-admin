import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  @Input() user: any;

  @Output() UserE: EventEmitter<any> = new EventEmitter();

  name: any = null;
  surname: any = null;
  profession: any = null;
  description: any = null;
  email: any = null;
  password: any = null;
  state: any = 1;
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
    this.name = this.user.name;
    this.surname = this.user.surname;
    this.email = this.user.email;
    this.state = this.user.state;
    this.image_prev = this.user.avatar;
    if (this.user.instructor) {
      this.profession = this.user.instructor.profession;
      this.description = this.user.instructor.description;
    }
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
    // Verificar que los campos obligatorios estén llenos
    if (!this.name || !this.surname || !this.email) {
      this.toaster.error('Ingrese datos correctos', 'Error de registro');
      return;
    }

    // Si se está actualizando la contraseña, verificar que coincida con la confirmación
    if (this.password && this.password !== this.confirm_password) {
      this.toaster.error('Las contraseñas no coinciden', 'Error de registro');
      return;
    }

    // Crear un objeto FormData con los datos del usuario
    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('surname', this.surname);
    formData.append('email', this.email);
    formData.append('state', this.state);
    if (this.password) {
      formData.append('password', this.password);
    }
    if (this.file_avatar) {
      formData.append('image', this.file_avatar);
    }

    // Enviar la solicitud de actualización al servicio UserService
    this.userService.update(formData, this.user.id).subscribe(
      (res: any) => {
        // Manejar la respuesta exitosa del servidor
        console.log(res);
        this.UserE.emit(res.user);
        this.modal.dismiss(); // Cerrar el modal después de la actualización exitosa
        this.toaster.success('Usuario actualizado correctamente', 'Hecho');
      },
      (error) => {
        // Manejar los errores de la solicitud
        console.error(error);
        this.toaster.error('Ha ocurrido un error. Por favor, inténtalo de nuevo.', 'Error');
      }
    );
  }
}
