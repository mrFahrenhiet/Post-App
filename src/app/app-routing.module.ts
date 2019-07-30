import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostsCreateComponent } from './posts/posts-create/posts-create.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth.guard';


const routes: Routes = [
  {path: 'posts', component: PostListComponent},
  {path: 'posts/new', component: PostsCreateComponent, canActivate: [AuthGuard]},
  {path: 'posts/:id/edit', component: PostsCreateComponent, canActivate: [AuthGuard] },
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
