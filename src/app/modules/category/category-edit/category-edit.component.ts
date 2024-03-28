import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.scss']
})
export class CategoryEditComponent {
  @Output() CategoryE: EventEmitter<any> = new EventEmitter();
  @Input() categories: any = [];
  @Input() category: any = [];

  name: any = null;
  image_prev: any = "./assets/media/avatars/300-6.jpg";
  file_image: any = null;
  isLoading: any;
  state: any = null;
  selected_option: number = 1;
  category_id: any = null;

  constructor(
    public categoryService: CategoryService,
    private toaster: ToastrService,
    public modal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.isLoading = this.categoryService.isLoading$;
    this.category_id = 0;
    this.name = this.category.name;
    this.state = this.category.state;
    this.selected_option = this.category.category_id ? 2 : 1;
    this.image_prev = this.category.photo ? this.category.photo : "./assets/media/avatars/300-6.jpg"; //en el backend se maneja con "photo" y en el frontend "image"
    this.category_id = this.category.category_id;
  }

  processImage($event: any) {
    const file = $event.target.files[0];
    if (!file.type.startsWith("image/")) {
      this.toaster.error('Solamente se aceptan imágenes', 'Error de validación');
      return;
    }
    this.file_image = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.file_image);
    reader.onloadend = () => this.image_prev = reader.result;
  }

  save() {
    if (this.selected_option == 1) {
      if (!this.name) {
        this.toaster.error('Ingrese datos correctos', 'Error de registro');
        return;
      }
    }

    if (this.selected_option == 2) {
      if (!this.name || !this.category_id) {
        this.toaster.error('Ingrese datos correctos', 'Error de registro');
        return;
      }
    }
    let formData = new FormData();
    formData.append("name", this.name);
    formData.append("state", this.state);
    if (this.category_id) {
      formData.append("category_id", this.category_id);
    }
    if (this.file_image) {
      formData.append("image", this.file_image);
    }
    this.categoryService.updateCategory(formData, this.category.id).subscribe(
      (res: any) => {
        this.CategoryE.emit(res.category);
        this.toaster.success('La categoría se actualizó correctamente.', 'Correcto');
        this.modal.dismiss();
      },
      (error) => {
        console.error(error);
        this.toaster.error('Ha ocurrido un error. Por favor, inténtalo de nuevo.', 'Error');
      }
    );
  }

  selectedOption(value: any) {
    this.selected_option = value;
  }
}
