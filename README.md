# CRUD API

This project is a simple CRUD API using in-memory database underneath.

The application is implemented in the scope of Node.js course in RS School: [Task](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/crud-api/assignment.md)
The API allows you to perform basic CRUD (Create, Read, Update, Delete) operations on user data. It is built using Node.js and uses an in-memory database (variable for mono mode / JSON file for multi mode) for data storage.
`supertest` and `node:test` is used for testing the API endpoints.

## 📦 Technologies

- Node.js
- TypeScript
- In-memory database (variable / JSON file)
- Clustering
- ESLint
- Prettier
- Nodemon
- dotenv
- ts-node
- supertest

## 🚀 Getting Started

> Requires Node.js v22.14.0 or higher

1. Clone the repository

```bash
git clone https://github.com/YuliiaZas/crud-api.git
cd crud-api
```

2. Change branch to `develop`

```bash
git checkout develop
```

3. Install dependencies

```bash
npm install
```

4. Create `.env` file `[optional]`

```bash
cp .env.example .env
```

5. Set up environment variables in `.env` file `[optional]`

```bash
# Port for the application. If variable is not set, the default value will be used.
PORT=3000
# Path to the database file. If variable is not set, the default value will be used.
DB_PATH="data/db.json"
```

6. Start the application

- in development mode

```bash
npm start:dev
```

- in production mode

```bash
npm start:prod
```

- in development mode with clustering run the script and wait untill all servers start

```bash
npm start:multi
```

- in production mode with clustering run the script and wait untill all servers start

```bash
npm start:multi:prod
```

7. Use Postman or any other API client to test the API endpoints.
8. To run tests, stop application to avoid appropriate error in console and run:

```bash
npm test
```

## 📦 API Endpoints

The API provides a set of endpoints for managing user data. The following endpoints are available:

### 📥 `GET /api/users`

Retrieve all users

Response:

```json
[
  {
    "id": "d6346443-7338-4599-93d1-c1d0c52b1827",
    "name": "Alice",
    "age": 25,
    "hobbies": ["hiking"]
  }
]
```

### 📥 GET /api/users/:id

Retrieve a specific user by ID

Response:

```json
{
  "id": "d6346443-7338-4599-93d1-c1d0c52b1827",
  "name": "Alice",
  "age": 25,
  "hobbies": ["hiking"]
}
```

### ➕ `POST /api/users`

Create a new user

Request body:

```json
{ "name": "Alice", "age": 25, "hobbies": ["hiking"] }
```

Response:

```json
{
  "id": "d6346443-7338-4599-93d1-c1d0c52b1827",
  "name": "Alice",
  "age": 25,
  "hobbies": ["hiking"]
}
```

### 🔄 `PUT /api/users/:id`

Update an existing user by ID

Request body:

```json
{ "name": "Alice", "age": 35, "hobbies": ["hiking"] }
```

Response:

```json
{
  "id": "d6346443-7338-4599-93d1-c1d0c52b1827",
  "name": "Alice",
  "age": 35,
  "hobbies": ["hiking"]
}
```

### 🗑️ `DELETE /api/users/:id`

Delete a user by ID

Response: HTTP 204 (No Content)

## 🛠 Cluster-Based CRUD API (`npm run start:multi`, `npm run start:multi:prod`)

This mode is designed to run the application in a clustered environment, allowing for better performance and fault tolerance. It utilizes Node.js's built-in clustering module to create multiple worker processes that can handle incoming requests concurrently.
After startup:

- Load balancer listens on a base port (e.g. http://localhost:3000)
- Number of worker processes = `CPU cores - 1`
- Each worker listens on its own port
- Worker restart strategy is implemented:
  - If a worker crashes, it's restarted up to 2 times
  - After that, its port is removed from the round-robin pool

### 💣 Simulate a crash

To test worker restarts, uncomment this in `multi.ts`:

```typescript
// if (req.url?.startsWith('/api/crash')) {
//   console.log(`[WORKER ${process.pid}] 💣 Simulating crash...`);
//   process.exit(1);
// }
```
