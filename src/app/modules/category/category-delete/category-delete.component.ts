import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-category-delete',
  templateUrl: './category-delete.component.html',
  styleUrls: ['./category-delete.component.scss']
})
export class CategoryDeleteComponent {
  @Input() category: any;
  @Output() CategoryD: EventEmitter<any> = new EventEmitter();

  isLoading: any;

  constructor(
    public categoryService: CategoryService,
    private toaster: ToastrService,
    public modal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.isLoading = this.categoryService.isLoading$;
  }

  deleteCategory() {
    this.categoryService.deleteCategory(this.category.id).subscribe((res: any) => {
      this.CategoryD.emit("");
      this.modal.dismiss();
      this.toaster.success('Categoría eliminada satisfactoriamente', 'Eliminado');
    })
  }
}
