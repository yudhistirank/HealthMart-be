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
  "userId": "john_doe",
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

## Admin Endpoints

**🔒 Note**: All admin endpoints require authentication with a user role of `admin`.

### Authentication Required
All admin endpoints require the following headers:
```
Content-Type: application/json
Authorization: Bearer {admin_jwt_token}
```

### 1. Customer Management

#### Get All Customers
**Endpoint**: `GET /api/admin/customers`

**Description**: Get list of all customer accounts (admin only)

**Response** (200):
```json
[
  {
    "_id": "64a1b2c3d4e5f6789012345",
    "username": "customer1",
    "email": "customer1@example.com",
    "contactNumber": "08123456789",
    "city": "Jakarta",
    "createdAt": "2024-11-11T12:00:00.000Z"
  },
  {
    "_id": "64a1b2c3d4e5f6789012346",
    "username": "customer2",
    "email": "customer2@example.com",
    "contactNumber": "08123456790",
    "city": "Bandung",
    "createdAt": "2024-11-11T13:00:00.000Z"
  }
]
```

#### Delete Customer
**Endpoint**: `DELETE /api/admin/customers/{customerId}`

**Description**: Delete a customer account (admin only)

**Response** (200):
```json
{
  "message": "Customer berhasil dihapus"
}
```

**Response** (404):
```json
{
  "message": "Customer tidak ditemukan"
}
```

### 2. Guestbook Management

#### Get All Guestbook Entries
**Endpoint**: `GET /api/admin/guestbook`

**Description**: Get list of all guestbook entries (admin only)

**Response** (200):
```json
[
  {
    "_id": "64a1b2c3d4e5f6789012347",
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Great service!",
    "createdAt": "2024-11-11T12:00:00.000Z"
  },
  {
    "_id": "64a1b2c3d4e5f6789012348",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "message": "Love the products",
    "createdAt": "2024-11-11T13:00:00.000Z"
  }
]
```

#### Delete Guestbook Entry
**Endpoint**: `DELETE /api/admin/guestbook/{entryId}`

**Description**: Delete a guestbook entry (admin only)

**Response** (200):
```json
{
  "message": "Guestbook entry berhasil dihapus"
}
```

**Response** (404):
```json
{
  "message": "Guestbook entry tidak ditemukan"
}
```

### 3. Category Management

#### Get All Categories
**Endpoint**: `GET /api/admin/categories`

**Description**: Get list of all categories (admin only)

**Response** (200):
```json
[
  {
    "_id": "64a1b2c3d4e5f6789012346",
    "name": "Electronics",
    "description": "Electronic devices and gadgets",
    "createdAt": "2024-11-11T12:00:00.000Z"
  }
]
```

#### Create New Category
**Endpoint**: `POST /api/admin/categories`

**Description**: Create a new product category (admin only)

**Request Body**:
```json
{
  "name": "Medical Equipment",
  "description": "Healthcare and medical devices"
}
```

**Response** (201):
```json
{
  "_id": "64a1b2c3d4e5f6789012349",
  "name": "Medical Equipment",
  "description": "Healthcare and medical devices",
  "createdAt": "2024-11-11T14:00:00.000Z"
}
```

**Response** (400 - Validation Error):
```json
{
  "errors": [
    {
      "msg": "Name is required",
      "param": "name",
      "location": "body"
    }
  ]
}
```

#### Update Category
**Endpoint**: `PUT /api/admin/categories/{categoryId}`

**Description**: Update an existing category (admin only)

**Request Body**:
```json
{
  "name": "Medical Equipment & Supplies",
  "description": "Healthcare, medical devices and supplies"
}
```

**Response** (200):
```json
{
  "_id": "64a1b2c3d4e5f6789012349",
  "name": "Medical Equipment & Supplies",
  "description": "Healthcare, medical devices and supplies",
  "createdAt": "2024-11-11T14:00:00.000Z"
}
```

