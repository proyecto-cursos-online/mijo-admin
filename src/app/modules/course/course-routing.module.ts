import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseAddComponent } from './course-add/course-add.component';
import { CourseEditComponent } from './course-edit/course-edit.component';
import { CourseListComponent } from './course-list/course-list.component';
import { CourseComponent } from './course.component';

const routes: Routes = [{
  path : '',
  component: CourseComponent,
  children: [
    {
      path : 'registro',
      component: CourseAddComponent,
    },
    {
      path : 'editar/:id',
      component: CourseEditComponent,
    },
    {
      path : 'list',
      component: CourseListComponent,
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseRoutingModule { }
