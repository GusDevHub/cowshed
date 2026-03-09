# 📋 Project Context Documentation - Restaurant System

## 📖 Index

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Technologies and Versions](#technologies-and-versions)
4. [Folder Structure](#folder-structure)
5. [Database Modelling](#database-modelling)
6. [Middlewares](#middlewares)
7. [Validation with Schemas](#validation-with-schemas)
8. [Endpoints](#endpoints)
9. [Request Flow](#request-flow)
10. [Project Configuration](#project-configuration)

---

## 🎯 Overview

Backend management system for a restaurant developed in Node.js with TypeScript, using Express as the web framework, Prisma ORM for communication with a PostgreSQL database, and Zod for data validation.

---

## 🏗️ Architecture

The project follows the **MVC + Service Layer** pattern, with the following structure:

```
HTTP Request → Routes → Middlewares → Controller → Service → Database → Service → Controller → HTTP Response
```

### Architecture Layers

1. **Routes (`routes.ts`)** – Defines endpoints and applies middlewares
2. **Middlewares** – Schema validation, authentication, and authorisation
3. **Controllers** – Receive the request, extract data, and delegate to the Service
4. **Services** – Contain all business logic and communication with the database
5. **Prisma Client** – ORM that manages communication with PostgreSQL

### Principles Followed

- **Separation of Responsibilities** – Each layer has a specific responsibility
- **Single Responsibility Principle** – One controller/service per operation
- **Reusability** – Shared middlewares between routes
- **Centralised Validation** – Zod schemas validate data before reaching the controller

---

## 🚀 Technologies and Versions

### Production Dependencies

| Technology     | Version | Purpose                                |
| -------------- | ------- | -------------------------------------- |
| express        | ^5.1.0  | Web framework for creating REST APIs   |
| @prisma/client | ^6.19.0 | ORM for database communication         |
| typescript     | ^5.9.3  | JavaScript superset with static typing |
| zod            | ^4.1.12 | Schema validation and typing library   |
| bcryptjs       | ^3.0.3  | Password encryption                    |
| jsonwebtoken   | ^9.0.2  | JWT token generation and validation    |
| cors           | ^2.8.5  | Middleware to enable CORS              |
| dotenv         | ^17.2.3 | Environment variable loading           |
| tsx            | ^4.20.6 | TypeScript executor for development    |

### Development Dependencies

| Technology          | Version  | Purpose                      |
| ------------------- | -------- | ---------------------------- |
| @types/express      | ^5.0.5   | TypeScript types for Express |
| @types/cors         | ^2.8.19  | TypeScript types for CORS    |
| @types/jsonwebtoken | ^9.0.10  | TypeScript types for JWT     |
| @types/node         | ^24.10.0 | TypeScript types for Node.js |
| prisma              | ^6.19.0  | Prisma ORM CLI               |

### Database

- **PostgreSQL** (managed via Prisma ORM)

---

## 📁 Folder Structure

```
backend/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── @types/
│   ├── config/
│   ├── controllers/
│   ├── generated/
│   ├── middlewares/
│   ├── prisma/
│   ├── schemas/
│   ├── services/
│   ├── routes.ts
│   └── server.ts
├── .env
├── package.json
├── prisma.config.ts
└── tsconfig.json
```

### Naming Conventions

- **Controllers:** `<Action><Entity>Controller.ts`
- **Services:** `<Action><Entity>Service.ts`
- **Schemas:** `<entity>Schema.ts`
- **Middlewares:** `<description>.ts`

---

## 🗄️ Database Modelling

### Relationship Diagram

```
User (1)
 └─ role: STAFF | ADMIN

Category (1) ───< (N) Product
                      │
                      └─< (N) Item >─┐
                                     │
Order (1) ───────────────────────────┘
 └─ items: Item[]
```

### Entities

#### User

```ts
{
  id: string(UUID);
  name: string;
  email: string(unique);
  password: string;
  role: Role;
  createdAt: DateTime;
  updatedAt: DateTime;
}
```

Roles:

- `STAFF`
- `ADMIN`

---

#### Category

```ts
{
  id: string (UUID)
  name: string
  createdAt: DateTime
  updatedAt: DateTime
  products: Product[]
}
```

---

#### Product

```ts
{
  id: string (UUID)
  name: string
  price: number (int, cents)
  description: string
  banner: string
  disabled: boolean
  category_id: string
  category: Category
  items: Item[]
  createdAt: DateTime
  updatedAt: DateTime
}
```

Price is stored **in cents** to avoid floating-point problems.

---

#### Order

```ts
{
  id: string (UUID)
  table: number
  status: boolean
  draft: boolean
  name?: string
  items: Item[]
  createdAt: DateTime
  updatedAt: DateTime
}
```

---

#### Item

```ts
{
  id: string(UUID);
  amount: number;
  order_id: string;
  product_id: string;
  createdAt: DateTime;
  updatedAt: DateTime;
}
```

---

### Cascade Deletion

- Deleting **Product** → deletes related Items
- Deleting **Order** → deletes related Items
- Deleting **Category** → deletes related Products

---

## 🛡️ Middlewares

### isAuthenticated

Validates if the user is authenticated through JWT.

Steps:

1. Reads `Authorization: Bearer <token>`
2. Verifies token
3. Extracts `user_id`
4. Attaches `user_id` to `req`
5. Continues request

Error: `401`

---

### isAdmin

Checks if authenticated user is ADMIN.

Steps:

1. Reads `user_id`
2. Queries database
3. Confirms role is `ADMIN`

Error: `401`

---

### validateSchema

Validates request data with **Zod**.

Validates:

- body
- query
- params

Errors:

- `400` validation error
- `500` server error

---

## ✅ Validation with Schemas

### createUserSchema

```ts
{
  body: {
    name: string (min 3)
    email: valid email
    password: string (min 6)
  }
}
```

---

### authUserSchema

```ts
{
  body: {
    email: valid email
    password: string
  }
}
```

---

### createCategorySchema

```ts
{
  body: {
    name: string (min 2)
  }
}
```

---

## 🌐 Endpoints

### POST /users

Creates user.

Body:

```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "id": "uuid",
  "name": "John Smith",
  "email": "john@example.com",
  "role": "STAFF"
}
```

---

### POST /session

Authenticates user.

Returns JWT token.

---

### GET /me

Returns authenticated user.

Header:

```
Authorization: Bearer <token>
```

---

### POST /category

Creates category.

Requires:

- authentication
- admin permission

---

## 🔄 Request Flow Example

```
POST /users
 → validateSchema
 → Controller
 → Service
 → Prisma
 → Response
```

---

## ⚙️ Project Configuration

### TypeScript

Key settings:

- ES2020
- CommonJS
- Strict mode
- Output `dist`

Strict rules enabled:

- noImplicitAny
- strictNullChecks
- noUnusedLocals
- noUnusedParameters
- noImplicitReturns

---

### Prisma

Generator:

```prisma
generator client {
 provider = "prisma-client"
 output = "../src/generated/prisma"
}
```

Datasource:

```prisma
datasource db {
 provider = "postgresql"
 url = env("DATABASE_URL")
}
```

---

### Express Server

Global middlewares:

1. express.json()
2. cors()
3. router

Error handler:

```ts
app.use((error: Error, _, res: Response) => {
  if (error instanceof Error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(500).json({ error: "Internal server error" });
});
```

---

### Environment Variables

```
DATABASE_URL=postgresql://user:password@localhost:5432/restaurant
JWT_SECRET=secret
PORT=3333
```

---

### NPM Script

```
npm run dev
```

Runs server with hot reload using **tsx**.

---

## 🔐 Security

Authentication:

- JWT
- Stateless tokens

Authorisation:

- STAFF
- ADMIN

Encryption:

- bcrypt (8 rounds)

Validation:

- Zod

---

## 📝 Important Notes

- Prices stored in cents
- UUID v4 IDs
- Automatic timestamps
- Cascade delete rules
- Global error handling
- TypeScript strict mode

---

## 🚀 Starting the Project

1. Install dependencies

```
npm install
```

2. Configure environment variables

```
cp .env.example .env
```

3. Run migrations

```
npx prisma migrate dev
```

4. Start server

```
npm run dev
```

Server runs at:

```
http://localhost:3333
```

---

**Document generated on:** 09/03/2026
**Project Version:** 1.0.0
