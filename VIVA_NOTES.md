# Quick Viva / Demonstration Notes

Use these notes to explain the project in your own words. Do not just run the requests—be ready to explain what each layer does.

## 60-second project explanation

“I built a REST API using Node.js and Express. The application connects to MongoDB Atlas through Mongoose. I separated the code into models, routes, and controllers. A user can register and log in; passwords are hashed using bcryptjs, and successful login creates a JWT. The post endpoints are protected by authentication middleware. A logged-in user can create, view, update, and delete their own posts. I tested the endpoints in Postman.”

## Questions the instructor may ask

**1. What is backend development?**  
It is the server-side part of an application. It receives requests, applies application logic, reads or writes data, and sends responses to the client.

**2. What is Node.js?**  
Node.js is a JavaScript runtime that lets JavaScript execute outside the browser, including on a server.

**3. What is Express?**  
Express is a web framework for Node.js. It provides routing and middleware to handle HTTP requests and responses.

**4. What is MongoDB?**  
MongoDB is a document-oriented NoSQL database. It stores records as BSON documents in collections.

**5. What is Mongoose?**  
Mongoose is an object data modelling library. In this project it defines schemas and models and provides methods to read and write MongoDB documents.

**6. What is the difference between a model, route, and controller?**  
A model describes the data. A route maps a URL and HTTP method to a handler. A controller contains the logic that processes the request and returns a response.

**7. What does CRUD mean?**  
Create, Read, Update, and Delete. This project uses POST to create, GET to read, PATCH to update, and DELETE to delete posts.

**8. What is a REST API?**  
It is an API organised around resources and HTTP methods, with data exchanged through request and response messages. This project returns JSON.

**9. Why is a password hashed?**  
A password should not be stored in plain text. bcrypt creates a one-way password hash that can be checked later without storing the original password.

**10. What is JWT?**  
A JSON Web Token is a signed token that carries claims. After login, this project issues a token. The client sends it in the `Authorization: Bearer ...` header to use protected endpoints.

**11. What is middleware?**  
Middleware is a function that runs during the request-response cycle. Here, authentication middleware checks the JWT and loads the matching user before allowing access to protected post routes.

**12. Why use `.env`?**  
It keeps configuration and secrets, such as the MongoDB connection string and JWT secret, outside the source code. `.env` is excluded from Git using `.gitignore`.

**13. What is the `owner` field in the Post model for?**  
It stores a reference to the User document that created the post. The API uses this reference to keep each user's posts separate and prevent one user from modifying another user's post.

**14. What is Postman used for?**  
Postman sends HTTP requests to the API so I can test routes, request bodies, status codes, and JSON responses without building a frontend.

## Status codes used in this project

| Code | Meaning | Example in this API |
|---:|---|---|
| 200 | OK | Successful read, update, delete, login, or logout |
| 201 | Created | Successful registration or post creation |
| 400 | Bad Request | Missing fields, invalid ID, or invalid input |
| 401 | Unauthorized | Missing, invalid, or expired token |
| 404 | Not Found | Unknown route or post not found for this user |
| 409 | Conflict | Email is already registered |
| 500 | Internal Server Error | Unexpected server-side error |

## Live demonstration order

1. Show `GET /api/health` returning `200`.
2. Register a user and explain that the password is hashed before being saved.
3. Show the user document in MongoDB Atlas. Point out that the password field is a hash, not the original password.
4. Create a post and show the returned MongoDB `_id` and `owner` reference.
5. Read all posts and one post.
6. Update the post title or content.
7. Delete the post.
8. Open the route/controller/model files and explain how the request moves through them.

The Postman collection has the same requests in order. Do not show your `.env` file or reveal the database password or JWT secret during the demonstration.