**Response** (404):
```json
{
  "message": "Kategori tidak ditemukan"
}
```

#### Delete Category
**Endpoint**: `DELETE /api/admin/categories/{categoryId}`

**Description**: Delete a category (admin only)

**Response** (200):
```json
{
  "message": "Kategori berhasil dihapus"
}
```

**Response** (404):
```json
{
  "message": "Kategori tidak ditemukan"
}
```

### 4. Order Management

#### Get All Orders
**Endpoint**: `GET /api/admin/orders`

**Description**: Get list of all orders in the system (admin only)

**Response** (200):
```json
[
  {
    "_id": "64a1b2c3d4e5f6789012347",
    "customer": {
      "_id": "64a1b2c3d4e5f6789012345",
      "username": "customer1",
      "email": "customer1@example.com"
    },
    "items": [
      {
        "product": {
          "_id": "64a1b2c3d4e5f6789012346",
          "name": "Digital Thermometer",
          "price": 150000
        },
        "name": "Digital Thermometer",
        "price": 150000,
        "quantity": 1
      }
    ],
    "total": 150000,
    "status": "paid",
    "paymentMethod": "credit_card",
    "shippingInfo": {
      "address": "Jl. Kesehatan No. 123",
      "city": "Jakarta",
      "contactNumber": "08123456789"
    },
    "createdAt": "2024-11-11T12:00:00.000Z"
  }
]
```

#### Update Order Shipping Status
**Endpoint**: `PUT /api/admin/orders/{orderId}/shipping`

**Description**: Update order shipping status (admin only)

**Request Body**:
```json
{
  "status": "shipped"
}
```

**Valid Status Values**:
- `pending` - Order created, waiting for payment
- `paid` - Payment received
- `shipped` - Order shipped to customer
- `cancelled` - Order cancelled

**Response** (200):
```json
{
  "_id": "64a1b2c3d4e5f6789012347",
  "customer": {
    "_id": "64a1b2c3d4e5f6789012345",
    "username": "customer1",
    "email": "customer1@example.com"
  },
  "items": [...],
  "total": 150000,
  "status": "shipped",
  "paymentMethod": "credit_card",
  "createdAt": "2024-11-11T12:00:00.000Z"
}
```

**Response** (400 - Invalid Status):
```json
{
  "message": "Status tidak valid"
}
```

**Response** (404):
```json
{
  "message": "Order tidak ditemukan"
}
```

### 5. Shop Request Management

#### Get All Shop Requests
**Endpoint**: `GET /api/admin/shop-requests`

**Description**: Get list of all shop creation requests (admin only)

**Response** (200):
```json
[
  {
    "_id": "64a1b2c3d4e5f6789012348",
    "vendorId": {
      "_id": "64a1b2c3d4e5f6789012345",
      "username": "vendor1",
      "email": "vendor1@example.com"
    },
    "vendorName": "Healthy Shop Jakarta",
    "description": "We want to open a medical supplies store",
    "status": "pending",
    "createdAt": "2024-11-11T12:00:00.000Z"
  }
]
```

#### Create Shop Request (Vendor)
**Endpoint**: `POST /api/admin/shop-requests`

**Description**: Create a new shop creation request (for vendors)

**Headers**:
```
Content-Type: application/json
Authorization: Bearer {vendor_jwt_token}
```

**Request Body**:
```json
{
  "vendorName": "Healthy Shop Jakarta",
  "description": "We want to open a medical supplies store focusing on health equipment"
}
```

**Response** (201):
```json
{
  "_id": "64a1b2c3d4e5f6789012348",
  "vendorId": "64a1b2c3d4e5f6789012345",
  "vendorName": "Healthy Shop Jakarta",
  "description": "We want to open a medical supplies store focusing on health equipment",
  "status": "pending",
  "createdAt": "2024-11-11T14:00:00.000Z"
}
```

**Response** (400 - Validation Error):
```json
{
  "errors": [
    {
      "msg": "vendorName is required",
      "param": "vendorName",
      "location": "body"
    }
  ]
}
```

