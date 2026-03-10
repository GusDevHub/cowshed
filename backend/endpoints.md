# 📚 API Documentation - Restaurant System

## 📋 Index

1. [Authentication](#authentication)
2. [Users](#users)
3. [Categories](#categories)
4. [Products](#products)
5. [Orders](#orders)
6. [Summary Table](#summary-table)

---

## 🔐 Authentication

The API uses **JWT (JSON Web Tokens)** for authentication. After logging in, you will receive a token that must be included in all authenticated requests.

### How to Use the Token

```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

---

## 👤 Users

### 1. Create User

Creates a new user in the system.

**Endpoint:** `POST /users`

**Authentication:** ❌ Not required
**Permission:** Public

**Headers:**

```
Content-Type: application/json
```

**Body:**

```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "password": "password123"
}
```

**Validations:**

- `name`: Minimum 3 characters (required)
- `email`: Valid email (required)
- `password`: Minimum 6 characters (required)

**Successful Response (200):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "John Smith",
  "email": "john@example.com",
  "role": "STAFF",
  "createdAt": "2025-11-12T10:30:00.000Z",
  "updatedAt": "2025-11-12T10:30:00.000Z"
}
```

**Error Responses:**

```json
// 400 - User already exists
{
  "error": "User already exists!"
}

// 400 - Validation failed
{
  "error": "Validation error",
  "details": [
    { "message": "Name must have at least 3 characters" },
    { "message": "Must be a valid email" }
  ]
}
```

**Notes:**

- Password is encrypted with bcrypt (salt: 8 rounds)
- Default role is `STAFF`
- Password is never returned in the response

---

### 2. Authenticate User (Login)

Authenticates a user and returns a JWT token.

**Endpoint:** `POST /session`

**Authentication:** ❌ Not required
**Permission:** Public

**Headers:**

```
Content-Type: application/json
```

**Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Validations:**

- `email`: Valid email (required)
- `password`: Non-empty string (required)

**Successful Response (200):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "John Smith",
  "email": "john@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**

```json
// 400 - Invalid credentials
{
  "error": "Incorrect email or password!"
}

// 400 - Validation failed
{
  "error": "Validation error",
  "details": [
    { "message": "Must be a valid email" }
  ]
}
```

**Notes:**

- JWT token contains `user_id` in the `sub` field
- Token must be used in authenticated requests
- Token expiration is configured through an environment variable

---

### 3. Authenticated User Details

Returns information about the logged-in user.

**Endpoint:** `GET /me`

**Authentication:** ✅ Required
**Permission:** STAFF or ADMIN

**Headers:**

```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Successful Response (200):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "John Smith",
  "email": "john@example.com",
  "role": "STAFF"
}
```

**Error Responses:**

```json
// 401 - Invalid or missing token
{
  "error": "Invalid or missing token"
}
```

---

## 📂 Categories

### 1. Create Category

Creates a new product category.

**Endpoint:** `POST /category`

**Authentication:** ✅ Required
**Permission:** ADMIN only

**Headers:**

```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Body:**

```json
{
  "name": "Desserts"
}
```

**Validations:**

- `name`: Minimum 2 characters (required)

**Successful Response (201):**

```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "name": "Desserts",
  "createdAt": "2025-11-12T10:30:00.000Z",
  "updatedAt": "2025-11-12T10:30:00.000Z"
}
```

**Error Responses:**

```json
// 401 - Not authenticated
{
  "error": "Invalid or missing token"
}

// 401 - No permission
{
  "error": "User does not have permission"
}

// 400 - Validation failed
{
  "error": "Validation error",
  "details": [
    { "message": "Category name must have at least 2 characters" }
  ]
}
```

---

### 2. List Categories

Lists all registered categories.

**Endpoint:** `GET /category`

**Authentication:** ✅ Required
**Permission:** STAFF or ADMIN

**Headers:**

```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Successful Response (200):**

```json
[
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "Mains",
    "createdAt": "2025-11-12T10:30:00.000Z"
  },
  {
    "id": "660e8400-e29b-41d4-a716-446655440002",
    "name": "Desserts",
    "createdAt": "2025-11-12T10:35:00.000Z"
  },
  {
    "id": "660e8400-e29b-41d4-a716-446655440003",
    "name": "Drinks",
    "createdAt": "2025-11-12T10:40:00.000Z"
  }
]
```

**Notes:**

- Categories are sorted by creation date (most recent first)
- Only `id`, `name`, and `createdAt` are returned

---

## 🍕 Products

### 1. Create Product

Creates a new product with an image upload.

**Endpoint:** `POST /product`

**Authentication:** ✅ Required
**Permission:** ADMIN only

**Headers:**

```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data
```

**Body (FormData):**

```
name: "Pizza Margherita"
price: "3500"
description: "Tomato sauce, mozzarella and basil"
category_id: "660e8400-e29b-41d4-a716-446655440001"
file: [image file]
```

**Validations:**

- `name`: Minimum 1 character (required)
- `price`: Non-empty string (required) – value in pennies
- `description`: Minimum 1 character (required)
- `category_id`: Valid UUID (required)
- `file`: Required image (JPEG, JPG, PNG – max 4MB)

**Successful Response (200):**

```json
{
  "id": "770e8400-e29b-41d4-a716-446655440001",
  "name": "Pizza Margherita",
  "price": 3500,
  "description": "Tomato sauce, mozzarella and basil",
  "banner": "https://res.cloudinary.com/.../products/margherita.jpg",
  "disabled": false,
  "category_id": "660e8400-e29b-41d4-a716-446655440001",
  "createdAt": "2025-11-12T10:30:00.000Z",
  "updatedAt": "2025-11-12T10:30:00.000Z"
}
```

**Notes:**

- Price is stored in pennies
- Image is uploaded to Cloudinary
- `disabled` defaults to `false`

---

### 2. List Products

Lists products with an optional status filter.

**Endpoint:** `GET /products`

**Authentication:** ✅ Required
**Permission:** STAFF or ADMIN

**Query Parameters:**

```
disabled: "true" | "false" (optional, default: "false")
```

**Examples:**

```
GET /products
GET /products?disabled=false
GET /products?disabled=true
```

**Notes:**

- Products are ordered by creation date (most recent first)
- Includes related category data

---

### 3. Disable Product (Soft Delete)

Disables a product without removing it from the database.

**Endpoint:** `DELETE /product`

**Authentication:** ✅ Required
**Permission:** ADMIN only

**Query Parameters:**

```
product_id: "770e8400-e29b-41d4-a716-446655440001"
```

**Response (200):**

```json
{
  "message": "Product successfully deleted/archived!"
}
```

**Notes:**

- The product remains in the database
- `disabled` is set to `true`

---

### 4. List Products by Category

Lists active products from a specific category.

**Endpoint:** `GET /category/product`

**Authentication:** ✅ Required
**Permission:** STAFF or ADMIN

**Query Parameters:**

```
category_id: "660e8400-e29b-41d4-a716-446655440001"
```

**Notes:**

- Returns only products with `disabled: false`
- Includes category data

---

## 🛒 Orders

### 1. Create Order

Creates a new order (initially as a draft).

**Endpoint:** `POST /order`

**Authentication:** ✅ Required
**Permission:** STAFF or ADMIN

**Body:**

```json
{
  "table": 5,
  "name": "John's Table"
}
```

**Successful Response (201):**

```json
{
  "id": "880e8400-e29b-41d4-a716-446655440001",
  "table": 5,
  "status": false,
  "draft": true,
  "name": "John's Table",
  "createdAt": "2025-11-12T10:30:00.000Z"
}
```

**Notes:**

- Order is created as a draft (`draft: true`)
- Initial status is `false` (not finished)

---

### 2. Add Item to Order

Adds a product to an existing order.

**Endpoint:** `POST /order/add`

**Body:**

```json
{
  "order_id": "880e8400-e29b-41d4-a716-446655440001",
  "product_id": "770e8400-e29b-41d4-a716-446655440001",
  "amount": 2
}
```

**Notes:**

- Validates whether order exists
- Validates whether product exists and is active

---

### 3. Remove Item from Order

Removes a specific item from an order.

**Endpoint:** `DELETE /order/remove`

**Query Parameters:**

```
item_id: "990e8400-e29b-41d4-a716-446655440001"
```

---

### 4. Send Order (Confirm)

Sends the order to the kitchen.

**Endpoint:** `PUT /order/send`

**Body:**

```json
{
  "order_id": "880e8400-e29b-41d4-a716-446655440001",
  "name": "Table 5 - John"
}
```

**Notes:**

- Changes `draft` from `true` to `false`
- Order becomes visible in the kitchen

---

### 5. Finish Order

Marks an order as completed.

**Endpoint:** `PUT /order/finish`

**Body:**

```json
{
  "order_id": "880e8400-e29b-41d4-a716-446655440001"
}
```

**Notes:**

- Changes `status` from `false` to `true`

---

### 6. List Orders

Lists orders with a draft filter.

**Endpoint:** `GET /orders`

**Query Parameters:**

```
draft: "true" | "false" (optional, default: "false")
```

---

### 7. Order Details

Retrieves full details of a specific order.

**Endpoint:** `GET /order/detail`

**Query Parameters:**

```
order_id: "880e8400-e29b-41d4-a716-446655440001"
```

---

### 8. Delete Order

Permanently deletes an order and its items.

**Endpoint:** `DELETE /order`

**Query Parameters:**

```
order_id: "880e8400-e29b-41d4-a716-446655440001"
```

---

## 📊 Summary Table

| Method | Route             | Authentication | Permission  | Description          |
| ------ | ----------------- | -------------- | ----------- | -------------------- |
| POST   | /users            | ❌             | Public      | Create user          |
| POST   | /session          | ❌             | Public      | Login                |
| GET    | /me               | ✅             | STAFF/ADMIN | Authenticated user   |
| POST   | /category         | ✅             | ADMIN       | Create category      |
| GET    | /category         | ✅             | STAFF/ADMIN | List categories      |
| POST   | /product          | ✅             | ADMIN       | Create product       |
| GET    | /products         | ✅             | STAFF/ADMIN | List products        |
| DELETE | /product          | ✅             | ADMIN       | Disable product      |
| GET    | /category/product | ✅             | STAFF/ADMIN | Products by category |
| POST   | /order            | ✅             | STAFF/ADMIN | Create order         |
| POST   | /order/add        | ✅             | STAFF/ADMIN | Add item             |
| DELETE | /order/remove     | ✅             | STAFF/ADMIN | Remove item          |
| PUT    | /order/send       | ✅             | STAFF/ADMIN | Send order           |
| PUT    | /order/finish     | ✅             | STAFF/ADMIN | Finish order         |
| GET    | /orders           | ✅             | STAFF/ADMIN | List orders          |
| GET    | /order/detail     | ✅             | STAFF/ADMIN | Order details        |
| DELETE | /order            | ✅             | STAFF/ADMIN | Delete order         |

---

## 🔑 HTTP Status Codes

| Code | Meaning        | When Used                          |
| ---- | -------------- | ---------------------------------- |
| 200  | OK             | Successful request                 |
| 201  | Created        | Resource created                   |
| 400  | Bad Request    | Validation or business logic error |
| 401  | Unauthorized   | Invalid token or no permission     |
| 500  | Internal Error | Server error                       |

---

## 📝 Important Notes

### Prices

- Prices are stored and returned in **pennies** (integer)
- Example: `3500` = £35.00
- Prevents floating-point arithmetic issues

### IDs

- All IDs are **UUID v4**
- Example format:

```
550e8400-e29b-41d4-a716-446655440000
```

### Timestamps

- `createdAt` – Creation date
- `updatedAt` – Update date
- Format: ISO 8601

```
2025-11-12T10:30:00.000Z
```

### Soft Delete

- Products use `disabled`
- `true` = disabled
- `false` = active

### Order Status

- `draft` → order still being edited
- `status` → order finished

### Image Upload

- Accepted formats: JPEG, JPG, PNG
- Max size: 4MB
- Storage: Cloudinary
- Processing: Multer (memoryStorage)

### Validation

- All routes validate data using **Zod**
- Error messages are descriptive and in English
- Validation errors return status `400`

---

**Document created on:** 10/03/2026
**API Version:** 2.0.0
**Last Update:** Complete documentation of all endpoints
