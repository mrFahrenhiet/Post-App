import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostsCreateComponent } from './posts/posts-create/posts-create.component';


const routes: Routes = [
  {path: 'posts', component: PostListComponent},
  {path: 'posts/new', component: PostsCreateComponent},
  {path: 'posts/:id/edit', component: PostsCreateComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
