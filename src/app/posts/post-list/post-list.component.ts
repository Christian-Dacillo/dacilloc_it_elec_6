import { Component } from "@angular/core";


@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})

export class PostListComponent{
    post = [
        {title: '1st title', content: '1st title'},
        {title: '2nd title', content: '2nd title'},
        {title: '3rd title', content: '3rd title'},
    ]
}