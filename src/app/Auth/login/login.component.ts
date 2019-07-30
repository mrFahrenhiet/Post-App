import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService) { }
  form: FormGroup;
  ngOnInit() {
    this.form = new FormGroup({
      username: new FormControl(null, {validators: [Validators.required]}),
      password: new FormControl(null, {validators: [Validators.required]})
    });
  }
  onSubmit() {
    this.authService.login(this.form.value.username, this.form.value.password);
    this.authService.isLoad = true;

  }
}
