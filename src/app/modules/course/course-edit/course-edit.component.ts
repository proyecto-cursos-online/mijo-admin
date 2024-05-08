import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { CourseService } from '../services/course.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { PageInfoService } from 'src/app/_metronic/layout';

@Component({
  selector: 'app-course-edit',
  templateUrl: './course-edit.component.html',
  styleUrls: ['./course-edit.component.scss']
})
export class CourseEditComponent implements AfterViewInit {
  subcategories: any = null;
  subcategories_back: any = null;
  categories: any = null;
  instructors: any = null;
  isLoading: any = null;
  file_image: any = null;
  image_prev: any = null;
  text_requirement: any = null;
  text_participant: any = null;
  requirements: any = [];
  participants: any = [];
  title: string = '';
  subtitle: string = '';
  price_in_soles: number = 0;
  price_in_dollar: number = 0;
  description: string = 'Vamos!';
  category_id: any = 0;
  sub_category_id: any = 0;
  instructor_id: any = 0;
  level: any = 0;
  language: any = 0;
  course_id: any = null;
  course_selected: any = null;

  constructor(
    public courseService: CourseService,
    private toaster: ToastrService,
    public activatedRoute: ActivatedRoute,
    private pageInfo: PageInfoService,
  ) {
  }

  ngAfterViewInit(): void {
    this.pageInfo.updateTitle('Editar Curso');
  }

  ngOnInit(): void {
    this.pageInfo.updateTitle('Editar Curso');
    this.isLoading = this.courseService.isLoading$;
    this.courseService.listConfig().subscribe((res: any) => {
      this.subcategories = res.subcategories;
      this.categories = res.categories;
      this.instructors = res.instructors;
      this.showCourse(this.course_id);
    });
    this.activatedRoute.params.subscribe((res: any) => {
      this.course_id = res.id
    });
  }

  showCourse(id: any) {
    this.courseService.showCourse(id).subscribe((res: any) => {
      this.course_selected = res.course;
      this.title = this.course_selected.title;
      this.subtitle = this.course_selected.subtitle;
      this.price_in_soles = this.course_selected.price_in_soles;
      this.price_in_dollar = this.course_selected.price_in_dollar;
      this.category_id = this.course_selected.category_id;
      this.selectCategory({target: {value: this.category_id}});
      this.sub_category_id = this.course_selected.sub_category_id;
      this.description = this.course_selected.description;
      this.level = this.course_selected.level;
      this.language = this.course_selected.language;
      this.image_prev = this.course_selected.backgroud_image;
      this.instructor_id = this.course_selected.instructor_id;
      this.requirements = this.course_selected.requirements;
      this.participants = this.course_selected.participant;     
    });
  }

  onChange(event: any) {
    this.description = event.editor.getData();
  }

  addRequirement(event: any) {
    if (!this.text_requirement.trim()) {
      this.toaster.info("Necesitas ingresar un requerimiento", "Faltan datos");
      return;
    }
    this.requirements.push(this.text_requirement);
    this.text_requirement = "";
  }

  addParticipant(event: any) {
    if (!this.text_participant) {
      this.toaster.info("Necesitas ingresar un participante", "Faltan datos");
      return;
    }

    this.participants.push(this.text_participant);
    this.text_participant = "";
  }

  removeRequirement(index: any) {
    this.requirements.splice(index, 1);
  }

  removeParticipant(index: any) {
    this.participants.splice(index, 1);
  }

  save() {
    console.log(this.title,
      this.subtitle,
      this.price_in_soles,
      this.price_in_dollar,
      this.category_id,
      this.sub_category_id);

    if (
      !this.title ||
      !this.subtitle ||
      !this.price_in_soles ||
      !this.price_in_dollar ||
      !this.category_id ||
      !this.sub_category_id
    ) {
      this.toaster.error('Ingresa datos correctamente', 'Error de validación');
      return;
    }
    let formData = new FormData();
    formData.append("title", this.title);
    formData.append("subtitle", this.subtitle);
    formData.append("price_in_soles", this.price_in_soles + "");
    formData.append("price_in_dollar", this.price_in_dollar + "");
    formData.append("category_id", this.category_id);
    formData.append("sub_category_id", this.sub_category_id);
    formData.append("description", this.description);
    formData.append("level", this.level);
    formData.append("language", this.language);
    if (this.file_image) {
      formData.append("image", this.file_image);
    }
    formData.append("instructor_id", this.instructor_id);
    formData.append("requirements", this.requirements);
    formData.append("participants", this.participants);

    this.courseService.updateCourse(formData, this.course_id).subscribe((res: any) => {
      if (res.message == 403) {
        this.toaster.error(res.message_text, 'Error de creación');
      } else {
        this.toaster.success('El curso se modificó correctamente', 'Actualización exitosa');
      }
    });
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
    this.courseService.isLoadingSubject.next(true)
    setTimeout(() => {
      this.courseService.isLoadingSubject.next(false)
    }, 50);
  }

  selectCategory($event: any) {
    let value = $event.target.value;
    this.subcategories_back = this.subcategories.filter((item: any) => item.category_id == value);
    console.log(value);
  }
}
