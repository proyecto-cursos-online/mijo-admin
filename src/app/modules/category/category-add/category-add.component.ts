import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-category-add',
  templateUrl: './category-add.component.html',
  styleUrls: ['./category-add.component.scss']
})
export class CategoryAddComponent {
  @Output() CategoryC: EventEmitter<any> = new EventEmitter();
  @Input() categories: any = [];

  name: any = null;
  image_prev: any = "./assets/media/avatars/300-6.jpg";
  file_image: any = null;
  isLoading: any;
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
      if (!this.name || !this.file_image) {
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
    if (this.category_id) {
      formData.append("category_id", this.category_id);
    }
    if (this.file_image) {
      formData.append("image", this.file_image);
    }
    this.categoryService.registerCategory(formData).subscribe(
      (res: any) => {
        this.CategoryC.emit(res.category);
        this.toaster.success('La categoría se registró correctamente.', 'Bien');
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
