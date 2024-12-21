# Bluesky Project Documentation

## Project Overview

**Project Name**: Bluesky  
**Description**: Bluesky is a web application built using Node.js and Express that provides a RESTful API for managing user authentication, posts, likes, comments, and follows. The application utilizes Prisma for database interactions and includes validation middleware for data integrity.

## Installation

### Prerequisites
- Node.js (version 14.x or higher)  
- Bun (for package management)

### Steps to Install
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd bluesky
   ```
2. Install dependencies using Bun:
   ```bash
   bun install
   ```

## Usage

### Starting the Server
To start the server, run the following command:
```bash
bun src/index.js
```
The server will start on port **3003** by default. You can access the API at `http://localhost:3003`.

## API Endpoints

### 1. Authentication Routes

#### Sign Up
- **Method**: `POST`  
- **URL**: `/api/auth/signup`  
- **Description**: Registers a new user.  
- **Request Body**:
  ```json
  {
    "username": "exampleUser",
    "password": "examplePassword",
    "email": "user@example.com"
  }
  ```
- **Example Response**:
  ```json
  {
    "message": "User registered successfully."
  }
  ```

#### Login
- **Method**: `POST`  
- **URL**: `/api/auth/login`  
- **Description**: Authenticates a user and returns a JWT token.  
- **Request Body**:
  ```json
  {
    "username": "exampleUser",
    "password": "examplePassword"
  }
  ```
- **Example Response**:
  ```json
  {
    "token": "your_jwt_token"
  }
  ```

### 2. Post Routes

#### Create Post
- **Method**: `POST`  
- **URL**: `/api/posts`  
- **Description**: Creates a new post.  
- **Request Body**:
  ```json
  {
    "title": "Post Title",
    "content": "This is the content of the post."
  }
  ```
- **Example Response**:
  ```json
  {
    "id": 1,
    "title": "Post Title",
    "content": "This is the content of the post."
  }
  ```

#### Get All Posts
- **Method**: `GET`  
- **URL**: `/api/posts`  
- **Description**: Retrieves all posts.  
- **Example Response**:
  ```json
  [
    {
      "id": 1,
      "title": "Post Title",
      "content": "This is the content of the post."
    }
  ]
  ```

#### Get Post by ID
- **Method**: `GET`  
- **URL**: `/api/posts/:id`  
- **Description**: Retrieves a single post by ID.  
- **Example Response**:
  ```json
  {
    "id": 1,
    "title": "Post Title",
    "content": "This is the content of the post."
  }
  ```

#### Delete Post
- **Method**: `DELETE`  
- **URL**: `/api/posts/:id`  
- **Description**: Deletes a post by ID.  
- **Example Response**:
  ```json
  {
    "message": "Post deleted successfully."
  }
  ```

### 3. Like Routes

#### Like a Post
- **Method**: `POST`  
- **URL**: `/api/likes/:id/like`  
- **Description**: Likes a post by ID.  
- **Example Response**:
  ```json
  {
    "message": "Post liked successfully."
  }
  ```

#### Get Likes for a Post
- **Method**: `GET`  
- **URL**: `/api/likes/:id/likes`  
- **Description**: Retrieves all likes for a post by ID.  
- **Example Response**:
  ```json
  {
    "likes": [
      {
        "userId": 1,
        "postId": 1
      }
    ]
  }
  ```

### 4. Comment Routes

#### Create Comment
- **Method**: `POST`  
- **URL**: `/api/posts/:id/comments`  
- **Description**: Adds a comment to a post.  
- **Request Body**:
  ```json
  {
    "content": "This is a comment."
  }
  ```
- **Example Response**:
  ```json
  {
    "id": 1,
    "content": "This is a comment.",
    "postId": 1
  }
  ```

#### Get Comments for a Post
- **Method**: `GET`  
- **URL**: `/api/posts/:id/comments`  
- **Description**: Retrieves all comments for a post by ID.  
- **Example Response**:
  ```json
  [
    {
      "id": 1,
      "content": "This is a comment.",
      "postId": 1
    }
  ]
  ```

## Testing

To run tests, use the following command:

```bash
bun test
```

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please create a pull request or open an issue for any suggestions.
