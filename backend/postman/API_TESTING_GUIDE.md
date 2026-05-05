# Social Notes API Testing Guide

Base URL:

```text
http://localhost:5000
```

For protected APIs, add this header after login:

```text
Authorization: Bearer <token>
```

In Postman, save these values as collection variables:

```text
baseUrl = http://localhost:5000
token = login response token
userId = any user id from GET /api/users
postId = post id from create post response
```

## 1. Health Check

Method:

```text
GET {{baseUrl}}/api/health
```

Expected result:

```json
{
  "success": true,
  "message": "Social Notes API is running"
}
```

## 2. Register User

Method:

```text
POST {{baseUrl}}/api/register
```

Body type:

```text
form-data
```

Data:

```text
username: suruchi
email: suruchi@example.com
password: Password@123
profilePic: choose image file
```

Password rule: 6 to 100 characters and at least 1 special character.

Expected result:

```json
{
  "success": true,
  "message": "User registered successfully. Please login to continue."
}
```

Note: Register does not return token. Login returns token.

## 3. Login User

Method:

```text
POST {{baseUrl}}/api/login
```

Body type:

```text
raw JSON
```

Data:

```json
{
  "email": "suruchi@example.com",
  "password": "Password@123"
}
```

Expected result:

```json
{
  "success": true,
  "message": "Login successful.",
  "token": "jwt-token-here",
  "user": {
    "_id": "user-id",
    "username": "suruchi",
    "email": "suruchi@example.com",
    "profilePic": "imagekit-url-or-empty",
    "following": [],
    "followers": []
  }
}
```

Save `token` from this response.

## 4. Get Current Profile

Method:

```text
GET {{baseUrl}}/api/profile
```

Headers:

```text
Authorization: Bearer {{token}}
```

Expected result:

```json
{
  "success": true,
  "message": "Profile fetched successfully.",
  "user": {
    "_id": "logged-in-user-id",
    "username": "suruchi",
    "email": "suruchi@example.com",
    "profilePic": "imagekit-url-or-empty",
    "following": [],
    "followers": []
  }
}
```

## 5. Update Current Profile

Method:

```text
PUT {{baseUrl}}/api/profile
```

Headers:

```text
Authorization: Bearer {{token}}
```

Body type:

```text
form-data
```

Data:

```text
username: suruchi_updated
email: suruchi@example.com
profilePic: choose new image file
```

Expected result:

```json
{
  "success": true,
  "message": "Profile updated successfully.",
  "user": {
    "_id": "logged-in-user-id",
    "username": "suruchi_updated",
    "email": "suruchi@example.com",
    "profilePic": "new-imagekit-url"
  }
}
```

Duplicate username result:

```json
{
  "success": false,
  "message": "Username already exists"
}
```

Duplicate email result:

```json
{
  "success": false,
  "message": "Email already exists"
}
```

## 6. Get All Users

Method:

```text
GET {{baseUrl}}/api/users?page=1&limit=20
```

Headers:

```text
Authorization: Bearer {{token}}
```

Expected result:

```json
{
  "success": true,
  "message": "Users fetched successfully.",
  "users": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "pages": 1
  }
}
```

Save another user's `_id` as `userId` for follow testing.

## 7. Search Users

Method:

```text
GET {{baseUrl}}/api/users?search=suruchi&page=1&limit=10
```

Headers:

```text
Authorization: Bearer {{token}}
```

Expected result:

