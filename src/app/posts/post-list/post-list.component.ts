import { Component, OnInit } from '@angular/core';
import { PostService, Posts } from '../post.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  constructor(public posts: PostService, private router: Router, private authService: AuthService) { }
  postItems: Posts[] = [];
  isPost = false;
  lenght = 10;
  pageSize = 2;
  pageSizeOption = [2, 4, 6, 8, 10];
  currentPage = 1;
  isAuth = false;
  userId: string;
  ngOnInit() {
    this.isAuth = this.authService.isAuthen;
    this.authService.isAuth.subscribe(authData => {
      this.isAuth = authData;
      this.userId = this.authService.userId;
    });
    this.posts.isLoading = true;
    this.posts.getPosts(this.pageSize, 1);
    this.posts.changedPosts.subscribe((postsData: {posts: Posts[], count: number}) => {
      this.postItems = postsData.posts;
      this.lenght = postsData.count;
      console.log(this.postItems);
      if (this.postItems.length !== 0) {
        this.isPost = true;
      }
    });
  }
  onChangePage(pageData: PageEvent) {
    this.posts.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.pageSize = pageData.pageSize;
    this.posts.getPosts(pageData.pageSize, pageData.pageIndex + 1);
  }
  edit(id: string) {
    this.router.navigate(['/posts', id, 'edit']);
  }
  delete(id: string) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success ml-2',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.posts.isLoading = true;
        this.posts.deletePost(id).subscribe(resData => {
          this.posts.isLoading = false;
          this.posts.getPosts(this.pageSize, this.currentPage);
        });
        swalWithBootstrapButtons.fire(
          'Deleted!',
          'Your post has been deleted.',
          'success'
        );
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Your post is safe :)',
          'error'
        );
      }
    });
    if (this.postItems.length === 0) {
      this.isPost = false;
    }
  }

}
