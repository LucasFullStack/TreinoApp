import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Login } from 'src/app/core/models/auth/login';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/core/services/auth/authentication.service';
import { AlertService } from 'src/app/core/services/alert/alert.service';
import { LoadingService } from 'src/app/core/services/loading/loading.service';
import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

let _postLogin$: Subscription = new Subscription();

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  form: FormGroup;
  errorMessage: string = 'Não foi possível efetuar o login. Caso o problema persista entre em contato com o administrador!';

  constructor(private fb: FormBuilder,
    private authService: AuthenticationService,
    private alertService: AlertService,
    private loadingService: LoadingService,
    private router: Router) { }

  ngOnInit() {
    this.createForm();
  }

  ngOnDestroy() {
    _postLogin$.unsubscribe();
  }

  createForm() {
    const _patternEmail: string = "^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$";
    this.form = this.fb.group({
      'email': ['', Validators.compose([Validators.required, Validators.pattern(_patternEmail)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(6)])],
    })
  }

  postLogin(login: Login) {
    this.loadingService.presentLoading('Entrando...');
    _postLogin$ = this.authService.postLogin(login).pipe(
      finalize(() => {
        this.loadingService.dismissLoading();
      })
    )
      .subscribe((data) => {
        this.router.navigate(['/'])
      }, (error: HttpErrorResponse) => {
        console.log(error)
        if(error.status > 0){
          this.presentErrorAlert('Falha no login', error.error)
        }else {
          this.presentErrorAlert('Falha no login',this.errorMessage)
        }
        
      })
  }

  prepareForm(): Login {
    const _login = new Login();
    const _controls = this.form.controls;
    _login.email = _controls['email'].value;
    _login.password = _controls['password'].value;
    return _login;
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }

    const _login = this.prepareForm();
    this.postLogin(_login)
  }


  presentSuccessAlert(header: string, msg: string) {
    this.alertService.presentSuccessAlertDefault(header, msg)
  }

  presentErrorAlert(header: string, msg: string) {
    this.alertService.presentErrorAlertDefault(header, msg)
  }

}
