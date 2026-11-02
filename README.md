# Backend Tutorial API

A small REST API built with **Node.js, Express, and MongoDB**. I made this project to practise the backend workflow covered in the freeCodeCamp beginner tutorial: setting up a server, connecting MongoDB, separating models/routes/controllers, handling user authentication, and testing CRUD endpoints with Postman.

**Reference lesson:** [Intro to Backend Web Development – Node.js & Express Tutorial for Beginners](https://www.youtube.com/watch?v=KOutPbKc9UM)

## What the API can do

- Create a user account and store the password as a bcrypt hash.
- Log a user in and issue a signed JSON Web Token (JWT).
- Return the currently authenticated user.
- Protect post endpoints so users can manage only their own posts.
- Create, list, view, edit, and delete posts.
- Connect to MongoDB Atlas through Mongoose.
- Return useful JSON responses and HTTP status codes for common errors.
- Test the endpoints with the included Postman collection.

The names, email addresses, and post content in the Postman collection are **sample data** for testing. They are not real accounts or personal information.

## Tech used

- Node.js (ES modules)
- Express 5
- MongoDB Atlas
- Mongoose
- bcryptjs for password hashing
- jsonwebtoken for authentication
- dotenv for local environment variables
- Postman for API testing

## Project structure

```text
backend-tutorial-api/
├── postman/
│   └── Backend-Tutorial-API.postman_collection.json
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── env.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── postController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── Post.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── postRoutes.js
│   ├── app.js
│   └── index.js
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── VIVA_NOTES.md
```

## Run it locally

### 1. Install the requirements

You need Node.js 20.19 or newer, npm, and a MongoDB Atlas account. Postman Desktop is used for testing.

Check Node and npm:

```powershell
node --version
npm --version
```

### 2. Install the project packages

Open this folder in VS Code and run:

```powershell
npm install
```

### 3. Create a MongoDB Atlas database

1. Sign in to [MongoDB Atlas](https://www.mongodb.com/atlas) and create a project.
2. Create a free M0 cluster if the free tier is available for your account and region.
3. Under **Database Access**, create a database user. This username and password are different from your Atlas website login.
4. Under **Network Access**, add the public IP address of the computer you will use to run this project.
5. Open the cluster's **Connect** window, choose **Drivers**, select **Node.js**, and copy the connection string.
6. Keep the database username and password private. Do not put them in source code or share them in screenshots.

The application uses a database named `backend_tutorial`. MongoDB creates the database and collections when the first user is registered.

### 4. Add your local environment variables

Make a copy of `.env.example` and name the copy `.env`:

```powershell
Copy-Item .env.example .env
```

Open `.env` and fill in your own values:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://DB_USERNAME:URL_ENCODED_PASSWORD@YOUR_CLUSTER.mongodb.net/backend_tutorial?retryWrites=true&w=majority
JWT_SECRET=replace_with_a_long_random_secret_of_at_least_32_characters
```

Use the connection string from your own Atlas cluster. If your database password contains characters such as `@`, `#`, `/`, or `:`, URL-encode the password before placing it in the URI. Generate a different, long random value for `JWT_SECRET`.

**Do not commit `.env` to GitHub.** The `.gitignore` file excludes it. Only `.env.example`, which contains placeholders, belongs in the repository.

### 5. Start the server

Check the JavaScript syntax:

```powershell
npm run check
```

Start the development server:

```powershell
npm run dev
```

When the database connection works, the terminal should show a MongoDB connection message followed by the local server address:

```text
MongoDB connected: backend_tutorial
Server running at http://localhost:5000
Environment: development
```

Open [http://localhost:5000](http://localhost:5000) or [http://localhost:5000/api/health](http://localhost:5000/api/health) in a browser. The first route gives a short API welcome message; the health route confirms that the Express server is responding.

To stop the server, press `Ctrl + C` in the terminal.

## API routes

### Authentication

| Method | Endpoint | What it does | Login required? |
|---|---|---|---|
| `POST` | `/api/auth/register` | Creates a user account | No |
| `POST` | `/api/auth/login` | Checks credentials and returns a JWT | No |
| `GET` | `/api/auth/me` | Returns the logged-in user's details | Yes |
| `POST` | `/api/auth/logout` | Clears the authentication cookie | Yes |

### Posts

All post routes require a valid JWT. A user can access only the posts they created.

| Method | Endpoint | CRUD action |
|---|---|---|
| `POST` | `/api/posts` | Create a post |
| `GET` | `/api/posts` | Read all posts belonging to the logged-in user |
| `GET` | `/api/posts/:id` | Read one post |
| `PATCH` | `/api/posts/:id` | Update a post |
| `DELETE` | `/api/posts/:id` | Delete a post |

Example request body for creating a post:

```json
{
  "title": "My first backend post",
  "content": "I built this API with Node.js, Express, and MongoDB."
}
```

Example request body for updating a post:

```json
{
  "title": "My updated post title"
}
```

For protected routes, send the JWT in the request header:

```text
Authorization: Bearer <your-token>
```

## Test with Postman

1. Start the backend server.
2. Open Postman Desktop and choose **Import**.
3. Select `postman/Backend-Tutorial-API.postman_collection.json`.
4. Run the requests in the collection in order.

The collection includes sample test values and automatically saves the JWT after registration/login and the post ID after creating a post.

| Order | Request | Expected status |
|---:|---|---:|
| 1 | Health Check | `200` |
| 2 | Register User | `201` |
| 3 | Get Current User | `200` |
| 4 | Create Post | `201` |
| 5 | Get All My Posts | `200` |
| 6 | Get One Post | `200` |
| 7 | Update Post | `200` |
| 8 | Delete Post | `200` |
| 9 | Login User | `200` |
| 10 | Logout User | `200` |

The collection uses `student.backend.demo@example.com` as a sample email. If that email has already been registered in your database, change the `testEmail` collection variable before running the registration request again. `DemoPass123!` is a sample password for the classroom demo only; do not reuse it for a personal account.

## How a request moves through the app

```text
Postman / Client
       |
       v
 Express route
       |
       v
 Authentication middleware (for protected routes)
       |
       v
 Controller
       |
       v
 Mongoose model
       |
       v
 MongoDB Atlas
       |
       v
 JSON response to the client
```

- A **model** describes the shape of a document stored in MongoDB.
- A **route** maps an HTTP method and URL to the right controller.
- A **controller** contains the work for the request and sends the response.
- **Middleware** runs between the request and the controller. Here it checks the JWT before protected routes continue.
- **CRUD** stands for Create, Read, Update, and Delete.

## Status codes used

| Code | Meaning | Example |
|---:|---|---|
| `200` | OK | Read, update, login, or logout succeeded |
| `201` | Created | User or post was created |
| `400` | Bad Request | Required input is missing or an ID is invalid |
| `401` | Unauthorized | Token is missing, invalid, or expired |
| `404` | Not Found | Route or post does not exist |
| `409` | Conflict | Email is already registered |
| `500` | Internal Server Error | Unexpected server-side error |

## Common problems

**`MONGODB_URI is missing`** — Check that the file is named `.env`, is in the same folder as `package.json`, and contains `MONGODB_URI=...`.

**MongoDB authentication failed** — Use the database user's username and password from **Database Access**, not the password used to sign in to the Atlas website. Check URL encoding if the password has special characters.

**MongoDB connection timeout** — Confirm that the cluster is active and your current public IP is listed under **Network Access**.

**`EADDRINUSE`** — Port 5000 is already being used. Stop the other server or change `PORT` in `.env`.

**Postman returns `401`** — Run Register or Login first. Check that the collection has saved the JWT in its `token` variable, and send it as a Bearer token.

**Register returns `409`** — That sample email already exists. Change the `testEmail` collection variable to another test email.

## GitHub submission

Create a **public** repository named `backend-tutorial-api`. Keep it empty when creating it (do not add a README, `.gitignore`, or license because those files are already in this project). Then, from this folder, run:

```powershell
git init
git add .
git status
git commit -m "Add Node Express MongoDB backend tutorial"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/backend-tutorial-api.git
git push -u origin main
```

Replace `YOUR_GITHUB_USERNAME` with your GitHub username. Before the push, check `git status` and confirm that `.env` is not listed. After pushing, open the public repository and make sure the source files and README are visible. Submit that repository URL in Google Classroom.

## A note about logout

This is a small learning project. Logout clears the browser cookie. A JWT that has already been copied into a client's storage remains valid until it expires (one day). Full token revocation would need a token blacklist or server-side sessions, which is beyond this introductory assignment.
