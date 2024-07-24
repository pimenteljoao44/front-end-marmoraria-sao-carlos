import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';
import { AuthRequest } from 'src/models/interfaces/User/AuthRequest';

@Component({
  selector: 'app-home',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  loginForm = this.formBuilder.group({
    login: ['', Validators.required],
    senha: ['', Validators.required],
  });

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private cookieService: CookieService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.router.navigate(['']);
  }

  onsubmitLoginForm():void {
    if(this.loginForm.value && this.loginForm.valid) {
      this.userService.authUser(this.loginForm?.value as AuthRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next:(response) => {
          if(response) {
            this.router.navigate(['home']);
            this.cookieService.set('USER_INFO', response?.token);
            this.loginForm.reset();
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: `Bem vindo devolta ${response?.nome}`,
              life: 2000,
            });
          }
        },  error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: `Erro ao fazer Login`,
            life: 2000,
          });
          console.log(err);
        },
      })
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
