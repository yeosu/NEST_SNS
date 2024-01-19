import { Injectable, NotFoundException } from '@nestjs/common';


/**
 * author: string;
 * title: string;
 * content: string;
 * likeCount: number;
 * commentCount: number;
 */

export interface PostModel {
    id: number;
    author: string;
    title: string;
    content: string;
    likeCount: number;
    commentCount: number;
  }
  
  let posts : PostModel[] = [
    {
      id: 1,
      author: 'John',
      title: 'My first post',
      content: 'Lorem ipsum dolor sit amet',
      likeCount: 10,
      commentCount: 2,
    },
    {
      id: 2,
      author: 'Jane',
      title: 'My second post',
      content: 'Lorem ipsum dolor sit amet',
      likeCount: 12,
      commentCount: 0,
    },
    {
      id: 3,
      author: 'IU',
      title: 'My third post',
      content: 'Lorem ipsum dolor sit amet',
      likeCount: 2,
      commentCount: 2,
    }
  ]

@Injectable()
export class PostsService {
    getAllPosts() {
        return posts;
    }

    getPostById(id: number){
        const post = posts.find(post => post.id === +id);

        if(!post){
        throw new NotFoundException();
        }

        return post;
    }

    createPost(author: string, title: string, content: string) {
        const post = {
            id: posts[posts.length - 1].id + 1,
            author,
            title,
            content,
            likeCount: 0,
            commentCount: 0,
          };
      
          posts = [
            ...posts,
            post,
          ];
    }

    updatePost(postId: number, author: string, title: string, content: string){
        const post = posts.find(post => post.id === postId);

        if(!post){
        throw new NotFoundException();
        }

        if(author){
        post.author = author;
        }

        if(title){
        post.title = title;
        }

        if(content){
        post.content = content;
        }

        posts = posts.map(prevPost => prevPost.id === postId ? post : prevPost);

        return post;
    }

    deletePost(postId: number){
        const post = posts.find(post => post.id === postId);

        if(!post){
        throw new NotFoundException();
        }
        
        posts = posts.filter(post => post.id !== postId);

        return postId;
    }
}
