import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService, Users } from '../auth.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private authService: AuthService) { }

  form: FormGroup;
  ngOnInit() {
    this.form = new FormGroup({
      username: new FormControl(null, {validators: [Validators.required]}),
      password: new FormControl(null, {validators: [Validators.required]})
    });
  }
  onSubmit() {
    let newUser: Users;
    newUser = {
      username: this.form.value.username,
      password: this.form.value.password,
      id: null
    };
    this.authService.isLoad = true;
    this.authService.addUser(newUser);
  }

}
