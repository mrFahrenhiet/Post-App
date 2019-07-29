import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Posts } from './posts/post.service';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private http: HttpClient) { }
  fetch(postPerPage: number, currentPage: number) {
    const queryParam = `?pageSize=${postPerPage}&currentPage=${currentPage}`;
    return this.http.get<{message: string, posts: any, maxCount: number}>('http://localhost:3000/api/posts' + queryParam);
  }
  save(post: any) {
    return this.http.post<{message: string, post: any}>('http://localhost:3000/api/posts', post);
  }
  delete(id: string) {
    return this.http.delete<{message: string}>('http://localhost:3000/api/posts/' + id);
  }
  update(post: any, id: string) {
    return this.http.put<{message: string, posts: Posts}>('http://localhost:3000/api/posts/' + id, post);
  }
}
