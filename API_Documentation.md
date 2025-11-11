# E-Commerce Backend API Documentation

## Base Information
- **Base URL**: `http://localhost:5000`
- **Environment**: Development
- **Authentication**: JWT Bearer Token
- **Content-Type**: `application/json`

---

## Authentication Endpoints

### 1. User Registration
**Endpoint**: `POST /api/auth/register`

**Description**: Register a new user account

**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "username": "john_doe",
  "password": "password123",
  "retypePassword": "password123",
  "email": "john@example.com",
  "dob": "1990-01-01",
  "gender": "male",
  "address": "Jl. Jalan No. 123",
  "city": "Jakarta",
  "contactNumber": "08123456789",
  "paypalId": "john.doe@paypal.com"
}
```

**Response** (201):
```json
{
  "_id": "64a1b2c3d4e5f6789012345",
  "username": "john_doe",
  "email": "john@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response** (400 - Validation Error):
```json
{
  "message": "Semua field wajib diisi"
}
```

### 2. User Login
**Endpoint**: `POST /api/auth/login`

**Description**: Login with username or email and password

**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "userId": "john_doe", // or "john@example.com"
  "password": "password123"
}
```

**Response** (200):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64a1b2c3d4e5f6789012345",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

### 3. Get Current User Profile
**Endpoint**: `GET /api/auth/me`

**Description**: Get current authenticated user profile

**Headers**:
```
Content-Type: application/json
Authorization: Bearer {your_jwt_token}
```

**Response** (200):
```json
{
  "_id": "64a1b2c3d4e5f6789012345",
  "username": "john_doe",
  "email": "john@example.com",
  "dob": "1990-01-01T00:00:00.000Z",
  "gender": "male",
  "address": "Jl. Jalan No. 123",
  "city": "Jakarta",
  "contactNumber": "08123456789",
  "paypalId": "john.doe@paypal.com",
  "role": "customer",
  "createdAt": "2024-11-11T12:00:00.000Z"
}
```

### 4. Update User Profile
**Endpoint**: `PUT /api/auth/profile`

**Description**: Update current user profile

**Headers**:
```
Content-Type: application/json
Authorization: Bearer {your_jwt_token}
```

**Request Body** (all fields optional):
```json
{
  "username": "john_doe_updated",
  "email": "john.updated@example.com",
  "address": "Jl. Baru No. 456",
  "city": "Bandung"
}
```

**Response** (200):
```json
{
  "_id": "64a1b2c3d4e5f6789012345",
  "username": "john_doe_updated",
  "email": "john.updated@example.com",
  "dob": "1990-01-01T00:00:00.000Z",
  "gender": "male",
  "address": "Jl. Baru No. 456",
  "city": "Bandung",
  "contactNumber": "08123456789",
  "paypalId": "john.doe@paypal.com",
  "role": "customer"
}
```

### 5. Logout
**Endpoint**: `POST /api/auth/logout`

**Description**: Logout current user

**Headers**:
```
Content-Type: application/json
Authorization: Bearer {your_jwt_token}
```

**Response** (200):
```json
{
  "message": "Logout berhasil"
}
```

---

## Product Endpoints

### 1. Get Products List
**Endpoint**: `GET /api/products`

**Description**: Get paginated list of products

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 12)
- `category` (optional): Filter by category ID
- `q` (optional): Search by product name

**Headers**:
```
Content-Type: application/json
```

**Response** (200):
```json
{
  "total": 50,
  "page": 1,
  "limit": 12,
  "products": [
    {
      "_id": "64a1b2c3d4e5f6789012345",
      "name": "Sample Product",
      "description": "A great product description",
      "images": ["https://example.com/image1.jpg"],
      "price": 100000,
      "stock": 50,
      "category": {
        "_id": "64a1b2c3d4e5f6789012346",
        "name": "Electronics"
      },
      "createdAt": "2024-11-11T12:00:00.000Z"
    }
  ]
}
```

### 2. Get Product Details
**Endpoint**: `GET /api/products/{id}`

**Description**: Get detailed information about a specific product

**Headers**:
```
Content-Type: application/json
```

**Response** (200):
```json
{
  "_id": "64a1b2c3d4e5f6789012345",
  "name": "Sample Product",
  "description": "A detailed product description",
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ],
  "price": 100000,
  "stock": 50,
  "category": {
    "_id": "64a1b2c3d4e5f6789012346",
    "name": "Electronics"
  },
  "createdAt": "2024-11-11T12:00:00.000Z"
}
```

---

## Cart Endpoints

### 1. Get User Cart
**Endpoint**: `GET /api/cart`

**Description**: Get current user's shopping cart

**Headers**:
```
Content-Type: application/json
Authorization: Bearer {your_jwt_token}
```

**Response** (200):
```json
{
  "_id": "64a1b2c3d4e5f6789012345",
  "user": "64a1b2c3d4e5f6789012345",
  "items": [
    {
      "product": {
        "_id": "64a1b2c3d4e5f6789012346",
        "name": "Sample Product",
        "price": 100000,
        "images": ["https://example.com/image1.jpg"],
        "stock": 50
      },
      "quantity": 2,
      "price": 100000
    }
  ],
  "total": 200000,
  "createdAt": "2024-11-11T12:00:00.000Z",
  "updatedAt": "2024-11-11T12:30:00.000Z"
}
```

### 2. Add Item to Cart
**Endpoint**: `POST /api/cart/add`

**Description**: Add a product to the shopping cart

**Headers**:
```
Content-Type: application/json
Authorization: Bearer {your_jwt_token}
```

**Request Body**:
```json
{
  "productId": "64a1b2c3d4e5f6789012346",
  "quantity": 2
}
```

**Response** (200):
```json
{
  "message": "Produk berhasil ditambahkan ke keranjang",
  "cart": {
    "_id": "64a1b2c3d4e5f6789012345",
    "items": [...],
    "total": 200000
  }
}
```

### 3. Update Cart Item
**Endpoint**: `PUT /api/cart/update`

**Description**: Update quantity of an item in the cart

**Headers**:
```
Content-Type: application/json
Authorization: Bearer {your_jwt_token}
```

**Request Body**:
```json
{
  "productId": "64a1b2c3d4e5f6789012346",
  "quantity": 3
}
```

**Response** (200):
```json
{
  "message": "Keranjang berhasil diperbarui",
  "cart": {
    "_id": "64a1b2c3d4e5f6789012345",
    "items": [...],
    "total": 300000
  }
}
```

### 4. Remove Item from Cart
**Endpoint**: `DELETE /api/cart/remove/{productId}`

**Description**: Remove a specific item from the cart

**Headers**:
```
Content-Type: application/json
Authorization: Bearer {your_jwt_token}
```

**Response** (200):
```json
{
  "message": "Produk berhasil dihapus dari keranjang",
  "cart": {
    "_id": "64a1b2c3d4e5f6789012345",
    "items": [...],
    "total": 100000
  }
}
```

### 5. Clear Cart
**Endpoint**: `DELETE /api/cart/clear`

**Description**: Remove all items from the cart

**Headers**:
```
Content-Type: application/json
Authorization: Bearer {your_jwt_token}
```

**Response** (200):
```json
{
  "message": "Keranjang berhasil dikosongkan",
  "cart": {
    "_id": "64a1b2c3d4e5f6789012345",
    "items": [],
    "total": 0
  }
}
```

---

## Order Endpoints

### 1. Create Order
**Endpoint**: `POST /api/orders`

**Description**: Create a new order from cart items

**Headers**:
```
Content-Type: application/json
Authorization: Bearer {your_jwt_token}
```

**Request Body**:
```json
{
  "items": [
    {
      "product": "64a1b2c3d4e5f6789012346",
      "quantity": 2
    }
  ],
  "totalAmount": 200000,
  "paymentMethod": "cash_on_delivery"
}
```

**Response** (201):
```json
{
  "_id": "64a1b2c3d4e5f6789012347",
  "user": "64a1b2c3d4e5f6789012345",
  "status": "pending"
}
```

### 2. Checkout from Cart
**Endpoint**: `POST /api/orders/checkout`

**Description**: Checkout all items from cart

**Headers**:
```
Content-Type: application/json
Authorization: Bearer {your_jwt_token}
```

**Request Body**:
```json
{
  "paymentMethod": "paypal"
}
```

**Response** (200):
```json
{
  "message": "Checkout berhasil",
  "order": {
    "_id": "64a1b2c3d4e5f6789012347",
    "customer": "64a1b2c3d4e5f6789012345",
    "items": [...],
    "total": 200000,
    "paymentMethod": "paypal",
    "status": "pending"
  }
}
```

### 3. Process Payment
**Endpoint**: `POST /api/orders/{id}/pay`

**Description**: Process payment for an order

**Headers**:
```
Content-Type: application/json
Authorization: Bearer {your_jwt_token}
```

**Request Body**:
```json
{
  "paymentMethod": "credit_card",
  "paymentDetails": {
    "cardNumber": "****-****-****-1234",
    "expiryDate": "12/25"
  }
}
```

**Response** (200):
```json
{
  "message": "Pembayaran kartu berhasil diproses",
  "order": {
    "_id": "64a1b2c3d4e5f6789012347",
    "status": "paid",
    "paymentMethod": "credit_card"
  },
  "paymentMethod": "credit_card"
}
```

### 4. Get Order Details
**Endpoint**: `GET /api/orders/{id}`

**Description**: Get details of a specific order

**Headers**:
```
Content-Type: application/json
Authorization: Bearer {your_jwt_token}
```

**Response** (200):
```json
{
  "_id": "64a1b2c3d4e5f6789012347",
  "customer": {
    "username": "john_doe",
    "email": "john@example.com"
  },
  "items": [
    {
      "product": {
        "_id": "64a1b2c3d4e5f6789012346",
        "name": "Sample Product"
      },
      "name": "Sample Product",
      "price": 100000,
      "quantity": 2
    }
  ],
  "total": 200000,
  "status": "pending",
  "paymentMethod": "cash_on_delivery",
  "createdAt": "2024-11-11T12:00:00.000Z"
}
```

### 5. Generate Receipt
**Endpoint**: `GET /api/orders/{id}/receipt`

**Description**: Generate receipt for an order

**Headers**:
```
Content-Type: application/json
Authorization: Bearer {your_jwt_token}
```

**Response** (200):
```json
{
  "message": "Struk pembayaran",
  "receipt": {
    "orderId": "64a1b2c3d4e5f6789012347",
    "customer": {
      "name": "john_doe",
      "email": "john@example.com"
    },
    "items": [
      {
        "name": "Sample Product",
        "quantity": 2,
        "price": 100000,
        "subtotal": 200000
      }
    ],
    "total": 200000,
    "paymentMethod": "cash_on_delivery",
    "status": "pending",
    "date": "2024-11-11T12:00:00.000Z"
  }
}
```

### 6. Get My Orders
**Endpoint**: `GET /api/orders/my-orders`

**Description**: Get current user's order history

**Headers**:
```
Content-Type: application/json
Authorization: Bearer {your_jwt_token}
```

**Response** (200):
```json
[
  {
    "_id": "64a1b2c3d4e5f6789012347",
    "items": [
      {
        "product": {
          "name": "Sample Product",
          "price": 100000
        },
        "quantity": 2
      }
    ],
    "total": 200000,
    "status": "pending",
    "createdAt": "2024-11-11T12:00:00.000Z"
  }
]
```

---

## Category Endpoints

### 1. Get Categories List
**Endpoint**: `GET /api/categories`

**Description**: Get list of all product categories

**Headers**:
```
Content-Type: application/json
```

**Response** (200):
```json
[
  {
    "_id": "64a1b2c3d4e5f6789012346",
    "name": "Electronics",
    "description": "Electronic devices and gadgets",
    "createdAt": "2024-11-11T12:00:00.000Z"
  },
  {
    "_id": "64a1b2c3d4e5f6789012348",
    "name": "Clothing",
    "description": "Fashion and apparel",
    "createdAt": "2024-11-11T12:00:00.000Z"
  }
]
```

---

## Payment Methods

The following payment methods are supported:

1. **debit_card** - Debit card payment
2. **credit_card** - Credit card payment
3. **paypal** - PayPal payment
4. **bank_transfer** - Bank transfer
5. **e_wallet** - E-wallet payment
6. **cash_on_delivery** - Cash on delivery
7. **other** - Other payment methods

---

## Error Responses

### 400 - Bad Request
```json
{
  "message": "Pesan error dalam bahasa Indonesia"
}
```

### 401 - Unauthorized
```json
{
  "message": "Token tidak disediakan"
}
```

### 403 - Forbidden
```json
{
  "message": "Akses ditolak"
}
```

### 404 - Not Found
```json
{
  "message": "Data tidak ditemukan"
}
```

### 500 - Internal Server Error
```json
{
  "message": "Kesalahan server"
}
```

---

## Postman Environment Setup

### Environment Variables
Create an environment with these variables:

| Variable | Initial Value | Description |
|----------|---------------|-------------|
| `baseUrl` | `http://localhost:5000` | API base URL |
| `token` | `{{token}}` | JWT token from login response |
| `userId` | `{{userId}}` | User ID from registration/login |
| `orderId` | `{{orderId}}` | Order ID for order-related requests |
| `productId` | `{{productId}}` | Product ID for product requests |

