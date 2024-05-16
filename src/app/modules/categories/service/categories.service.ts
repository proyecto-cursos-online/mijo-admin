import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../auth';
import { BehaviorSubject, Observable, finalize } from 'rxjs';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(private http: HttpClient, public authservice: AuthService) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  listCategories(search:any, state:any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({
      Authorization: 'Bearer' + this.authservice.token,
    });
    let LINK= "?T=";
    if (search) {
      LINK += "&search="+search;
    }if (state) {
      LINK += "&state="+state;
    }
    let URL = URL_SERVICIOS + '/categories'+LINK;

    return this.http
      .get(URL, { headers: headers })
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  registerCategory(data:any){
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'Authorization' : 'Bearer' + this.authservice.token});
    let URL = URL_SERVICIOS+"/categories";
    return this.http.post(URL, data, {
      headers: headers
    }).pipe(
      finalize(()=> this.isLoadingSubject.next(false))
    );
  }
  updateCategory(data:any, category_id:string){
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'Authorization' : 'Bearer' + this.authservice.token});
    let URL = URL_SERVICIOS+"/category/"+category_id;
    return this.http.post(URL, data, {
      headers: headers
    }).pipe(
      finalize(()=> this.isLoadingSubject.next(false))
    );
  }
  deleteCategory(category_id:any){
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'Authorization' : 'Bearer' + this.authservice.token});
    let URL = URL_SERVICIOS+"/categories/" + category_id;
    return this.http.delete(URL, {
      headers: headers
    }).pipe(
      finalize(()=> this.isLoadingSubject.next(false))
    );
  }
}
