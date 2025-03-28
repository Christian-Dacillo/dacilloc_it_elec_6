import { Component } from '@angular/core';

interface Post {
  id: number;
  title: string;
  content: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'it_elec_6a' 
  storedPosts: Post[] = [];
  onPostAdded(post: Post) {
    this.storedPosts.push(post);
  }
}