### Authentication
1. **Pre-request Script for authenticated requests**:
```javascript
pm.request.headers.add({
    key: 'Authorization',
    value: 'Bearer ' + pm.environment.get('token')
});
```

2. **Login Pre-request** (for getting token):
```javascript
// Store token and userId from login response
pm.test("Login successful", function () {
    const response = pm.response.json();
    if (response.token) {
        pm.environment.set('token', response.token);
        pm.environment.set('userId', response.user._id);
    }
});
```

---

## Example API Calls for Testing

### 1. User Registration
```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123",
  "retypePassword": "password123",
  "email": "test@example.com",
  "dob": "1990-01-01",
  "gender": "male",
  "address": "Test Address",
  "city": "Test City",
  "contactNumber": "08123456789",
  "paypalId": "test@paypal.com"
}
```

### 2. User Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "userId": "testuser",
  "password": "password123"
}
```

### 3. Add Product to Cart
```bash
POST /api/cart/add
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "productId": "64a1b2c3d4e5f6789012346",
  "quantity": 2
}
```

### 4. Checkout Order
```bash
POST /api/orders/checkout
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "paymentMethod": "paypal"
}
```

### 5. Process Payment
```bash
POST /api/orders/{{orderId}}/pay
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "paymentMethod": "credit_card",
  "paymentDetails": {
    "cardNumber": "****-****-****-1234"
  }
}