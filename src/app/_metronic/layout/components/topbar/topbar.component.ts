import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../core/layout.service';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/modules/auth';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {
  user$: Observable<any>;
  toolbarButtonMarginClass = 'ms-1 ms-lg-3';
  toolbarButtonHeightClass = 'w-30px h-30px w-md-40px h-md-40px';
  toolbarUserAvatarHeightClass = 'symbol-30px symbol-md-40px';
  toolbarButtonIconSizeClass = 'svg-icon-1';
  headerLeft: string = 'menu';
  
  constructor(private layout: LayoutService, public auth: AuthService) { }

  ngOnInit(): void {
    this.user$ = this.auth.currentUserSubject.asObservable();
    this.headerLeft = this.layout.getProp('header.left') as string;
    console.log(this.auth.user)
  }
}
