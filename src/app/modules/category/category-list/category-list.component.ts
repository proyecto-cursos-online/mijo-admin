import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoryService } from '../services/category.service';
import { ToastrService } from 'ngx-toastr';
import { CategoryAddComponent } from '../category-add/category-add.component';
import { CategoryEditComponent } from '../category-edit/category-edit.component';
import { CategoryDeleteComponent } from '../category-delete/category-delete.component';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent {
  categories: any = [];
  isLoading: any = null;
  search: any = null;
  state: any = 0;

  constructor(
    public modalService: NgbModal,
    public categoryService: CategoryService,
    private toaster: ToastrService,
  ) { }

  ngOnInit(): void {
    this.isLoading = this.categoryService.isLoading$;
    this.listCategories();
  }

  listCategories() {
    this.categoryService.listCategories(this.search, this.state).subscribe((res: any) => {
      this.categories = res.categories.data;
      console.log(this.categories);
      if (!this.categories || this.categories.length === 0) {
        this.toaster.info('No se encontraron datos en la búsqueda', 'Espera');
      }
    },
      (error) => {
        console.error(error);
        this.toaster.error('Ocurrió un problema en el servidor', 'Error');
      }
    );
  }

  clearFilters() {
    this.search = null;
    this.state = 0;
    this.listCategories();
  }

  openModalCreateCategory() {
    const modalRef = this.modalService.open(CategoryAddComponent, { centered: true, size: 'md', scrollable: true });
    modalRef.componentInstance.categories = this.categories.filter((category: any) => !category.category_id );
    modalRef.componentInstance.CategoryC.subscribe((categoryRes: any) => {
      console.log(categoryRes);
      this.categories.unshift(categoryRes);
    });
  }

  editCategory(category: any) {
    const modalRef = this.modalService.open(CategoryEditComponent, { centered: true, size: 'md', scrollable: true });
    modalRef.componentInstance.category = category;
    modalRef.componentInstance.categories = this.categories.filter((category: any) => !category.category_id );
    modalRef.componentInstance.CategoryE.subscribe((categoryRes: any) => {
      console.log(categoryRes);
      let index = this.categories.findIndex((item: any) => item.id == categoryRes.id);
      this.categories[index] = categoryRes;
    });
  }

  deleteCategory(category: any) {
    console.log(category.id);
    const modalRef = this.modalService.open(CategoryDeleteComponent, { centered: true, size: 'md', scrollable: true });
    modalRef.componentInstance.category = category;
    modalRef.componentInstance.CategoryD.subscribe((res: any) => {
      let index = this.categories.findIndex((item: any) => item.id == category.id);
      this.categories.splice(index, 1)
    });
  }
}
