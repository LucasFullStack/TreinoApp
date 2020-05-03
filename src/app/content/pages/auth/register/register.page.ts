import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Register } from 'src/app/core/models/auth/register';

let _postRegister$: Subscription = new Subscription();

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit, OnDestroy {
  form: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.createForm();
  }

  ngOnDestroy(){
    _postRegister$.unsubscribe();
  }

  createForm(){
    this.form = this.fb.group({
      'firstName': ['', Validators.required],
      'lastName': ['', Validators.required],
      'email': ['', Validators.required],
      'password': ['', Validators.required]
    })
  }

  onSubmit(){
    if(!this.form.valid){
      return;
    }

    const _register = this.prepareForm();
    console.log(_register);
  }

  prepareForm(): Register{
    const _register = new Register();
    const _controls = this.form.controls;
    _register.firstName = _controls['firstName'].value;
    _register.lastName = _controls['lastName'].value;
    _register.email = _controls['email'].value;
    _register.password = _controls['password'].value;
    return _register;
  }


}
