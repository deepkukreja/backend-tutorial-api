# Project notes

This repository is a student learning implementation based on the backend concepts in the freeCodeCamp lesson linked in the README.

## Main concepts demonstrated

- Node.js runtime and ES modules
- Express application setup and middleware
- MongoDB Atlas connection through Mongoose
- User and Post schemas
- Routes and controllers
- Password hashing with bcryptjs
- JWT-based authentication
- Protected create, read, update, and delete endpoints
- Postman API testing

## Data used for the demo

The Postman collection uses invented sample values. Registering the sample user creates a real document in the MongoDB database configured in `.env`; the email and post content are only test data.

## Before sharing the repository

- Keep `.env` out of Git.
- Never put an Atlas password, JWT secret, or access token in a source file, screenshot, or README.
- Use a database user with only the permissions needed for this project.
