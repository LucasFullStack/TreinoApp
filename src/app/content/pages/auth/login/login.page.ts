import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Login } from 'src/app/core/models/auth/login';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/core/services/auth/authentication.service';

let _postLogin$: Subscription = new Subscription();

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  form: FormGroup;

  constructor(private fb: FormBuilder,
              private authService: AuthenticationService) { }

  ngOnInit() {
    this.createForm();
  }

  ngOnDestroy(){
    _postLogin$.unsubscribe();
  }

  createForm() {
    const _patternEmail: string = "^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$";
    this.form = this.fb.group({
      'email': ['', Validators.compose([Validators.required, Validators.pattern(_patternEmail)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(6)])],
    })
  }

  postLogin(login: Login){
    _postLogin$ = this.authService.postLogin(login)
                                  .subscribe((data)=>{
                                    console.log(data)
                                  },(error)=>{
                                    console.log(error)
                                  })
  }

  prepareForm(): Login{
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
  
}
