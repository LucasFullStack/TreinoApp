import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Register } from 'src/app/core/models/auth/register';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { LoadingService } from 'src/app/core/services/loading/loading.service';
import { AlertService } from 'src/app/core/services/alert/alert.service';
import { AuthenticationService } from 'src/app/core/services/auth/authentication.service';

let _postRegister$: Subscription = new Subscription();

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit, OnDestroy {
  form: FormGroup;
  errorMessage: string = 'Não foi possível  criar a conta. Caso o problema persista entre em contato com o administrador!';

  constructor(private fb: FormBuilder,
              private authenticationService: AuthenticationService,
              private loadingService: LoadingService,
              private alertService: AlertService) { }

  ngOnInit() {
    this.createForm();
  }

  ngOnDestroy() {
    _postRegister$.unsubscribe();
  }

  createForm() {
    const _patternEmail: string =  "^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$";
    this.form = this.fb.group({
      'firstName': ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      'lastName': ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      'gender': ['',Validators.compose([Validators.required])],
      'birthDate': ['', Validators.required],
      'email': ['',  Validators.compose([Validators.required, Validators.pattern(_patternEmail)])],
      'password': ['',Validators.compose([Validators.required, Validators.minLength(4),Validators.maxLength(6)])],
    })
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }

    const _register = this.prepareForm();
    this.postRegister(_register);
  }

  postRegister(register: Register) {
    this.loadingService.presentLoading('Criando...');
    _postRegister$ = this.authenticationService.postRegister(register).pipe(
      finalize(() => {
        this.loadingService.dismissLoading();
      })
    )
      .subscribe(() => {
        this.presentSuccessAlert('Parabéns, ' + register.firstName + "!",'Sua sua conta foi criada com sucesso!');
        this.form.reset();
      }, (error: HttpErrorResponse) => {
         if(error.status > 0){
           this.presentErrorAlert('Atenção!', error.error.msg)
         }else {
           this.presentErrorAlert('Atenção!',this.errorMessage)
         }
      })
  }

  prepareForm(): Register {
    const _register = new Register();
    const _controls = this.form.controls;
    _register.firstName = _controls['firstName'].value;
    _register.lastName = _controls['lastName'].value;
    _register.email = _controls['email'].value;
    _register.password = _controls['password'].value;
    _register.gender = _controls['gender'].value;
    _register.birthDate = _controls['birthDate'].value;
    return _register;
  }

  presentSuccessAlert(header: string, msg: string){
    this.alertService.presentSuccessAlertDefault(header,msg)
  }

  presentErrorAlert(header: string, msg: string){
    this.alertService.presentErrorAlertDefault(header,msg)
  }

}
