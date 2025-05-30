# Stylow Restful API

## 1. Customer Authentication

### 1.1.

#### Endpoint:

#### Request Header:

X-API-TOKEN : Token (mandatory)

#### Request Body:

```json
{
  -
}
```

#### Response Body:

```json
{}
```

#### Query:

```sql

```

## 2. Customer Product List include Category

### 2.1. Customer get product

#### Endpoint: GET /api/v1/products?category={category}

#### Request Header:

X-API-TOKEN : Token (mandatory)

#### Request Body:

```json
{
  -
}
```

#### Response Body:

```json
{
  {
  "status": true,
  "message": "Products retrieved successfully",
  "data": [
    {
      "idProduct": "prod-001",
      "name": "Ralph Lauren White Polo Shirt",
      "description": "Classic white polo shirt made from premium cotton.",
      "price": 785000,
      "category": "topWear",
    },
    {
      "idProduct": "prod-002",
      "name": "Uniqlo Slim Fit T-Shirt",
      "description": "Basic slim fit t-shirt for daily wear.",
      "price": 345000,
      "category": "topWear",
    }
  ],
}
}
```

#### Query:

```sql
SELECT
  idProduct,
  name,
  description,
  price,
  category
FROM products
WHERE (:category IS NULL OR category = :category);
```

## 3. Customer Product Details include Favorite

### 3.1. Get product detail information

#### Endpoint: GET /api/v1/products/{productId}/customer/{customerId}

#### Request Header:

X-API-TOKEN : Token (mandatory)

#### Request Body:

```json
{
  -
}
```

#### Response Body:

```json
{
  "status": true,
  "message": "product is favorite for current user",
  "name": "Ralph Lauren White Polo Shirt",
  "description": "A classic white polo shirt by Ralph Lauren, made from premium cotton for a comfortable fit.",
  "price": 785000,
  "category": "topWear",
  "size": "XL",
  "stockQuantity": 17,
  "isFavorite": true
}
```

```json
{
  "status": true,
  "message": "product isn't favorite for current user",
  "name": "Uniqlo Slim Fit T-Shirt",
  "description": "Basic slim fit t-shirt from Uniqlo, ideal for daily wear and layering.",
  "price": 345000,
  "category": "topWear",
  "size": "L",
  "stockQuantity": 23,
  "isFavorite": false
}
```

#### Query:

```sql
SELECT
    p.name,
    p.description,
    p.price,
    p.category,
    s.size,
    s.stockQuantity,
    CASE
        WHEN fp.idFavoriteProduct IS NOT NULL THEN true
        ELSE false
    END AS isFavorite
FROM Product p
JOIN Stock s ON s.idProduct = p.idProduct
LEFT JOIN FavoriteProduct fp
    ON fp.idProduct = p.idProduct AND fp.idCustomer = :customerId
WHERE p.idProduct = :productId
LIMIT 1;
```

### 3.2. add favorite product

#### Endpoint: POST /api/v1/products/{productId}/customer/{customerId}/favorites

#### Request Header:

X-API-TOKEN : Token (mandatory)

#### Request Body:

```json
{
  -
}
```

#### Response Body:

```json
{
  "status": true
  "message": "add to favorite succes"
  "isFavorite": true
}
```

#### Query:

```sql
INSERT INTO FavoriteProduct (idProduct, idCustomer)
VALUES (:productId, :customerId);
```

### 3.1. remove favorite product

#### Endpoint: DELETE /api/v1/products/{productId}/customer/{customerId}/favorites

#### Request Header:

X-API-TOKEN : Token (mandatory)

#### Request Body:

```json
{
  -
}
```

#### Response Body:

```json
{
  "status": true
  "message": "remove from favorite succes"
  "isFavorite": false
}
```

#### Query:

```sql
DELETE FROM FavoriteProduct
WHERE idProduct = :productId AND idCustomer = :customerId;
```

## 4. Customer Cart CRUD

### 4.1. add to product to cart

![alt text](image-4.png)

#### Endpoint: POST /api/v1/carts/{productId}

#### Request Header:

X-API-TOKEN : Token (mandatory)

#### Request Body:

```json
{
  -
}
```

#### Response Body:

```json
{
  "status": true,
  "message": "item successfully added to cart",
  "cartTotalPrice": 1130000
  "data" : [
    {
      {
      "idCartItem": "item-001",
      "name": "Ralph Lauren White Polo Shirt",
      "description": "Classic white polo shirt made from premium cotton.",
      "price": 785000,
      "category": "topWear",
    },
    {
      "idCartItem": "item-002",
      "name": "Uniqlo Slim Fit T-Shirt",
      "description": "Basic slim fit t-shirt for daily wear.",
      "price": 345000,
      "category": "topWear",
    }
    }

  ]

}
```

#### Query:

```sql
-- Insert a product into the cart with quantity = 1
INSERT INTO cart_items (cart_item_id, user_id, product_id, quantity)
VALUES ('item-002, 'user-123', 'product-002', 1);
```

```sql
SELECT
    ci.cart_item_id AS "idCartItem",
    p.name,
    p.description,
    p.price,
    p.category,
    ci.quantity,
FROM cart_items ci
JOIN products p ON ci.product_id = p.product_id
WHERE ci.user_id = 'user-123';
```

```sql
SELECT
    SUM(p.price * ci.quantity) AS cartTotalPrice
FROM cart_items ci
JOIN products p ON ci.product_id = p.product_id
WHERE ci.user_id = 'user-123';
```
