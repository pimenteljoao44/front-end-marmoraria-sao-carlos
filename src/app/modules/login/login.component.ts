import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';
import { AuthRequest } from 'src/models/interfaces/User/AuthRequest';
import { jwtDecode } from 'jwt-decode'; // Importar jwtDecode

@Component({
  selector: 'app-home',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  displayForgotPasswordDialog: boolean = false;
  loading: boolean = false;
  loadingForgotPassword: boolean = false;

  loginForm = this.formBuilder.group({
    login: ['', Validators.required],
    senha: ['', Validators.required],
  });

  forgotPasswordForm = this.formBuilder.group({
    email: ['', Validators.required],
  });

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private cookieService: CookieService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    //this.router.navigate(['']);
  }

  onsubmitLoginForm(): void {
    if (this.loginForm.value && this.loginForm.valid) {
      this.loading = true;
      this.userService
        .authUser(this.loginForm.value as AuthRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              // Defina o token
              this.cookieService.set('USER_INFO', response.token, {
                path: '/',
                expires: 1,
              });

              // Decodificar o token para obter o nível de acesso
              let nivelAcesso: string | null = null;
              try {
                const decodedToken: any = jwtDecode(response.token);
                nivelAcesso = decodedToken.nivelAcesso;
              } catch (error) {
                console.error('Erro ao decodificar o token JWT após o login:', error);
              }

              setTimeout(() => {
                // Navegue após garantir que o cookie foi salvo
                this.loginForm.reset();
                this.messageService.add({
                  severity: 'success',
                  summary: 'Sucesso',
                  detail: `Bem-vindo de volta ${response.nome}`,
                  life: 2000,
                });

                // Lógica de redirecionamento baseada no nível de acesso
                if (nivelAcesso === 'ADMIN' || nivelAcesso === 'GERENTE') {
                  this.router.navigate(['dashboard'], { replaceUrl: true });
                } else if (nivelAcesso === 'FUNCIONARIO') {
                  this.router.navigate(['home/welcome'], { replaceUrl: true });
                } else {
                  // Redirecionamento padrão caso o nível de acesso não seja reconhecido
                  this.router.navigate(['home'], { replaceUrl: true });
                }
              }, 100);
            }
            this.loading = false;
          },
          error: (err) => {
            this.loading = false;
            this.cookieService.delete('USER_INFO', '/');
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: err.error?.message || err.message || 'Não encontramos nenhum usuário com essas credenciais',
              life: 4000,
            });
            console.log(err);
          },
        });
    }
  }

  showForgotPasswordDialog(): void {
    this.displayForgotPasswordDialog = true;
  }

  hideForgotPasswordDialog(): void {
    this.displayForgotPasswordDialog = false;
  }

  onSubmitForgotPasswordForm(): void {
    if (this.forgotPasswordForm.value && this.forgotPasswordForm.valid) {
      this.userService
        .passwordRecover(this.forgotPasswordForm.value.email as string)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Atenção',
              detail:
                'Enviamos uma senha de acesso para o email informado, verifique sua caixa de entrada',
              life: 3000,
            });
            this.cookieService.set('PASSWORD_RECOVERED', 'true');
            this.displayForgotPasswordDialog = false;
            this.forgotPasswordForm.reset();
          },
          error: (err) => {
            console.log(err.error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: err.error?.message || err.message || 'Não encontramos nenhum usuário com o email informado',
              life: 2000,
            });
            this.loadingForgotPassword = false;
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
