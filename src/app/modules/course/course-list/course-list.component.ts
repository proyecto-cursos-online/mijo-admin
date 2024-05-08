import { Component } from '@angular/core';
import { CourseService } from '../services/course.service';
import { PageInfoService, PageLink } from 'src/app/_metronic/layout';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent {
  courses: any = [];
  isLoading: any = null;
  search: any = null;
  state: any = null;

  constructor(
    public courseService: CourseService,
    private pageInfo: PageInfoService,
    private toaster: ToastrService,
  ) {
    pageInfo.updateTitle('Cursos');
  }

  ngOnInit(): void {
    this.isLoading = this.courseService.isLoading$;
    this.listCourses();
  }

  listCourses() {
    this.courseService.listCourses(this.search, this.state).subscribe((res: any) => {
      console.log(res);
      this.courses = res.courses.data;
    })
  }

  openModalCreateCourse() {

  }

  clearFilters() {
    this.search = null;
    this.state = 0;
    this.listCourses();
  }

  deleteCourse(course: any) {
    Swal.fire({ // Utiliza SweetAlert para confirmar la eliminación
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminarlo!',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: 'btn btn-danger'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.courseService.deleteCourse(course.id).subscribe((res: any) => {
          let index = this.courses.findIndex((item: any) => item.id == course.id);
          this.courses.splice(index, 1);
          this.toaster.success('Usuario eliminado satisfactoriamente', 'Eliminado');
        });
      }
    });
  }

}
