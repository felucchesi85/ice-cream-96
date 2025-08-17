# API Specification - Heladería Backend

## Resumen General

Esta documentación define todos los endpoints y contratos de API que el frontend Next.js necesita del backend Java. El sistema está diseñado con arquitectura de microservicios y utiliza Spring Boot.

## Base URL
\`\`\`
Desarrollo: http://localhost:8080/api
Producción: https://tu-dominio.com/api
\`\`\`

## Autenticación

### Admin Authentication
- **Método**: JWT Token
- **Header**: `Authorization: Bearer <token>`
- **Storage**: localStorage con key "admin-token"

---

## 1. ORDERS API (Microservicio de Ventas)

### POST /api/orders
**Descripción**: Crear nueva orden de compra

**Request Body**:
\`\`\`json
{
  "customerInfo": {
    "name": "string",
    "email": "string", 
    "phone": "string",
    "address": "string",
    "city": "string",
    "postalCode": "string"
  },
  "items": [
    {
      "id": "string",
      "name": "string",
      "price": "number",
      "quantity": "number",
      "category": "string",
      "flavors": ["string"] // opcional, solo para productos con sabores
    }
  ],
  "paymentMethod": "efectivo" | "tarjeta" | "transferencia",
  "deliveryMethod": "delivery" | "pickup",
  "total": "number",
  "notes": "string" // opcional
}
\`\`\`

**Response (201 Created)**:
\`\`\`json
{
  "success": true,
  "data": {
    "orderId": "string",
    "orderNumber": "string", // ej: "ORD-2024-001"
    "status": "pending",
    "total": "number",
    "createdAt": "ISO 8601 date"
  }
}
\`\`\`

**Response (400 Bad Request)**:
\`\`\`json
{
  "success": false,
  "error": "Validation error message",
  "details": ["array of specific errors"]
}
\`\`\`

### GET /api/orders/{orderId}
**Descripción**: Obtener detalles de una orden específica

**Response (200 OK)**:
\`\`\`json
{
  "success": true,
  "data": {
    "id": "string",
    "orderNumber": "string",
    "status": "pending" | "confirmed" | "preparing" | "ready" | "delivered" | "cancelled",
    "customerInfo": {
      "name": "string",
      "email": "string",
      "phone": "string", 
      "address": "string",
      "city": "string",
      "postalCode": "string"
    },
    "items": [
      {
        "id": "string",
        "name": "string",
        "price": "number",
        "quantity": "number",
        "category": "string",
        "flavors": ["string"],
        "subtotal": "number"
      }
    ],
    "paymentMethod": "string",
    "deliveryMethod": "string",
    "total": "number",
    "notes": "string",
    "createdAt": "ISO 8601 date",
    "updatedAt": "ISO 8601 date",
    "estimatedDelivery": "ISO 8601 date" // opcional
  }
}
\`\`\`

### GET /api/orders
**Descripción**: Obtener lista de órdenes (Admin only)

**Query Parameters**:
- `page`: number (default: 1)
- `limit`: number (default: 10)
- `status`: string (opcional)
- `startDate`: ISO date (opcional)
- `endDate`: ISO date (opcional)

**Headers**: `Authorization: Bearer <admin-token>`

**Response (200 OK)**:
\`\`\`json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "string",
        "orderNumber": "string",
        "customerName": "string",
        "status": "string",
        "total": "number",
        "createdAt": "ISO 8601 date",
        "itemCount": "number"
      }
    ],
    "pagination": {
      "currentPage": "number",
      "totalPages": "number",
      "totalOrders": "number",
      "hasNext": "boolean",
      "hasPrev": "boolean"
    }
  }
}
\`\`\`

### PUT /api/orders/{orderId}/status
**Descripción**: Actualizar estado de orden (Admin only)

**Headers**: `Authorization: Bearer <admin-token>`

**Request Body**:
\`\`\`json
{
  "status": "confirmed" | "preparing" | "ready" | "delivered" | "cancelled",
  "notes": "string" // opcional
}
\`\`\`

**Response (200 OK)**:
\`\`\`json
{
  "success": true,
  "data": {
    "orderId": "string",
    "status": "string",
    "updatedAt": "ISO 8601 date"
  }
}
\`\`\`

---

## 2. PRODUCTS API (Microservicio de Productos)

### GET /api/products
**Descripción**: Obtener lista de productos

**Query Parameters**:
- `category`: string (opcional) - "palitos", "tacitas", "conos", "tortas", "postres", "masas"
- `available`: boolean (default: true)
- `page`: number (default: 1)
- `limit`: number (default: 20)

**Response (200 OK)**:
\`\`\`json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "string",
        "name": "string",
        "description": "string",
        "price": "number",
        "category": "string",
        "image": "string", // URL de la imagen
        "available": "boolean",
        "stock": "number",
        "hasFlavors": "boolean",
        "availableFlavors": ["string"], // si hasFlavors es true
        "createdAt": "ISO 8601 date"
      }
    ],
    "pagination": {
      "currentPage": "number",
      "totalPages": "number",
      "totalProducts": "number"
    }
  }
}
\`\`\`

### GET /api/products/{productId}
**Descripción**: Obtener detalles de un producto específico

**Response (200 OK)**:
\`\`\`json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "description": "string",
    "price": "number",
    "category": "string",
    "image": "string",
    "available": "boolean",
    "stock": "number",
    "hasFlavors": "boolean",
    "availableFlavors": ["string"],
    "nutritionalInfo": {
      "calories": "number",
      "fat": "number",
      "sugar": "number"
    },
    "createdAt": "ISO 8601 date",
    "updatedAt": "ISO 8601 date"
  }
}
\`\`\`

### POST /api/products (Admin only)
**Descripción**: Crear nuevo producto

**Headers**: `Authorization: Bearer <admin-token>`

**Request Body**:
\`\`\`json
{
  "name": "string",
  "description": "string",
  "price": "number",
  "category": "palitos" | "tacitas" | "conos" | "tortas" | "postres" | "masas",
  "image": "string", // URL o base64
  "stock": "number",
  "hasFlavors": "boolean",
  "availableFlavors": ["string"] // si hasFlavors es true
}
\`\`\`

**Response (201 Created)**:
\`\`\`json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "createdAt": "ISO 8601 date"
  }
}
\`\`\`

### PUT /api/products/{productId} (Admin only)
**Descripción**: Actualizar producto existente

**Headers**: `Authorization: Bearer <admin-token>`

**Request Body**: (mismo que POST, todos los campos opcionales)

**Response (200 OK)**:
\`\`\`json
{
  "success": true,
  "data": {
    "id": "string",
    "updatedAt": "ISO 8601 date"
  }
}
\`\`\`

### DELETE /api/products/{productId} (Admin only)
**Descripción**: Eliminar producto

**Headers**: `Authorization: Bearer <admin-token>`

**Response (200 OK)**:
\`\`\`json
{
  "success": true,
  "message": "Product deleted successfully"
}
\`\`\`

---

## 3. PROMOTIONS API (Microservicio de Promociones)

### GET /api/promotions
**Descripción**: Obtener promociones activas

**Query Parameters**:
- `active`: boolean (default: true)
- `featured`: boolean (opcional)

**Response (200 OK)**:
\`\`\`json
{
  "success": true,
  "data": {
    "promotions": [
      {
        "id": "string",
        "title": "string",
        "description": "string",
        "discountType": "percentage" | "fixed",
        "discountValue": "number",
        "image": "string",
        "startDate": "ISO 8601 date",
        "endDate": "ISO 8601 date",
        "active": "boolean",
        "featured": "boolean",
        "applicableProducts": ["string"], // IDs de productos
        "minOrderAmount": "number" // opcional
      }
    ]
  }
}
\`\`\`

### POST /api/promotions (Admin only)
**Descripción**: Crear nueva promoción

**Headers**: `Authorization: Bearer <admin-token>`

**Request Body**:
\`\`\`json
{
  "title": "string",
  "description": "string",
  "discountType": "percentage" | "fixed",
  "discountValue": "number",
  "image": "string",
  "startDate": "ISO 8601 date",
  "endDate": "ISO 8601 date",
  "featured": "boolean",
  "applicableProducts": ["string"],
  "minOrderAmount": "number"
}
\`\`\`

---

## 4. ADMIN AUTH API

### POST /api/admin/login
**Descripción**: Autenticación de administrador

**Request Body**:
\`\`\`json
{
  "username": "string",
  "password": "string"
}
\`\`\`

**Response (200 OK)**:
\`\`\`json
{
  "success": true,
  "data": {
    "token": "string", // JWT token
    "user": {
      "id": "string",
      "username": "string",
      "role": "admin"
    },
    "expiresIn": "number" // segundos
  }
}
\`\`\`

**Response (401 Unauthorized)**:
\`\`\`json
{
  "success": false,
  "error": "Invalid credentials"
}
\`\`\`

### POST /api/admin/verify
**Descripción**: Verificar token de admin

**Headers**: `Authorization: Bearer <admin-token>`

**Response (200 OK)**:
\`\`\`json
{
  "success": true,
  "data": {
    "valid": true,
    "user": {
      "id": "string",
      "username": "string",
      "role": "admin"
    }
  }
}
\`\`\`

---

## 5. REPORTS API (Microservicio de Reportes)

### GET /api/reports/sales
**Descripción**: Obtener reportes de ventas (Admin only)

**Headers**: `Authorization: Bearer <admin-token>`

**Query Parameters**:
- `startDate`: ISO date
- `endDate`: ISO date
- `groupBy`: "day" | "week" | "month"

**Response (200 OK)**:
\`\`\`json
{
  "success": true,
  "data": {
    "salesData": [
      {
        "date": "ISO 8601 date",
        "totalSales": "number",
        "orderCount": "number",
        "averageOrderValue": "number"
      }
    ],
    "summary": {
      "totalRevenue": "number",
      "totalOrders": "number",
      "averageOrderValue": "number",
      "topSellingProducts": [
        {
          "productId": "string",
          "productName": "string",
          "quantitySold": "number",
          "revenue": "number"
        }
      ]
    }
  }
}
\`\`\`

### GET /api/reports/products
**Descripción**: Obtener reportes de productos (Admin only)

**Headers**: `Authorization: Bearer <admin-token>`

**Response (200 OK)**:
\`\`\`json
{
  "success": true,
  "data": {
    "productStats": [
      {
        "productId": "string",
        "productName": "string",
        "category": "string",
        "currentStock": "number",
        "totalSold": "number",
        "revenue": "number",
        "lastSold": "ISO 8601 date"
      }
    ],
    "lowStockAlerts": [
      {
        "productId": "string",
        "productName": "string",
        "currentStock": "number",
        "minimumStock": "number"
      }
    ]
  }
}
\`\`\`

---

## Códigos de Error Estándar

- **200**: OK - Solicitud exitosa
- **201**: Created - Recurso creado exitosamente
- **400**: Bad Request - Error de validación o datos inválidos
- **401**: Unauthorized - Token inválido o faltante
- **403**: Forbidden - Sin permisos para la operación
- **404**: Not Found - Recurso no encontrado
- **500**: Internal Server Error - Error del servidor

## Formato de Error Estándar

\`\`\`json
{
  "success": false,
  "error": "Mensaje de error principal",
  "details": ["Lista de errores específicos"], // opcional
  "code": "ERROR_CODE" // opcional
}
\`\`\`

## Notas de Implementación

1. **CORS**: Configurar para permitir requests desde el frontend Next.js
2. **Rate Limiting**: Implementar límites de requests por IP
3. **Validation**: Usar Bean Validation (JSR-303) para validar requests
4. **Database**: PostgreSQL o MySQL como se especifica en el documento original
5. **File Upload**: Para imágenes de productos, usar multipart/form-data
6. **Logging**: Implementar logging detallado para debugging
7. **Health Checks**: Endpoints `/health` para monitoreo
8. **API Versioning**: Considerar versionado (v1, v2) para futuras actualizaciones
