import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostService, Posts } from '../post.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import Swal from 'sweetalert2';

import { mimeType } from '../mime-type.validator';
@Component({
  selector: 'app-posts-create',
  templateUrl: './posts-create.component.html',
  styleUrls: ['./posts-create.component.css']
})
export class PostsCreateComponent implements OnInit {
  form: FormGroup;
  post =  {
    postTitle: '',
    postContent: '',
    id: null,
  };
  isEdit = false;
  editPost: Posts;
  id: string;
  imagePreview: any;
  constructor(private posts: PostService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = params.id;
      this.isEdit = this.id !== undefined ? true : false;
      this.editPost = this.posts.getPostsById(this.id);
    });
    if (!this.isEdit) {
    this.form = new FormGroup({
      postContent: new FormControl(null, [Validators.required]),
      postTitle: new FormControl(null, [Validators.required]),
      postImage: new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
    });
  } else {
    this.form = new FormGroup({
      postContent: new FormControl(this.editPost.postContent, [Validators.required]),
      postTitle: new FormControl(this.editPost.postTitle, [Validators.required]),
      postImage: new FormControl(this.editPost.imagePath, {validators: [Validators.required], asyncValidators: [mimeType]})
    });
  }
  }
  onSubmit() {
    // console.log(this.form);
    this.post.postContent = this.form.value.postContent;
    this.post.postTitle = this.form.value.postTitle;
    console.log(this.post.postTitle + ' ' + this.post.postTitle);
    if (!this.isEdit) {
      if (this.post.postTitle === null || this.post.postContent === null) {
        Swal.fire(
          'Error',
          'Please enter the valid data',
          'warning'
        );
        return ;
      }
      this.posts.isLoading = true;
      this.posts.createPosts(this.post.postContent, this.post.postTitle, this.form.value.postImage);
      Swal.fire(
        'Success!',
        'Your post was added!',
        'success'
      );
    } else {
      this.posts.isLoading = true;
      this.posts.updatePost(this.id, this.post.postTitle, this.post.postContent, this.form.value.postImage);
      Swal.fire(
        'Success!',
        'Your post was updated!',
        'success'
      );
    }
    this.router.navigate(['/posts']);
  }
  onFilePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({postImage: file});
    this.form.get('postImage').updateValueAndValidity();
    console.log(file);
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }
}
