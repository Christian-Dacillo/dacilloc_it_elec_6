import { Injectable } from "@angular/core";
import { Subject, Observable, throwError } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Post } from "./post.model";
import { Router } from "@angular/router";
import { map, catchError } from "rxjs/operators";

@Injectable({ providedIn: 'root' })
export class PostsService {
    posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();

    constructor(private http: HttpClient, private router: Router) {}

    getPosts() {
        this.http.get<{ message: string, posts: any }>('http://localhost:3000/api/posts')
            .pipe(
                map((postData) => {
                    return postData.posts.map((post: any) => ({
                        id: post._id,
                        title: post.title,
                        content: post.content,
                        imagePath: post.imagePath
                    }));
                }),
                catchError(error => {
                    console.error("Fetching posts failed!", error);
                    return throwError(error);
                })
            )
            .subscribe((transformedPosts) => {
                this.posts = transformedPosts;
                this.postsUpdated.next([...this.posts]);
            });
    }

    getPostUpdatedListener() {
        return this.postsUpdated.asObservable();
    }

    getPost(id: string): Observable<Post> {
        return this.http.get<{ _id: string; title: string; content: string; imagePath: string }>(
            `http://localhost:3000/api/posts/${id}`
        ).pipe(
            map(postData => {
                return {
                    id: postData._id,
                    title: postData.title,
                    content: postData.content,
                    imagePath: postData.imagePath
                };
            })
        );
    }

    addPost(title: string, content: string, image: File) {
        const postData = new FormData();
        postData.append('title', title);
        postData.append('content', content);
        postData.append('image', image, title);

        this.http
            .post<{ message: string; post: Post }>(
                'http://localhost:3000/api/posts',
                postData
            )
            .subscribe({
                next: (responseData) => {
                    const post: Post = {
                        id: responseData.post.id,
                        title: title,
                        content: content,
                        imagePath: responseData.post.imagePath
                    };
                    this.posts.push(post);
                    this.postsUpdated.next([...this.posts]);
                    this.router.navigate(['/']);
                }
            });
    }
    

    updatePost(id: string, title: string, content: string, image: File | string) {
        let postData: FormData | Post;
        
        if (typeof image === 'object') {
            // If a new file is selected
            postData = new FormData();
            postData.append('id', id);
            postData.append('title', title);
            postData.append('content', content);
            postData.append('image', image, title);
        } else {
            // If no new file is selected
            postData = {
                id: id,
                title: title,
                content: content,
                imagePath: image
            };
        }

        this.http
            .put<{ message: string, post: Post }>(`http://localhost:3000/api/posts/${id}`, postData)
            .subscribe({
                next: (response) => {
                    const updatedPosts = [...this.posts];
                    const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
                    const post: Post = {
                        id: id,
                        title: title,
                        content: content,
                        imagePath: response.post.imagePath
                    };
                    updatedPosts[oldPostIndex] = post;
                    this.posts = updatedPosts;
                    this.postsUpdated.next([...this.posts]);
                    this.router.navigate(['/']);
                }
            });
    }

    deletePost(postId: string) {
        this.http.delete(`http://localhost:3000/api/posts/${postId}`)
            .subscribe(() => {
                console.log('Deleted');
                this.posts = this.posts.filter(post => post.id !== postId);
                this.postsUpdated.next([...this.posts]);
                this.router.navigate(["/"]);
            });
    }
}