#### Approve Shop Request
**Endpoint**: `PUT /api/admin/shop-requests/{requestId}/approve`

**Description**: Approve a shop creation request (admin only)

**Response** (200):
```json
{
  "_id": "64a1b2c3d4e5f6789012348",
  "vendorId": {
    "_id": "64a1b2c3d4e5f6789012345",
    "username": "vendor1",
    "email": "vendor1@example.com"
  },
  "vendorName": "Healthy Shop Jakarta",
  "description": "We want to open a medical supplies store",
  "status": "approved",
  "createdAt": "2024-11-11T12:00:00.000Z"
}
```

#### Reject Shop Request
**Endpoint**: `PUT /api/admin/shop-requests/{requestId}/reject`

**Description**: Reject a shop creation request (admin only)

**Response** (200):
```json
{
  "_id": "64a1b2c3d4e5f6789012348",
  "vendorId": {
    "_id": "64a1b2c3d4e5f6789012345",
    "username": "vendor1",
    "email": "vendor1@example.com"
  },
  "vendorName": "Healthy Shop Jakarta",
  "description": "We want to open a medical supplies store",
  "status": "rejected",
  "createdAt": "2024-11-11T12:00:00.000Z"
}
```

**Response** (404):
```json
{
  "message": "Permintaan tidak ditemukan"
}
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
---

## Example Admin API Calls for Testing

### 1. Login as Admin
```bash
POST /api/auth/login
Content-Type: application/json

{
  "userId": "admin",
  "password": "admin123"
}
```

### 2. Get All Customers (Admin Only)
```bash
GET /api/admin/customers
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

### 3. Delete Customer (Admin Only)
```bash
DELETE /api/admin/customers/64a1b2c3d4e5f6789012345
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

### 4. Get All Guestbook Entries (Admin Only)
```bash
GET /api/admin/guestbook
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

### 5. Delete Guestbook Entry (Admin Only)
```bash
DELETE /api/admin/guestbook/64a1b2c3d4e5f6789012347
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

### 6. Create New Category (Admin Only)
```bash
POST /api/admin/categories
Authorization: Bearer {{admin_token}}
Content-Type: application/json

{
  "name": "Medical Equipment",
  "description": "Healthcare and medical devices"
}
```

### 7. Update Category (Admin Only)
```bash
PUT /api/admin/categories/64a1b2c3d4e5f6789012349
Authorization: Bearer {{admin_token}}
Content-Type: application/json

{
  "name": "Medical Equipment & Supplies",
  "description": "Healthcare, medical devices and supplies"
}
```

### 8. Delete Category (Admin Only)
```bash
DELETE /api/admin/categories/64a1b2c3d4e5f6789012349
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

### 9. Get All Orders (Admin Only)
```bash
GET /api/admin/orders
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

### 10. Update Order Shipping Status (Admin Only)
```bash
PUT /api/admin/orders/64a1b2c3d4e5f6789012347/shipping
Authorization: Bearer {{admin_token}}
Content-Type: application/json

{
  "status": "shipped"
}
```

### 11. Get All Shop Requests (Admin Only)
```bash
GET /api/admin/shop-requests
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

### 12. Approve Shop Request (Admin Only)
```bash
PUT /api/admin/shop-requests/64a1b2c3d4e5f6789012348/approve
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

### 13. Reject Shop Request (Admin Only)
```bash
PUT /api/admin/shop-requests/64a1b2c3d4e5f6789012348/reject
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

### 14. Create Shop Request (Vendor)
```bash
POST /api/admin/shop-requests
Authorization: Bearer {{vendor_token}}
Content-Type: application/json

{
  "vendorName": "Healthy Shop Jakarta",
  "description": "We want to open a medical supplies store focusing on health equipment"
}
```

### 6. Create Admin User (Database Setup)
```bash
# Note: This must be done directly in MongoDB or by changing user role
# Create user with admin role in the database
```