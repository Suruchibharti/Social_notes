# Social Notes Backend

Express.js + MongoDB API for a social notes/blogging platform with authentication, profiles, following, personalized feed, and posts.

## Run Locally

```bash
npm install
npm run dev
```

Create a `.env` file using `.env.example` as a guide.

Image uploads use ImageKit. Add `IMAGEKIT_PRIVATE_KEY` in `.env` before testing profile or post image uploads.

## Postman Testing

Import this collection into Postman:

```text
postman/Social_Notes_API.postman_collection.json
```

Full API testing data and expected results are here:

```text
postman/API_TESTING_GUIDE.md
```

Run `Register User` to create an account, then run `Login User`. Login automatically saves the returned JWT into the `token` variable for protected APIs.

For image upload APIs in Postman, use `form-data`:

- Register/update profile: upload a file in the `profilePic` field.
- Create/update post: upload a file in the `image` field.

## Main Endpoints

### Auth & Profile

- `POST /api/register`
- `POST /api/login`
- `GET /api/profile`
- `PUT /api/profile`
- `GET /api/users?search=&page=1&limit=20`
- `GET /api/users/:id`

### Following

- `POST /api/follow/:userId`
- `DELETE /api/follow/:userId`
- `GET /api/following`
- `GET /api/followers/:userId`

### Posts

- `GET /api/posts/feed?page=1&limit=10`
- `POST /api/posts`
- `GET /api/posts/:id`
- `PUT /api/posts/:id`
- `DELETE /api/posts/:id`
Protected routes require:

```text
Authorization: Bearer <jwt-token>
```

## Post Body Example

```json
{
  "title": "My first note",
  "content": "Today I learned how social feeds work.",
  "image": "https://example.com/image.jpg"
}
```
