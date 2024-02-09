import { Component, OnInit } from '@angular/core';
import { AuthPage, AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  currentComponent!: AuthPage;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentComponent$.subscribe((value) => {
      this.currentComponent = value;
    });
  }
}
