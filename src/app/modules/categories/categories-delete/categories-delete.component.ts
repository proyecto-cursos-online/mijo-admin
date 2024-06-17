import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, catchError, finalize, of } from 'rxjs';
import { CategoriesService } from '../service/categories.service';
import { Toaster } from 'ngx-toast-notifications';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-categories-delete',
  templateUrl: './categories-delete.component.html',
  styleUrls: ['./categories-delete.component.scss']
})
export class CategoriesDeleteComponent implements OnInit {

  @Input() category: any;
  @Output() CategoryD: EventEmitter<any> = new EventEmitter();
  name: any = null;
  isLoading: Observable<boolean>;
  constructor(
    public categoryService: CategoriesService,
    public toaster: Toaster,
    public modal: NgbActiveModal,
  ) { }
  IMAGEN_PREVISUALIZA: any = './assets/media/avatars/300-6.jpg';
  ngOnInit(): void {
    this.isLoading = of(false);
    this.name = this.category.name;
  }

  delete() {
    this.categoryService.deleteCategory(this.category.id).pipe(
      catchError((error) => {
        console.error('Error:', error);
        if (error && error.status === 422 && error.error && error.error.error) {
          this.toaster.open({
            text: error.error.error,
            caption: 'Alerta',
            type: 'warning',
          });
        } else {
          this.toaster.open({
            text: 'No se puede eliminar la categoria',
            caption: 'Alerta',
            type: 'warning',
          });
        }
        return of(null);
      }),
      finalize(() => {
        this.isLoading = of(false);
      })
    )
      .subscribe((resp: any) => {
      
          this.modal.dismiss();
          this.CategoryD.emit(resp.category)
          this.toaster.open({
            text: 'Categoria Eliminada',
            caption: 'Exitoso',
            type: 'primary',
          });

      });
  }
}
