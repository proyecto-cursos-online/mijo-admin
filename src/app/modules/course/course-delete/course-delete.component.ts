import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, catchError, finalize, of } from 'rxjs';
import { CourseService } from '../service/course.service';
import { Toaster } from 'ngx-toast-notifications';

@Component({
  selector: 'app-course-delete',
  templateUrl: './course-delete.component.html',
  styleUrls: ['./course-delete.component.scss']
})
export class CourseDeleteComponent implements OnInit {
  @Output() CourseD: EventEmitter<any> = new EventEmitter();
  @Input() COURSES: any = null;
  @Input() course: any = null;
  isLoading: Observable<boolean>;
  constructor(
    public modal: NgbActiveModal,
    public courseService: CourseService,
    public toaste: Toaster,
  ) { }

  ngOnInit(): void {
    this.isLoading = this.courseService.isLoading$;
  }
  delete(){
    this.courseService.deleteCourses(this.course.id).pipe(
      catchError((error) => {
        console.error('Error:', error);
        if (error && error.status === 422 && error.error && error.error.error) {
          this.toaste.open({
            text: error.error.error,
            caption: 'Alerta',
            type: 'warning',
          });
        } else {
          this.toaste.open({
            text: 'No se puede eliminar el Curso',
            caption: 'Alerta',
            type: 'warning',
          });
        }
        return of(null);
      }),
      finalize(() => {
        this.isLoading = of(false);
      })
    ).subscribe((resp:any)=>{
      this.modal.dismiss();
      console.log(resp.course)
      this.CourseD.emit(resp.course)
      this.toaste.open({
        text: 'Categoria Eliminada',
        caption: 'Exitoso',
        type: 'primary',
      });
      this.modal.dismiss()
    })
  }

}