```json
{
  "success": true,
  "message": "Users fetched successfully.",
  "users": [
    {
      "_id": "user-id",
      "username": "suruchi_updated",
      "email": "suruchi@example.com"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

## 8. Get User By Id

Method:

```text
GET {{baseUrl}}/api/users/{{userId}}
```

Headers:

```text
Authorization: Bearer {{token}}
```

Expected result:

```json
{
  "success": true,
  "message": "User profile fetched successfully.",
  "user": {
    "_id": "user-id",
    "username": "other_user",
    "email": "other@example.com",
    "profilePic": "imagekit-url-or-empty",
    "following": [],
    "followers": []
  },
  "posts": []
}
```

## 9. Follow User

Important: Create and login with User A, then create another User B. Use User B's `_id` as `userId`. A user cannot follow themselves.

Method:

```text
POST {{baseUrl}}/api/follow/{{userId}}
```

Headers:

```text
Authorization: Bearer {{token}}
```

Expected result:

```json
{
  "success": true,
  "message": "User followed successfully."
}
```

Self-follow error:

```json
{
  "success": false,
  "message": "You cannot follow yourself"
}
```

## 10. Get My Following

Method:

```text
GET {{baseUrl}}/api/following
```

Headers:

```text
Authorization: Bearer {{token}}
```

Expected result:

```json
{
  "success": true,
  "message": "Following list fetched successfully.",
  "following": [
    {
      "_id": "followed-user-id",
      "username": "other_user",
      "email": "other@example.com",
      "profilePic": "imagekit-url-or-empty"
    }
  ]
}
```

## 11. Get User Followers

Method:

```text
GET {{baseUrl}}/api/followers/{{userId}}
```

Headers:

```text
Authorization: Bearer {{token}}
```

Expected result:

```json
{
  "success": true,
  "message": "Followers fetched successfully.",
  "followers": [
    {
      "_id": "follower-user-id",
      "username": "suruchi_updated",
      "email": "suruchi@example.com",
      "profilePic": "imagekit-url-or-empty"
    }
  ]
}
```

## 12. Unfollow User

Method:

```text
DELETE {{baseUrl}}/api/follow/{{userId}}
```

Headers:

```text
Authorization: Bearer {{token}}
```

Expected result:

```json
{
  "success": true,
  "message": "User unfollowed successfully."
}
```

## 13. Create Post

Method:

```text
POST {{baseUrl}}/api/posts
```

Headers:

```text
Authorization: Bearer {{token}}
```

Body type:

```text
form-data
```

Data:

```text
title: My First Social Note
content: This is a sample post created from Postman.
image: choose image file
```

Expected result:

```json
{
  "success": true,
  "message": "Post created successfully.",
  "post": {
    "_id": "post-id",
    "author": {
      "_id": "logged-in-user-id",
      "username": "suruchi_updated",
      "profilePic": "imagekit-url-or-empty"
    },
    "title": "My First Social Note",
    "content": "This is a sample post created from Postman.",
    "image": "imagekit-url-or-empty",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

Save `post._id` as `postId`.

## 14. Get Personalized Feed

Method:

```text
GET {{baseUrl}}/api/posts/feed?page=1&limit=10
```

Headers:

```text
Authorization: Bearer {{token}}
```

Expected result:

```json
{
  "success": true,
  "message": "Feed fetched successfully.",
  "posts": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1,
    "hasNextPage": false
  }
}
```

Feed includes your own posts and posts from users you follow.

## 15. Get Post By Id

Method:

```text
GET {{baseUrl}}/api/posts/{{postId}}
```

Headers:

```text
Authorization: Bearer {{token}}
```

Expected result:

```json
{
  "success": true,
  "message": "Post fetched successfully.",
  "post": {
    "_id": "post-id",
    "author": {
      "_id": "logged-in-user-id",
      "username": "suruchi_updated",
      "profilePic": "imagekit-url-or-empty"
    },
    "title": "My First Social Note",
    "content": "This is a sample post created from Postman.",
    "image": "imagekit-url-or-empty"
  }
}
```

## 16. Update Own Post

Method:

```text
PUT {{baseUrl}}/api/posts/{{postId}}
```

Headers:

```text
Authorization: Bearer {{token}}
```

Body type:

```text
form-data
```

Data:

```text
title: Updated Social Note
content: This post was updated from Postman.
image: choose new image file
```

Expected result:

```json
{
  "success": true,
  "message": "Post updated successfully.",
  "post": {
    "_id": "post-id",
    "title": "Updated Social Note",
    "content": "This post was updated from Postman.",
    "image": "new-imagekit-url-or-existing-url"
  }
}
```

If another user tries to update your post:

```json
{
  "success": false,
  "message": "You can only modify your own posts"
}
```

## 17. Delete Own Post

Method:

```text
DELETE {{baseUrl}}/api/posts/{{postId}}
```

Headers:

```text
Authorization: Bearer {{token}}
```

Expected result:

```json
{
  "success": true,
  "message": "Post deleted successfully."
}
```

If another user tries to delete your post:

```json
{
  "success": false,
  "message": "You can only modify your own posts"
}
```

## Common Error Responses

Missing token:

```json
{
  "success": false,
  "message": "Authentication token is required"
}
```

Invalid login:

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

Invalid id:

```json
{
  "success": false,
  "message": "Invalid user id"
}
```

Post not found:

```json
{
  "success": false,
  "message": "Post not found"
}
```
