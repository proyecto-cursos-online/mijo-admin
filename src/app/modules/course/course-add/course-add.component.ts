import { Component, OnInit } from '@angular/core';
import { CourseService } from '../services/course.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-course-add',
  templateUrl: './course-add.component.html',
  styleUrls: ['./course-add.component.scss']
})
export class CourseAddComponent implements OnInit {

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

  constructor(
    public courseService: CourseService,
    private toaster: ToastrService,
  ) { }

  ngOnInit(): void {
    this.isLoading = this.courseService.isLoading$;
    this.courseService.listConfig().subscribe((res: any) => {
      console.log(res);
      this.subcategories = res.subcategories;
      this.categories = res.categories;
      this.instructors = res.instructors;
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
    formData.append("image", this.file_image);
    formData.append("instructor_id", this.instructor_id);
    formData.append("requirements", this.requirements);
    formData.append("participants", this.participants);

    this.courseService.registerCourse(formData).subscribe((res: any) => {
      if (res.message == 403) {
        this.toaster.error(res.message_text, 'Error de creación');
      } else {
        this.toaster.success('Se registró correctamente el curso', 'Registro exitoso');
        this.title = '';
        this.subtitle = '';
        this.price_in_soles = 0;
        this.price_in_dollar = 0;
        this.category_id = null;
        this.sub_category_id = null;
        this.description = '';
        this.level = null;
        this.language = null;
        this.file_image = null;
        this.instructor_id = null;
        this.requirements = null;
        this.participants = null;
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
