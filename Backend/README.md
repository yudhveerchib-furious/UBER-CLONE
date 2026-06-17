# Uber Clone Backend - User Authentication API

This documentation describes the user registration and authentication flow in the Uber Clone backend application, detailing the roles of the models, services, controllers, routes, and API endpoints.

---

## Architecture Overview

The backend uses a standard controller-service-repository (model) architectural pattern:

```mermaid
graph TD
    Client[Client Request] --> Routes[User Routes]
    Routes -->|Validation Check| Controller[User Controller]
    Controller -->|Calls| Service[User Service]
    Service -->|Uses Schema/Methods| Model[User Model]
    Model -->|Saves to| DB[(MongoDB)]
```

---

## 1. User Model (`models/user.model.js`)

Defines the database schema for the `user` collection in MongoDB along with document methods and static helper functions.

### Schema Fields
- **`fullname`** (Object, Required):
  - **`firstname`** (String, Required): Minimum 3 characters.
  - **`lastname`** (String, Optional): Minimum 3 characters.
- **`email`** (String, Required, Unique): User's email address.
- **`password`** (String, Required): Hashed password (hidden by default in queries using `select: false`).
- **`socketId`** (String, Optional): Socket identifier for real-time features.

### Methods & Statics
- **`generateAuthToken()`** (Instance Method): Generates a JWT token signed with the user's `_id` and the `JWT_SECRET` environment variable.
- **`comparePasword(password)`** (Instance Method): Asynchronously compares a plain-text password with the stored hash using `bcrypt`.
- **`hashPassword(password)`** (Static Method): Hashes a plain-text password with a salt round of 10.

### Captain Model (`models/captain.model.js`)

Defines the database schema for the `captain` (driver) collection in MongoDB along with document methods and static helper functions.

### Schema Fields
- **`fullname`** (Object, Required):
  - **`firstname`** (String, Required): Minimum 3 characters.
  - **`lastname`** (String, Optional): Minimum 3 characters.
- **`email`** (String, Required, Unique): Captain's email address.
- **`password`** (String, Required): Hashed password (hidden by default in queries using `select: false`).
- **`socketId`** (String, Optional): Socket identifier for real-time features.
- **`status`** (String, Optional): Status of the captain (`active` or `inactive`, default: `inactive`).
- **`vehicle`** (Object, Required):
  - **`color`** (String, Required): Minimum 3 characters.
  - **`plate`** (String, Required): Minimum 3 characters.
  - **`capacity`** (Number, Required): Minimum 1 capacity.
  - **`vehicleType`** (String, Required): Must be one of `car`, `auto`, or `bike`.
  - **`location`** (Object, Optional): Coordinates containing `lat` (latitude) and `long` (longitude).

### Methods & Statics
- **`generateAuthToken()`** (Instance Method): Generates a JWT token signed with the captain's `_id` and the `JWT_SECRET` environment variable (expires in 24h).
- **`comparePasword(password)`** (Instance Method): Asynchronously compares a plain-text password with the stored hash using `bcrypt`.
- **`hashPassword(password)`** (Static Method): Hashes a plain-text password with a salt round of 10.

---

## 2. User Service (`services/user.service.js`)

Contains pure business logic and handles database operations.

### `createUser({ firstname, lastname, email, password })`
- Validates that `firstname`, `email`, and `password` are present.
- Creates a new user document in MongoDB.
- Returns the created `user` document.

### Captain Service (`services/captain.service.js`)

### `createCaptain({ firstname, lastname, email, password, color, plate, capacity, vehicleType })`
- Validates that all fields (`firstname`, `email`, `password`, `color`, `plate`, `capacity`, `vehicleType`) are present.
- Creates a new captain document in MongoDB.
- Returns the created `captain` document.

---

## 3. User Controller (`controllers/user.controller.js`)

Manages incoming requests, extracts inputs, orchestrates validation, calls services, and sends responses.

### `registerUser(req, res, next)`
- Inspects validation results from `express-validator`.
- Destructures `fullname`, `email`, and `password` from the request body.
- Hashes the password by calling `userModel.hashPassword(password)`.
- Calls `userService.createUser(...)` to save the user.
- Generates a JWT by calling `user.generateAuthToken()`.
- Sends back the status code and JSON payload.

