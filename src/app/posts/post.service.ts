import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataStorageService } from '../data-storage.service';
export interface Posts {
  postTitle: string;
  postContent: string;
  id: string;
  imagePath: string;
}
@Injectable({
  providedIn: 'root'
})
export class PostService {
 constructor(private dataService: DataStorageService) { }
 public count: number;
 public isLoading = false;
 posts: Posts[] = [];
 changedPosts = new Subject<{posts: Posts[], count: number }>();
  getPosts(postPerPage: number, currentPage: number) {
    this.dataService.fetch(postPerPage, currentPage).pipe(map((postsData) => {
      return {
        posts: postsData.posts.map(post => {
        return {
          postTitle: post.postTitle,
          postContent: post.postContent,
          id: post._id,
          imagePath: post.imagePath
        };
      }),
      count: postsData.maxCount
    };
  }))
    .subscribe(postsData => {
      this.isLoading = false;
      this.count = postsData.count;
      this.posts = postsData.posts;
      this.changedPosts.next({posts: this.posts.slice(), count: this.count});
    });
  }
  createPosts(postContent: string, postTitle: string, image: File) {
    const postData = new FormData();
    postData.append('postTitle', postTitle);
    postData.append('postContent', postContent);
    postData.append('image', image, postTitle);
    this.dataService.save(postData).subscribe(responseData => {
      this.isLoading = false;
      // console.log(responseData.message);
      // const post: Posts = {
      //   id: responseData.post.id,
      //   postTitle,
      //   postContent,
      //   imagePath: responseData.post.imagePath
      // };
      // this.posts.push(post);
      this.changedPosts.next({posts: this.posts.slice(), count: this.count});
    });
  }
  getPostsById(id: string) {
    let idd: number;
    for (let i = 0; i < this.posts.length; i++ ) {
      if (this.posts[i].id === id) {
         idd = i;
      }
    }
    return this.posts[idd];
  }
  getPostUpdateListener() {
    return this.changedPosts.asObservable();
  }
  updatePost(id: string, postTitle: string, postContent: string,  image: File | string) {
    let postData: Posts | FormData;
    if (typeof(image) === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('postTitle', postTitle);
      postData.append('postContent', postContent);
      postData.append('image', image, postTitle);
    } else {
      postData = {
        id,
        postTitle,
        postContent,
        imagePath: image
      };
    }
    let idd;
    for (let i = 0; i < this.posts.length; i++ ) {
      if (this.posts[i].id === id) {
         idd = i;
      }
    }
    this.dataService.update(postData, id).subscribe(resData => {
      this.isLoading = false;
      // console.log(resData);
      // this.posts[idd] = {
      //   id,
      //   postTitle,
      //   postContent,
      //   imagePath: resData.posts.imagePath
      // };
      this.changedPosts.next({posts: this.posts.slice(), count: this.count});
    });
  }
  deletePost(id: string) {
    return this.dataService.delete(id);
  }
}
