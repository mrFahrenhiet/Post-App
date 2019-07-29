import { Component, OnInit } from '@angular/core';
import { PostService, Posts } from '../post.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {

  constructor(public posts: PostService, private router: Router) { }
  postItems: Posts[] = [];
  isPost = false;
  lenght = 10;
  pageSize = 2;
  pageSizeOption = [2, 5, 7, 10];
  ngOnInit() {
    this.posts.isLoading = true;
    this.posts.getPosts();
    this.posts.changedPosts.subscribe((posts: Posts[]) => {
      this.postItems = posts;
      // console.log(this.postItems);
      if (this.postItems.length !== 0) {
        this.isPost = true;
      }
    });
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
        this.posts.deletePost(id);
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