### `logOut(req, res)`
- Clears the authentication token cookie.
- Adds the token to the `Blacklist` token database collection to invalidate it.
- Sends back a success JSON response.

### Captain Controller (`controllers/captain.controller.js`)

### `registerUser(req, res, next)`
- Inspects validation results from `express-validator`.
- Destructures `fullname`, `email`, `password`, and `vehicle` from the request body.
- Hashes the password by calling `captainModel.hashPassword(password)`.
- Calls the service `createCaptain(...)` to save the captain.
- Generates a JWT by calling `captain.generateAuthToken()`.
- Sends back the status code `201 Created` along with the JWT and captain details.

---

## 4. User Routes (`routes/user.routes.js`)

Maps URL endpoints to controller methods and enforces validation rules.

### Route definition: `POST /users/register`
- **Validation Rules**:
  - `email` must be a valid email format.
  - `fullname.firstname` must be at least 3 characters.
  - `password` must be at least 6 characters.

### Route definition: `POST /users/login`
- **Validation Rules**:
  - `email` must be a valid email format.
  - `password` must be at least 6 characters.

### Route definition: `GET /users/logout`
- **Validation Rules**: Requires authentication via Bearer token or cookie.

### Captain Routes (`routes/captain.routes.js`)

### Route definition: `POST /captains/register`
- **Validation Rules**:
  - `email` must be a valid email format.
  - `fullname.firstname` must be at least 3 characters.
  - `password` must be at least 6 characters.
  - `vehicle.color` must be at least 3 characters.
  - `vehicle.plate` must be at least 3 characters.
  - `vehicle.capacity` must be an integer and at least 1.
  - `vehicle.vehicleType` must be one of `['car', 'auto', 'bike']`.

---

## 5. API Endpoint Details & Data Flow

### How Data is Obtained from the Endpoints

1. **Request Reception**: The client sends a `POST` request to `http://localhost:6000/users/register` (registration) or `http://localhost:6000/users/login` (login) with a JSON body.
2. **Payload Extraction**: The application reads properties from `req.body.fullname` (`firstname`, `lastname` for register), `req.body.email`, and `req.body.password`.
3. **Response Delivery**: If successful, the API returns a JSON payload containing the authenticated `user` document and their JWT `token` in the response body.

### Registration Request Format (`POST /users/register`)
- **Body**:
  ```json
  {
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "password": "securePassword123"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com",
      "password": "$2b$10$...",
      "_id": "6a31856e58cd92928c5211ad",
      "__v": 0
    }
  }
  ```

### Login Request Format (`POST /users/login`)
- **Body**:
  ```json
  {
    "email": "john.doe@example.com",
    "password": "securePassword123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com",
      "_id": "6a31856e58cd92928c5211ad",
      "__v": 0
    }
  }
  ```

### Logout Request Format (`GET /users/logout`)
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Response (200 OK)**:
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

### Captain Registration Request Format (`POST /captains/register`)
- **Body**:
  ```json
  {
    "fullname": {
      "firstname": "Captain",
      "lastname": "Jack"
    },
    "email": "captain.jack.789@example.com",
    "password": "securepassword123",
    "vehicle": {
      "color": "black",
      "plate": "KA-01-1234",
      "capacity": 4,
      "vehicleType": "car"
    }
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "captain": {
      "fullname": {
        "firstname": "Captain",
        "lastname": "Jack"
      },
      "email": "captain.jack.789@example.com",
      "status": "inactive",
      "vehicle": {
        "color": "black",
        "plate": "KA-01-1234",
        "capacity": 4,
        "vehicleType": "car"
      },
      "_id": "6a32e3d0a5bdec1f035ca288",
      "__v": 0
    }
  }
  ```

---

## 6. HTTP Status Codes

The authentication endpoints return the following status codes:

| Status Code | Status Text | Description |
| :--- | :--- | :--- |
| **`200`** | `OK` | Login was successful. The token and user information are returned in the response. |
| **`201`** | `Created` | The user registration was successful. The token and user information are returned in the response. |
| **`400`** | `Bad Request` | Validation failed (e.g., email invalid, password too short, or name missing). A list of errors is returned. |
| **`401`** | `Unauthorized` | Invalid email or password during login. |
| **`500`** | `Internal Server Error` | An unexpected server error occurred (e.g., database connection issues). |
