# Feature Enrichment — Attempt 1

Generated: 2026-09-02

Each section is one LLM call (~5–8K tokens). The instruction tells the generator how all files in the feature interact and what contracts they must honour.

---

## Product Catalog (Core)

**Name:** `product-catalog-core`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/prakashstores/model/Product.java` — JPA Entity — Represents a clothing item with attributes like name, price, stock, and relationships to ProductCategory and Brand.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): { id: Long; name: String; description: String; price: BigDecimal; imageUrl: String; stockQuantity: Integer; size: String; color: String; material: String; gender: String; active: Boolean; category: ProductCategory; brand: Brand }
- `backend/src/main/java/com/prakashstores/model/ProductCategory.java` — JPA Entity — Defines a category for products, such as 'Men' or 'Women'.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): { id: Long; name: String; description: String }
- `backend/src/main/java/com/prakashstores/model/Brand.java` — JPA Entity — Represents a product brand, like 'Wrangler'.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): { id: Long; name: String; description: String }
- `backend/src/main/java/com/prakashstores/repository/ProductRepository.java` — REPOSITORY layer — Provides data access methods for Product entities, including custom queries for filtering and searching. It exposes methods like findByCategory_Name and findByBrand_Name.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): methods: Page<Product> searchProducts(String searchTerm, String categoryName, String brandName, String gender, String size, String color, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable); List<Product> findAllByIdIn(List<Long> productIds)
- `backend/src/main/java/com/prakashstores/repository/ProductCategoryRepository.java` — REPOSITORY layer — Provides data access methods for ProductCategory entities, including finding by name. It exposes methods like findByName.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): methods: Optional<ProductCategory> findByName(String name)
- `backend/src/main/java/com/prakashstores/repository/BrandRepository.java` — REPOSITORY layer — Provides data access methods for Brand entities, including finding by name. It exposes methods like findByName.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): methods: Optional<Brand> findByName(String name)
- `backend/src/main/java/com/prakashstores/service/ProductService.java` — SERVICE layer — Implements business logic for products, including CRUD operations, search, filtering, and inventory management. It exposes methods like createProduct(Product), getProductById(Long), and updateProductStock(Long, int).

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): methods: Product createProduct(Product product); Product updateProduct(Long id, Product product); void deleteProduct(Long id); Product getProductById(Long id); Page<Product> getAllProducts(String categoryName, String brandName, String gender, String size, String color, BigDecimal minPrice, BigDecimal maxPrice, String searchTerm, Pageable pageable); Product updateProductStock(Long productId, int quantityChange); List<Product> getProductsByIds(List<Long> productIds); List<ProductCategory> getAllProductCategories(); List<Brand> getAllBrands()

**Feature Instruction:**

The Product Catalog (Core) feature provides the foundational backend models, repositories, and services for managing products, product categories, and brands for Prakash Stores. This feature is responsible for persisting product data, retrieving it based on various criteria, and handling core business logic related to product inventory and availability. It does not expose any direct API endpoints; instead, its services are consumed by the `product-catalog-api` feature to expose public and admin-facing APIs.

### Product Model (`Product.java`)
This JPA entity represents a single clothing item. It includes fields for `name`, `description`, `price`, `imageUrl`, `stockQuantity`, `size`, `color`, `material`, `gender`, and `active`. It has many-to-one relationships with `ProductCategory` and `Brand`.

### ProductCategory Model (`ProductCategory.java`)
This JPA entity defines categories for products (e.g., 'Men', 'Women', 'Kids'). It has fields for `name` and `description`.

### Brand Model (`Brand.java`)
This JPA entity represents product brands (e.g., 'Wrangler'). It has fields for `name` and `description`.

### Repositories (`ProductRepository.java`, `ProductCategoryRepository.java`, `BrandRepository.java`)
These Spring Data JPA repositories provide standard CRUD operations for their respective entities. `ProductRepository` includes custom query methods for filtering products by category, brand, gender, size, color, and price range, as well as searching by name or description. It also includes a method to find products by a list of IDs, which will be used by the `order-management-core` feature to validate product existence and retrieve details when creating an order.

### Product Service (`ProductService.java`)
This service layer class encapsulates the business logic for products. It injects `ProductRepository`, `ProductCategoryRepository`, and `BrandRepository` to perform data operations. It provides methods for:

1.  `createProduct(Product product)`: Creates a new product. It validates that the associated category and brand exist. If not, it throws a `ResourceNotFoundException`.
2.  `updateProduct(Long id, Product product)`: Updates an existing product. It first retrieves the product by ID, then updates its fields. It also validates the existence of the associated category and brand. Throws `ResourceNotFoundException` if the product, category, or brand is not found.
3.  `deleteProduct(Long id)`: Deletes a product by its ID. Throws `ResourceNotFoundException` if the product is not found.
4.  `getProductById(Long id)`: Retrieves a single product by its ID. Throws `ResourceNotFoundException` if the product is not found.
5.  `getAllProducts(String categoryName, String brandName, String gender, String size, String color, BigDecimal minPrice, BigDecimal maxPrice, String searchTerm, Pageable pageable)`: Retrieves a paginated list of products, applying filters based on the provided criteria. If `categoryName` or `brandName` are provided, it first resolves them to their respective IDs using `ProductCategoryRepository` and `BrandRepository`. If a category or brand is not found, it returns an empty page of products.
6.  `updateProductStock(Long productId, int quantityChange)`: Adjusts the stock quantity of a product. This method will be called by the `order-management-core` feature when an order is placed or cancelled. It throws `ResourceNotFoundException` if the product is not found, or `IllegalArgumentException` if `quantityChange` would result in negative stock.
7.  `getProductsByIds(List<Long> productIds)`: Retrieves a list of products given a list of product IDs. This is used by `order-management-core` to fetch product details for items in an order.
8.  `getAllProductCategories()`: Retrieves a list of all available product categories.
9.  `getAllBrands()`: Retrieves a list of all available brands.

Error Handling: The `ProductService` throws `ResourceNotFoundException` for cases where an entity (Product, ProductCategory, Brand) is not found, and `IllegalArgumentException` for invalid operations like attempting to set negative stock. These exceptions are handled by the `GlobalExceptionHandler` in the `shared-backend` feature, which translates them into appropriate HTTP responses.

---

## Product Catalog (API)

**Name:** `product-catalog-api`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/prakashstores/dto/ProductDto.java` — Data transfer object for sending product details to the client, including fields for product information, category, and brand.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): { id: Long; name: String; description: String; price: java.math.BigDecimal; imageUrl: String; stockQuantity: Integer; size: String; color: String; material: String; gender: String; active: Boolean; category: String; brand: String }
- `backend/src/main/java/com/prakashstores/dto/ProductFilterRequest.java` — Data transfer object for encapsulating product filtering and pagination criteria.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): { categoryName: String; brandName: String; gender: String; size: String; color: String; minPrice: java.math.BigDecimal; maxPrice: java.math.BigDecimal; searchTerm: String; page: Integer; size: Integer; sortBy: String; sortDir: String }
- `backend/src/main/java/com/prakashstores/controller/ProductController.java` — CONTROLLER layer — exposes public API endpoints for browsing and searching products; delegates to ProductService.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): methods: public org.springframework.data.domain.Page<com.prakashstores.dto.ProductDto> getAllProducts(com.prakashstores.dto.ProductFilterRequest filterRequest); public com.prakashstores.dto.ProductDto getProductById(Long productId)
- `backend/src/main/java/com/prakashstores/controller/admin/AdminProductController.java` — CONTROLLER layer — provides secured admin endpoints for creating, updating, and deleting products and managing inventory; delegates to ProductService.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): methods: public com.prakashstores.dto.ProductDto createProduct(com.prakashstores.dto.ProductDto productDto); public com.prakashstores.dto.ProductDto updateProduct(Long productId, com.prakashstores.dto.ProductDto productDto); public void deleteProduct(Long productId); public com.prakashstores.dto.ProductDto updateProductStock(Long productId, Integer quantityChange)

**Feature Instruction:**

The Product Catalog (API) feature provides the backend API endpoints for managing and browsing products for Prakash Stores. It consists of two DTOs, `ProductDto` and `ProductFilterRequest`, and two controllers, `ProductController` for public access and `AdminProductController` for authenticated administrative operations. Both controllers interact with the `product-catalog-core` feature's `ProductService` to perform business logic and data persistence.

`ProductDto` is used to transfer product details between the client and the server, ensuring a consistent data structure. `ProductFilterRequest` encapsulates various filtering criteria for product searches, such as category, brand, gender, size, color, price range, and a general search term.

`ProductController` exposes public API endpoints for customers to browse products. It provides methods to retrieve all products with optional filtering, and to fetch a single product by its ID. All monetary values (prices) in `ProductDto` will be formatted in Indian Rupees (₹) using the `en-IN` locale when displayed on the frontend.

`AdminProductController` provides secured endpoints for administrators to manage the product catalog. This includes creating new products, updating existing product details, deleting products, and managing product inventory (stock quantity). All admin operations require authentication and appropriate authorization (handled by the platform's security layer).

Both controllers inject `ProductService` from the `product-catalog-core` feature. `ProductController.getAllProducts` maps the `ProductFilterRequest` to the parameters expected by `ProductService.getAllProducts` and then converts the `Page<Product>` result into a `Page<ProductDto>`. `ProductController.getProductById` calls `ProductService.getProductById` and converts the `Product` entity to `ProductDto`. `AdminProductController` methods similarly call the corresponding `ProductService` methods (`createProduct`, `updateProduct`, `deleteProduct`, `updateProductStock`) and handle the conversion between `Product` entities and `ProductDto`s.

Error Handling: If a product is not found, `ProductService` will throw a `ResourceNotFoundException`, which `GlobalExceptionHandler` (from `shared-backend`) will catch and return an appropriate HTTP 404 Not Found response with an `ErrorResponse` body. Other exceptions will be handled by `GlobalExceptionHandler` as well.

---

## Order Management (Core)

**Name:** `order-management-core`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/prakashstores/model/Order.java` — MODEL layer — represents a customer's order, containing order items, shipping details, and status.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): { id: Long; userId: Integer; orderDate: java.time.LocalDateTime; totalAmount: java.math.BigDecimal; status: OrderStatus; orderType: OrderType; shippingAddress: String; contactPhone: String; orderItems: java.util.List<OrderItem> }
- `backend/src/main/java/com/prakashstores/model/OrderItem.java` — MODEL layer — represents a single item within an order, linking to a product and quantity.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): { id: Long; order: Order; productId: Long; productName: String; quantity: Integer; unitPrice: java.math.BigDecimal; imageUrl: String }
- `backend/src/main/java/com/prakashstores/model/OrderStatus.java` — MODEL layer — enumeration of possible statuses for an order (e.g., PENDING, SHIPPED, DELIVERED).

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): { PENDING: enum; CONFIRMED: enum; SHIPPED: enum; DELIVERED: enum; CANCELLED: enum }
- `backend/src/main/java/com/prakashstores/model/OrderType.java` — MODEL layer — enumeration for order fulfillment method: DELIVERY or PICKUP (Click and Collect).

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): { DELIVERY: enum; PICKUP: enum }
- `backend/src/main/java/com/prakashstores/repository/OrderRepository.java` — REPOSITORY layer — provides data access methods for Order entities, including `findByUserId(Integer userId)` and `findByStatus(OrderStatus status)`.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): methods: java.util.List<Order> findByUserId(Integer userId); java.util.List<Order> findByStatus(OrderStatus status)
- `backend/src/main/java/com/prakashstores/repository/OrderItemRepository.java` — REPOSITORY layer — provides data access methods for OrderItem entities.
- `backend/src/main/java/com/prakashstores/service/OrderService.java` — SERVICE layer — implements `createOrder(CreateOrderRequest request, Integer userId): OrderResponse`, `getOrderById(Long orderId, Integer userId): OrderResponse`, `getAllOrders(Integer userId): List<OrderResponse>`, and `updateOrderStatus(Long orderId, OrderStatus newStatus): OrderResponse`; delegates persistence to `OrderRepository` and `OrderItemRepository`, and product details/stock updates to `ProductService`.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): methods: OrderResponse createOrder(CreateOrderRequest request, Integer userId); OrderResponse getOrderById(Long orderId, Integer userId); java.util.List<OrderResponse> getAllOrders(Integer userId); OrderResponse updateOrderStatus(Long orderId, OrderStatus newStatus)

**Feature Instruction:**

This feature, Order Management (Core), provides the foundational backend models, repositories, and service logic for handling customer orders within Prakash Stores. It defines the `Order`, `OrderItem`, `OrderStatus`, and `OrderType` entities, along with their respective repositories for data persistence. The `OrderService` encapsulates the core business logic for creating and managing orders, including interaction with the `ProductService` to retrieve product details and update stock quantities. When an order is created, the service will fetch product details for each item, calculate the total amount, and update the stock quantity for each product. It will then persist the order and its items. The service will also provide methods to retrieve orders by ID or by user ID, and to update order statuses. This feature does not expose any direct API endpoints; instead, its service methods are consumed by the `order-management-api` feature's controllers.

---

## Order Management (API)

**Name:** `order-management-api`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/prakashstores/dto/CreateOrderRequest.java` — Data transfer object for creating a new order from the client's cart.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): { orderType: OrderType; shippingAddress: String; contactPhone: String; items: java.util.List<OrderItemRequest> }
- `backend/src/main/java/com/prakashstores/dto/OrderItemRequest.java` — Represents a single item within a new order request.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): { productId: Long; quantity: Integer }
- `backend/src/main/java/com/prakashstores/dto/OrderResponse.java` — Data transfer object for sending detailed order information to the client.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): { id: Long; userId: Integer; orderDate: java.time.LocalDateTime; totalAmount: java.math.BigDecimal; status: OrderStatus; orderType: OrderType; shippingAddress: String; contactPhone: String; items: java.util.List<OrderItemResponse> }
- `backend/src/main/java/com/prakashstores/controller/OrderController.java` — CONTROLLER layer — exposes API endpoints for customers to create orders and view their order history.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): methods: OrderResponse createOrder(@RequestBody CreateOrderRequest createOrderRequest, @CurrentUser Integer userId); java.util.List<OrderResponse> getAllOrders(@CurrentUser Integer userId); OrderResponse getOrderById(@PathVariable Long orderId, @CurrentUser Integer userId)
- `backend/src/main/java/com/prakashstores/controller/admin/AdminOrderController.java` — CONTROLLER layer — provides secured admin endpoints for viewing and managing all customer orders.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): methods: java.util.List<OrderResponse> getAllOrders(); OrderResponse updateOrderStatus(@PathVariable Long orderId, @RequestParam("newStatus") OrderStatus newStatus)

**Feature Instruction:**

The Order Management API feature provides endpoints for customers to create and view their orders, and for administrators to manage all orders. It consists of DTOs for request and response payloads, and controllers for customer and admin-specific operations. The `OrderController` handles customer-facing requests, allowing authenticated users to place new orders and retrieve their order history. The `AdminOrderController` provides privileged access for administrators to view and update the status of all orders. Both controllers delegate business logic to the `OrderService` (from `order-management-core` feature), which in turn interacts with the `ProductService` (from `product-catalog-core` feature) to validate product availability and update stock quantities.

### Create Order Flow
1. A customer sends a `POST` request to `/api/v1/orders` with a `CreateOrderRequest` payload.
2. The `OrderController.createOrder` method receives the request and the `userId` from the authenticated user context.
3. It calls `orderService.createOrder(request, userId)`.
4. The `OrderService.createOrder` method performs the following steps:
    a. Validates the `productId` and `quantity` for each `OrderItemRequest` by calling `productService.getProductsByIds(List<Long> productIds)` from the `product-catalog-core` feature.
    b. Checks if sufficient `stockQuantity` is available for each product.
    c. If stock is insufficient for any item, it throws an `IllegalArgumentException`.
    d. Creates a new `Order` entity and `OrderItem` entities based on the request and product details.
    e. Calculates the `totalAmount` for the order.
    f. Saves the `Order` and `OrderItem` entities using `orderRepository.save(Order order)`.
    g. For each order item, it calls `productService.updateProductStock(Long productId, int quantityChange)` with a negative `quantityChange` to decrement the stock.
    h. Returns an `OrderResponse` containing the created order details.
5. The `OrderController` returns a `201 Created` status with the `OrderResponse` or a `400 Bad Request` if `IllegalArgumentException` is thrown, or `404 Not Found` if `ResourceNotFoundException` is thrown.

### View Customer Orders Flow
1. An authenticated customer sends a `GET` request to `/api/v1/orders`.
2. The `OrderController.getAllOrders` method receives the request and the `userId` from the authenticated user context.
3. It calls `orderService.getAllOrders(userId)`.
4. The `OrderService.getAllOrders` method retrieves all orders associated with the given `userId` using `orderRepository.findByUserId(Integer userId)`.
5. It maps the `Order` entities to a `List<OrderResponse>`.
6. The `OrderController` returns a `200 OK` status with the `List<OrderResponse>`.

### View Single Customer Order Flow
1. An authenticated customer sends a `GET` request to `/api/v1/orders/{orderId}`.
2. The `OrderController.getOrderById` method receives the `orderId` from the path and the `userId` from the authenticated user context.
3. It calls `orderService.getOrderById(orderId, userId)`.
4. The `OrderService.getOrderById` method retrieves the order by `orderId` and verifies that it belongs to the `userId` using `orderRepository.findById(Long id)` and checking `order.getUserId() == userId`.
5. If the order is not found or does not belong to the user, it throws a `ResourceNotFoundException`.
6. It maps the `Order` entity to an `OrderResponse`.
7. The `OrderController` returns a `200 OK` status with the `OrderResponse` or a `404 Not Found` if `ResourceNotFoundException` is thrown.

### View All Orders (Admin) Flow
1. An authenticated administrator sends a `GET` request to `/api/v1/admin/orders`.
2. The `AdminOrderController.getAllOrders` method receives the request.
3. It calls `orderService.getAllOrders(null)` (passing null for userId to indicate all orders).
4. The `OrderService.getAllOrders` method retrieves all orders using `orderRepository.findAll()`.
5. It maps the `Order` entities to a `List<OrderResponse>`.
6. The `AdminOrderController` returns a `200 OK` status with the `List<OrderResponse>`.

### Update Order Status (Admin) Flow
1. An authenticated administrator sends a `PUT` request to `/api/v1/admin/orders/{orderId}/status` with a `newStatus` parameter.
2. The `AdminOrderController.updateOrderStatus` method receives the `orderId` from the path and the `newStatus` from the request parameter.
3. It calls `orderService.updateOrderStatus(orderId, newStatus)`.
4. The `OrderService.updateOrderStatus` method retrieves the order by `orderId` using `orderRepository.findById(Long id)`.
5. If the order is not found, it throws a `ResourceNotFoundException`.
6. It updates the `status` of the `Order` entity.
7. Saves the updated `Order` entity using `orderRepository.save(Order order)`.
8. Maps the updated `Order` entity to an `OrderResponse`.
9. The `AdminOrderController` returns a `200 OK` status with the `OrderResponse` or a `404 Not Found` if `ResourceNotFoundException` is thrown, or `400 Bad Request` if `IllegalArgumentException` is thrown for an invalid status transition.

---

## Review System

**Name:** `review-system`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/prakashstores/model/Review.java` — MODEL layer — represents a customer review for a product, including a rating and comment.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): { id: Long; productId: Long; userId: Integer; rating: Integer; comment: String; reviewDate: LocalDateTime }
- `backend/src/main/java/com/prakashstores/repository/ReviewRepository.java` — REPOSITORY layer — provides data access methods for Review entities, including finding reviews by product ID.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): methods: List<Review> findByProductId(Long productId)
- `backend/src/main/java/com/prakashstores/service/ReviewService.java` — SERVICE layer — implements createReview(CreateReviewRequest, Integer): ReviewDto, getReviewsByProductId(Long): List<ReviewDto>, and getAllReviews(): List<ReviewDto>; delegates persistence to ReviewRepository and product lookup to ProductService.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): methods: ReviewDto createReview(CreateReviewRequest request, Integer userId); List<ReviewDto> getReviewsByProductId(Long productId); List<ReviewDto> getAllReviews()
- `backend/src/main/java/com/prakashstores/dto/ReviewDto.java` — DTO layer — data transfer object for sending review details to the client.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): { id: Long; productId: Long; userId: Integer; rating: Integer; comment: String; reviewDate: LocalDateTime }
- `backend/src/main/java/com/prakashstores/dto/CreateReviewRequest.java` — DTO layer — data transfer object for creating a new product review.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): { productId: Long; rating: Integer; comment: String }
- `backend/src/main/java/com/prakashstores/controller/ReviewController.java` — CONTROLLER layer — exposes API endpoints for submitting and retrieving product reviews.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): methods: ReviewDto createReview(CreateReviewRequest request, Integer userId); List<ReviewDto> getReviewsByProductId(Long productId); List<ReviewDto> getAllReviews()

**Feature Instruction:**

The Review System feature enables authenticated users to submit reviews for products and allows anyone to view product reviews. It consists of a `Review` entity, `ReviewRepository` for data access, `ReviewService` for business logic, and `ReviewController` for exposing API endpoints. DTOs `ReviewDto` and `CreateReviewRequest` handle data transfer.

### Review Submission Flow
1.  **Frontend Interaction**: An authenticated user on the product detail page (from `product-browsing` feature) will interact with a `ReviewForm` (from `customer-engagement` feature) to submit a review. This form will collect a `rating` (Integer) and `comment` (String).
2.  **API Call**: The frontend will make a POST request to `/api/v1/reviews` with a `CreateReviewRequest` containing `productId`, `rating`, and `comment`.
3.  **Controller Handling**: `ReviewController.createReview(CreateReviewRequest request, @CurrentUser Integer userId)` will receive the request. It will validate the input and then call `reviewService.createReview(request, userId)`.
4.  **Service Logic**: `ReviewService.createReview(CreateReviewRequest request, Integer userId)` will:
    a.  Validate that `request.getProductId()` corresponds to an existing product by calling `productService.getProductById(request.getProductId())` from the `product-catalog-core` feature. If the product is not found, it will throw a `ResourceNotFoundException`.
    b.  Create a new `Review` entity, setting `userId` from the `@CurrentUser` annotation, `productId` from the request, `rating`, `comment`, and `reviewDate` (current timestamp).
    c.  Persist the `Review` entity using `reviewRepository.save(review)`.
    d.  Convert the saved `Review` entity to a `ReviewDto` and return it.

### Review Retrieval Flow
1.  **Frontend Interaction**: The product detail page will display a list of reviews using a `ReviewList` component (from `customer-engagement` feature).
2.  **API Call**: The frontend will make a GET request to `/api/v1/reviews/product/{productId}` to fetch all reviews for a specific product.
3.  **Controller Handling**: `ReviewController.getReviewsByProductId(@PathVariable Long productId)` will receive the request. It will call `reviewService.getReviewsByProductId(productId)`.
4.  **Service Logic**: `ReviewService.getReviewsByProductId(Long productId)` will:
    a.  Retrieve all `Review` entities for the given `productId` using `reviewRepository.findByProductId(productId)`.
    b.  Convert the list of `Review` entities to a list of `ReviewDto`s and return it.

### Admin Review Management
1.  **Admin UI**: The admin portal will have a section to manage reviews (not explicitly in this feature's files, but assumed for completeness).
2.  **API Calls**: Admin endpoints will be available for retrieving all reviews, and potentially for deleting or moderating reviews (though only retrieval is covered in this brief).
3.  **Controller Handling**: `ReviewController.getAllReviews()` will retrieve all reviews for admin purposes.
4.  **Service Logic**: `ReviewService.getAllReviews()` will fetch all reviews from `reviewRepository.findAll()` and convert them to `ReviewDto`s.

### Error Handling
-   If a product is not found during review creation, `ReviewService` will throw `ResourceNotFoundException`, which `GlobalExceptionHandler` (from `shared-backend` feature) will catch and return a `404 Not Found` response with an `ErrorResponse` body.
-   Other unexpected errors will be handled by `GlobalExceptionHandler`, returning `500 Internal Server Error`.

### Data Shapes
-   `Review`: `id: Long`, `productId: Long`, `userId: Integer`, `rating: Integer`, `comment: String`, `reviewDate: LocalDateTime`.
-   `ReviewDto`: `id: Long`, `productId: Long`, `userId: Integer`, `rating: Integer`, `comment: String`, `reviewDate: LocalDateTime`.
-   `CreateReviewRequest`: `productId: Long`, `rating: Integer`, `comment: String`.

---

## Event Management

**Name:** `event-management`  
**Type:** BACKEND  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/prakashstores/model/Event.java` — MODEL layer — defines the `Event` entity with fields for name, description, date, time, and imageUrl.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): { id: Long; name: String; description: String; eventDate: LocalDate; eventTime: LocalTime; imageUrl: String }
- `backend/src/main/java/com/prakashstores/repository/EventRepository.java` — REPOSITORY layer — provides data access methods for `Event` entities, including `findAllByEventDateAfterOrderByEventDateAsc(LocalDate date)`.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): methods: findAllByEventDateAfterOrderByEventDateAsc(LocalDate date): List<Event>
- `backend/src/main/java/com/prakashstores/service/EventService.java` — SERVICE layer — implements `createEvent(EventDto eventDto): EventDto`, `getEventById(Long id): EventDto`, `getAllEvents(): List<EventDto>`, `updateEvent(Long id, EventDto eventDto): EventDto`, and `deleteEvent(Long id): void`.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): methods: createEvent(EventDto eventDto): EventDto; getEventById(Long id): EventDto; getAllEvents(): List<EventDto>; updateEvent(Long id, EventDto eventDto): EventDto; deleteEvent(Long id): void
- `backend/src/main/java/com/prakashstores/dto/EventDto.java` — DTO layer — defines the `EventDto` for transferring event data between the client and server.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): { id: Long; name: String; description: String; eventDate: LocalDate; eventTime: LocalTime; imageUrl: String }
- `backend/src/main/java/com/prakashstores/controller/EventController.java` — CONTROLLER layer — exposes public API endpoints for retrieving event information, including `getAllEvents()` and `getEventById(Long eventId)`.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): methods: getAllEvents(): List<EventDto>; getEventById(Long eventId): EventDto
- `backend/src/main/java/com/prakashstores/controller/admin/AdminEventController.java` — CONTROLLER layer — provides secured admin endpoints for managing events, including `createEvent(EventDto eventDto)`, `updateEvent(Long eventId, EventDto eventDto)`, and `deleteEvent(Long eventId)`.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): methods: createEvent(EventDto eventDto): EventDto; updateEvent(Long eventId, EventDto eventDto): EventDto; deleteEvent(Long eventId): void

**Feature Instruction:**

The Event Management feature provides a complete backend solution for managing in-store events at Prakash Stores. It includes data models, repository interfaces, service logic, and both public and administrative API endpoints. Events are defined by their name, description, date, time, and an optional image URL. The `Event` entity stores these details, with `EventRepository` providing standard CRUD operations and custom queries to find events by date. The `EventService` encapsulates the core business logic, handling the creation, retrieval, update, and deletion of events, and performing necessary validations. It interacts with `EventRepository` for persistence. Public access to event information is provided by `EventController`, which exposes endpoints for fetching all upcoming events and individual event details. Administrative operations, such as creating, updating, and deleting events, are handled by `AdminEventController`, which secures these endpoints to ensure only authorized personnel can modify event data. Both controllers consume and produce `EventDto` objects, which are simplified representations of the `Event` entity for client-side communication, ensuring data consistency and preventing direct exposure of internal model details. The `EventService` maps between `Event` entities and `EventDto` objects. Error handling is consistent, throwing `ResourceNotFoundException` for non-existent events, which is handled globally.

---

## Shared Backend Utilities

**Name:** `shared-backend`  
**Type:** SHARED  
**Change required:** true

**Files in this feature:**
- `backend/src/main/java/com/prakashstores/exception/GlobalExceptionHandler.java` — Centralized exception handler for the application, providing consistent error responses by mapping exceptions to `ErrorResponse` DTOs with appropriate HTTP status codes.
- `backend/src/main/java/com/prakashstores/dto/ErrorResponse.java` — Data Transfer Object (DTO) defining the standard structure for API error responses, including a timestamp, message, and error details.
- `backend/src/main/java/com/prakashstores/exception/ResourceNotFoundException.java` — Custom exception class to be thrown when a requested resource (e.g., product, order) cannot be found in the system.

**Feature Instruction:**

The Shared Backend Utilities feature provides foundational components for consistent error handling across the Prakash Stores backend application. It defines a standard `ErrorResponse` DTO for API error messages, a `ResourceNotFoundException` for common 'resource not found' scenarios, and a `GlobalExceptionHandler` to centralize the handling of these and other exceptions. The `GlobalExceptionHandler` ensures that all API errors are returned in a consistent `ErrorResponse` format with appropriate HTTP status codes. Specifically, it will catch `ResourceNotFoundException` and return an `ErrorResponse` with HTTP 404 Not Found. Other unhandled exceptions will return an `ErrorResponse` with HTTP 500 Internal Server Error. Services and controllers across the application will throw `ResourceNotFoundException` when an entity cannot be found by its ID or other criteria, and the `GlobalExceptionHandler` will automatically translate this into a user-friendly API response.

---

## Product Browsing

**Name:** `product-browsing`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/types/product.ts` — Generated from the backend API contract — defines TypeScript types for products, categories, and brands.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): { ProductCategoryDto: { id: number; name: string; }; BrandDto: { id: number; name: string; }; ProductVariantDto: { size: string; color: string; stock: number; }; ProductDto: { id: number; name: string; description: string; price: number; imageUrl: string; additionalImages: string[]; category: ProductCategoryDto; brand: BrandDto; variants: ProductVariantDto[]; }; ProductFilterRequest: { categoryId?: number; brandId?: number; size?: string; color?: string; minPrice?: number; maxPrice?: number; searchTerm?: string; page?: number; pageSize?: number; sort?: string; }; Page<T>: { content: T[]; totalPages: number; totalElements: number; number: number; size: number; } }
- `frontend/src/services/productService.ts` — SERVICE layer — provides asynchronous functions for interacting with the product-related API endpoints, including getAllProducts(ProductFilterRequest): Promise<Page<ProductDto>>, getProductById(Long): Promise<ProductDto>, getAllProductCategories(): Promise<List<ProductCategory>>, and getAllBrands(): Promise<List<Brand>>.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): methods: getAllProducts(filter?: ProductFilterRequest): Promise<Page<ProductDto>>; getProductById(productId: number): Promise<ProductDto>; getAllProductCategories(): Promise<ProductCategoryDto[]>; getAllBrands(): Promise<BrandDto[]>
- `frontend/src/pages/HomePage.tsx` — PAGE layer — the main landing page, composed of HeroSection, FeaturedProducts, CategoryShowcase, and InstagramFeed components.
- `frontend/src/components/home/HeroSection.tsx` — COMPONENT layer — displays a full-width hero section with a welcoming message and a call-to-action button.
- `frontend/src/components/home/FeaturedProducts.tsx` — COMPONENT layer — fetches and displays a curated grid of featured products using ProductCard components.
- `frontend/src/components/home/CategoryShowcase.tsx` — COMPONENT layer — visually presents different product categories with images and navigation links.
- `frontend/src/pages/ProductsPage.tsx` — PAGE layer — the main product catalog page, integrating ProductFilterSidebar and ProductGrid for filtering and displaying products.
- `frontend/src/components/product/ProductFilterSidebar.tsx` — COMPONENT layer — provides UI controls for filtering products by category, brand, size, color, and price range.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): { onFilterChange: (filters: ProductFilterRequest) => void }
- `frontend/src/components/product/ProductGrid.tsx` — COMPONENT layer — receives a list of ProductDto objects and renders them in a responsive grid using ProductCard components.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): { products: ProductDto[] }
- `frontend/src/components/product/ProductCard.tsx` — COMPONENT layer — displays a single product's image, name, price, and an 'Add to Cart' button, and navigates to the product detail page.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): { product: ProductDto }
- `frontend/src/pages/ProductDetailPage.tsx` — PAGE layer — displays detailed information for a single product, including image gallery, description, and customer reviews.
- `frontend/src/components/product/ProductImageGallery.tsx` — COMPONENT layer — displays multiple high-quality images of a product in a gallery format.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): { imageUrls: string[] }
- `frontend/src/components/product/ProductDetails.tsx` — COMPONENT layer — displays product name, price, description, size/color selectors, and the 'Add to Cart' button.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): { product: ProductDto }

**Feature Instruction:**

## Design Tokens
- Navbar: bg-[#1A3A6D] text-white
- Primary CTA: bg-[#E87A00] hover:bg-[#D46C00] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200
- Secondary CTA: border border-[#1A3A6D] text-[#1A3A6D] hover:bg-[#1A3A6D] hover:text-white font-semibold rounded-full px-8 py-3 transition-all duration-200
- Brand text accent: text-[#E87A00]
- Section bg: bg-white (odd sections) / bg-[#F5F5F5] (even sections)
- Card: bg-white rounded-xl shadow-sm border border-gray-100 p-4
- Section container: <section className="py-16 px-4"><div className="max-w-7xl mx-auto">
- Hero h1: text-4xl md:text-6xl font-bold text-white
- Body: text-[#212121] leading-relaxed

This `product-browsing` feature provides the frontend components and pages for users to browse products, view product details, and add products to their cart. It consists of type definitions, a service layer for API interaction, and several React components and pages.

### `frontend/src/types/product.ts`
This file defines the TypeScript interfaces for `Product`, `ProductCategory`, and `Brand` based on the `product-catalog-core` backend data shapes. These types are used throughout the frontend for consistent data handling.

### `frontend/src/services/productService.ts`
This service file provides asynchronous functions to interact with the `product-catalog-api` backend. It will expose `getAllProducts`, `getProductById`, `getAllProductCategories`, and `getAllBrands`. These functions will internally make HTTP requests to the respective backend endpoints and return typed responses. The `getAllProducts` function will accept an optional `ProductFilterRequest` object to allow filtering and pagination.

### `frontend/src/pages/HomePage.tsx`
This page serves as the main landing page for Prakash Stores. It will be composed of several sections:
1.  **Hero Section**: A full-width hero image with a welcoming message and a call-to-action button. It will use the `HeroSection` component.
2.  **Featured Products**: A grid displaying a curated selection of products. It will use the `FeaturedProducts` component, which fetches products using `productService.getAllProducts` with a filter for featured items (if available, otherwise just a general selection).
3.  **Category Showcase**: Visually appealing sections to navigate to main product categories like Men, Women, and Kids. It will use the `CategoryShowcase` component.
4.  **Instagram Feed**: A section showcasing recent Instagram posts. It will use the `InstagramFeed` component from the `customer-engagement` feature.

### `frontend/src/components/home/HeroSection.tsx`
This component renders a full-width hero section. It will display a background image (e.g., `https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80` for a generic business, with a dark overlay), a prominent `h1` headline "Welcome to Prakash Stores" and a subheadline "Your Trusted Family Store for Quality Apparel", and a call-to-action button "Shop Now" that navigates to `/products`.

### `frontend/src/components/home/FeaturedProducts.tsx`
This component fetches and displays a grid of featured products. It will use the generated service function `getAllProducts` from `productService.ts` to fetch products. Each product will be rendered using the `ProductCard` component. The section will have a heading "Our Featured Collection" and a link to "View All Products" navigating to `/products`.

### `frontend/src/components/home/CategoryShowcase.tsx`
This component visually presents different product categories. It will display three distinct cards for "Men's Apparel", "Women's Apparel", and "Kids' Apparel", each with a relevant image (placeholder Unsplash images can be used, e.g., for men's fashion: `https://images.unsplash.com/photo-1514317751917-807530f2c459?w=1920&q=80`, women's: `https://images.unsplash.com/photo-1523268753911-b02172776828?w=1920&q=80`, kids': `https://images.unsplash.com/photo-1592877395674-0466373e7381?w=1920&q=80`) and a "Shop Now" button that navigates to `/products?category=<categoryName>`.

### `frontend/src/pages/ProductsPage.tsx`
This page is the main product catalog. It will feature a `ProductFilterSidebar` on the left and a `ProductGrid` on the right. The page will fetch products using `productService.getAllProducts`, passing filter parameters (category, brand, size, color, price range, search term) obtained from the `ProductFilterSidebar` and URL query parameters. The `ProductGrid` will display the fetched products. The page will also include a search bar at the top of the product grid area.

### `frontend/src/components/product/ProductFilterSidebar.tsx`
This component provides UI controls for filtering products. It will allow filtering by `category`, `brand`, `size`, `color`, and `price` range. It will fetch available categories and brands using `productService.getAllProductCategories` and `productService.getAllBrands`. When filter selections change, it will emit an event or call a callback function with the updated filter parameters, which `ProductsPage.tsx` will use to refetch products.

### `frontend/src/components/product/ProductGrid.tsx`
This component receives a list of `ProductDto` objects as props and renders them in a responsive grid layout. Each product in the grid will be rendered using the `ProductCard` component.

### `frontend/src/components/product/ProductCard.tsx`
This reusable component displays a single product. It takes a `ProductDto` as a prop. It will show the product's `imageUrl`, `name`, and `price` (formatted in INR using `toLocaleString('en-IN', { style: 'currency', currency: 'INR' })`). It will include an "Add to Cart" button. Clicking the button will call `useCart().addItem({ id: product.id, name: product.name, unitPrice: product.price, imageUrl: product.imageUrl })` from the `shopping-cart` feature. The card will also be clickable, navigating to `/products/{productId}`.

### `frontend/src/pages/ProductDetailPage.tsx`
This page displays detailed information for a single product. It will extract the `productId` from the URL parameters. It will fetch the product details using `productService.getProductById(productId)`. The page will be structured with a `ProductImageGallery` on one side and `ProductDetails` on the other. Below these, it will include a `ReviewList` component from the `customer-engagement` feature to display customer reviews for the product.

### `frontend/src/components/product/ProductImageGallery.tsx`
This component takes an array of image URLs (derived from `product.imageUrl` for now, potentially extended to multiple images later) and displays them in a gallery format, allowing users to view different angles or variations of the product.

### `frontend/src/components/product/ProductDetails.tsx`
This component displays the product's `name`, `price` (formatted in INR), `description`, and potentially selectors for `size` and `color` if the product has variants. It will include an "Add to Cart" button. Clicking the button will call `useCart().addItem({ id: product.id, name: product.name, unitPrice: product.price, imageUrl: product.imageUrl, variantKey: selectedSize + '-' + selectedColor })` from the `shopping-cart` feature, passing selected size and color as `variantKey` if applicable.

### Inter-file Wiring
- `HomePage.tsx` imports and renders `HeroSection.tsx`, `FeaturedProducts.tsx`, `CategoryShowcase.tsx`, and `InstagramFeed.tsx`.
- `FeaturedProducts.tsx` and `ProductsPage.tsx` use the generated service functions from `productService.ts` to fetch product data.
- `ProductsPage.tsx` imports and renders `ProductFilterSidebar.tsx` and `ProductGrid.tsx`.
- `ProductGrid.tsx` imports and renders `ProductCard.tsx` for each product.
- `ProductCard.tsx` and `ProductDetails.tsx` call `useCart().addItem()` from the `shopping-cart` feature.
- `ProductDetailPage.tsx` imports and renders `ProductImageGallery.tsx`, `ProductDetails.tsx`, and `ReviewList.tsx`.
- `ProductFilterSidebar.tsx` uses the generated service functions from `productService.ts` to fetch categories and brands.

### Error Handling
All service calls should include basic error handling, logging errors to the console, and potentially displaying a user-friendly toast notification using `sonner`.


---

## Shopping Cart

**Name:** `shopping-cart`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/pages/CartPage.tsx` — PAGE layer — displays the full shopping cart details using CartItemsTable and CartSummary components.
- `frontend/src/components/cart/CartItemsTable.tsx` — COMPONENT layer — displays cart items in a table, allowing quantity updates and item removal.
- `frontend/src/components/cart/CartSummary.tsx` — COMPONENT layer — displays the cart's financial summary and a checkout button.
- `frontend/src/components/cart/CartIcon.tsx` — COMPONENT layer — displays a cart icon with item count and toggles the CartDrawer.
- `frontend/src/components/cart/CartDrawer.tsx` — RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): { isOpen: boolean; onClose: () => void }

**Feature Instruction:**

## Design Tokens
- Navbar: bg-[#1A3A6D] text-white
- Primary CTA: bg-[#E87A00] hover:bg-[#D46A00] text-white font-semibold rounded-md px-6 py-3 transition-all duration-200
- Secondary CTA: border border-[#E87A00] text-[#E87A00] hover:bg-[#FFF3E0] font-semibold rounded-md px-6 py-3 transition-all duration-200
- Brand text accent: text-[#E87A00]
- Section bg: bg-white (odd sections) / bg-[#F5F5F5] (even sections)
- Card: bg-white rounded-lg shadow-sm border border-gray-100 p-4
- Section container: <section className="py-12 px-4"><div className="max-w-7xl mx-auto">
- Hero h1: text-4xl md:text-6xl font-bold text-white
- Body: text-[#212121] leading-relaxed

This feature provides the user interface for managing the shopping cart, including viewing items, updating quantities, removing items, and proceeding to checkout. It integrates with the pre-scaffolded headless cart framework (`@/cart`) for all cart logic and state management. The feature consists of a `CartPage` for a full cart view, `CartItemsTable` and `CartSummary` components for displaying cart details, and `CartIcon` and `CartDrawer` components for quick access and a summary from anywhere on the site.

### CartIcon.tsx
This component will display a shopping cart icon, typically in the site header. It will use the `useCart()` hook from `@/cart` to display the `cartCount` as a badge. Clicking the icon will open the `CartDrawer` component. The icon should be styled with `text-white` and the badge with `bg-[#E87A00] text-white`.

### CartDrawer.tsx
This component is a slide-out panel that provides a quick overview of the items in the cart. It will use the `useCart()` hook to display `cartItems` and `totals.total`. Each item will show its name, quantity, and unit price. The drawer will include a "View Full Cart" button that navigates to the `/cart` page and a "Proceed to Checkout" button that navigates to the `/checkout` page. The drawer should be styled with `bg-white` and `shadow-lg`.

### CartPage.tsx
This page (`/cart`) provides a comprehensive view of the shopping cart. It will use the `useCart()` hook to access `cartItems` and `totals`. It will render the `CartItemsTable` component to display the individual items and the `CartSummary` component to show the financial breakdown. The page will have a clear heading "Your Shopping Cart" and a call to action to proceed to checkout.

### CartItemsTable.tsx
This component will display the `cartItems` in a tabular format. For each item, it will show the product image, name, unit price, quantity, and total price for that item. It will provide controls to `setItemQuantity(id, qty, variantKey?)` and `removeItem(id, variantKey?)` using the `useCart()` hook. All monetary values will be displayed in Indian Rupees (₹) using `toLocaleString('en-IN', { style: 'currency', currency: 'INR' })`. The table will have a header row for "Product", "Price", "Quantity", "Total", and "Actions".

### CartSummary.tsx
This component will display the `totals` from the `useCart()` hook, including `subtotal`, `adjustments`, and `total`. It will have a prominent "Proceed to Checkout" button that navigates to the `/checkout` page. All monetary values will be displayed in Indian Rupees (₹) using `toLocaleString('en-IN', { style: 'currency', currency: 'INR' })`. The summary will be styled as a `Card` with `bg-white` and `shadow-md`.

### Inter-file Wiring
- `CartIcon.tsx` imports and renders `CartDrawer.tsx` when clicked.
- `CartPage.tsx` imports and renders `CartItemsTable.tsx` and `CartSummary.tsx`.
- All components (`CartIcon`, `CartDrawer`, `CartPage`, `CartItemsTable`, `CartSummary`) will import and utilize the `useCart()` hook from `@/cart` to interact with the cart state and logic. `CartItemsTable` will call `setItemQuantity` and `removeItem`. `CartDrawer` and `CartSummary` will provide navigation to `/cart` and `/checkout` respectively using `react-router-dom`'s `useNavigate` hook.

---

## Checkout Flow

**Name:** `checkout-flow`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/types/order.ts` — Generated from the backend API contract — defines TypeScript types for orders and order items.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): { OrderItemRequest: { productId: string | number; quantity: number; unitPrice: number; }; CreateOrderRequest: { items: OrderItemRequest[]; shippingAddress: string; contactPhone: string; orderType: 'DELIVERY' | 'PICKUP'; paymentMethod: string; }; ShippingDetails: { shippingAddress: string; contactPhone: string; orderType: 'DELIVERY' | 'PICKUP'; }; OrderDetailsForPayment: { items: OrderItemRequest[]; shippingAddress: string; contactPhone: string; orderType: 'DELIVERY' | 'PICKUP'; }; OrderItem: { id: number; productId: string | number; productName: string; quantity: number; unitPrice: number; imageUrl: string | null; }; Order: { id: string; orderItems: OrderItem[]; totalAmount: number; shippingAddress: string; contactPhone: string; orderType: 'DELIVERY' | 'PICKUP'; status: string; createdAt: string; } }
- `frontend/src/services/orderService.ts` — Generated from the backend API contract — provides functions for creating orders and fetching order history.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): methods: createOrder(request: CreateOrderRequest): Promise<Order>; getAllOrders(): Promise<Order[]>
- `frontend/src/pages/CheckoutPage.tsx` — PAGE layer — orchestrates the multi-step checkout process, managing state, user input, cart interaction, and order submission.
- `frontend/src/components/checkout/ShippingAddressForm.tsx` — COMPONENT layer — provides a form for users to input shipping details or select 'Click and Collect'.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): { initialData: ShippingDetails | undefined; onValidSubmit: (details: ShippingDetails) => void }
- `frontend/src/components/checkout/PaymentSelection.tsx` — COMPONENT layer — handles the selection of payment methods and triggers the payment process.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): { orderDetails: OrderDetailsForPayment; totalAmount: number; onOrderSuccess: (order: Order) => void; onOrderError: (error: string) => void }
- `frontend/src/components/checkout/OrderSummary.tsx` — COMPONENT layer — displays a detailed summary of the items in the cart and total amount.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): { cartItems: CartItem[]; totals: CartTotals }
- `frontend/src/pages/OrderConfirmationPage.tsx` — PAGE layer — displays a success message and order summary after a successful payment.

**Feature Instruction:**

## Design Tokens
- Navbar: bg-[#1A3A6D] text-white
- Primary CTA: bg-[#E87A00] hover:bg-[#D46A00] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200
- Brand text accent: text-[#E87A00]
- Section bg: bg-white (odd sections) / bg-[#F5F5F5] (even sections)
- Card: bg-white rounded-xl shadow-md border border-gray-100 p-6
- Section container: <section className="py-16 px-4"><div className="max-w-7xl mx-auto">
- Hero h1: text-4xl md:text-6xl font-bold text-white
- Body: text-[#212121] leading-relaxed

The checkout-flow feature provides a seamless multi-step process for users to finalize their purchases from Prakash Stores. It integrates with the pre-scaffolded cart framework and the order-management-api backend feature to create and confirm orders. The feature consists of TypeScript types for orders, a service for API interaction, and several React components for the user interface.

`frontend/src/types/order.ts` defines the `Order` and `OrderItem` interfaces, mirroring the backend `OrderResponse` and `OrderItemResponse` DTOs from the `order-management-api` feature. It also defines `CreateOrderRequest` and `OrderItemRequest` for sending data to the backend.

`frontend/src/services/orderService.ts` provides asynchronous functions to interact with the `order-management-api`. It will expose `createOrder(request: CreateOrderRequest): Promise<OrderResponse>` to submit a new order and `getAllOrders(): Promise<OrderResponse[]>` to fetch the current user's order history. These functions will use the generated API client to make HTTP calls.

`frontend/src/pages/CheckoutPage.tsx` orchestrates the entire checkout process. It uses the `useCart()` hook from the pre-scaffolded cart framework to access cart items and totals. The page will manage the checkout steps (e.g., Shipping/Pickup, Payment, Review) using `useCheckout()` and render the `ShippingAddressForm`, `OrderSummary`, and `PaymentSelection` components based on the current step. When the user proceeds to payment, it will construct a `CreateOrderRequest` from the cart items and user-provided details, then call `orderService.createOrder()`. Upon successful order creation, it will clear the cart and navigate the user to the `OrderConfirmationPage`.

`frontend/src/components/checkout/ShippingAddressForm.tsx` is a form component that allows users to enter their shipping address details or select a 'Click and Collect' option. It will capture `shippingAddress` and `contactPhone` which are part of the `CreateOrderRequest`. This component will include input fields for name, address line 1, address line 2, city, state, pincode, and phone number. It will also have a checkbox or radio button for 'Click and Collect' which, if selected, will pre-fill the address with Prakash Stores' address (Showroom No 1, 90 Madhukunj, Aundh Rd, Pune, Maharashtra 411020) and disable the address input fields. The component will emit an event or call a prop function with the collected address and phone details.

`frontend/src/components/checkout/OrderSummary.tsx` displays a detailed breakdown of the items in the cart, including product names, quantities, unit prices, and an image. It will also show the subtotal, any adjustments (from `useCart().totals.adjustments`), and the final total amount (from `useCart().totals.total`). All monetary values will be formatted in Indian Rupees (₹) using `toLocaleString('en-IN', { style: 'currency', currency: 'INR' })`.

`frontend/src/components/checkout/PaymentSelection.tsx` presents various payment options to the user, such as UPI, Credit/Debit Cards, and Net Banking. It will integrate with a payment gateway (simulated for this project) to handle the payment process. When a payment option is selected and confirmed, it will trigger the final order submission via `orderService.createOrder()`. This component will display the final `totalAmount` from the cart for confirmation.

`frontend/src/pages/OrderConfirmationPage.tsx` is the final page displayed after a successful order. It will show a confirmation message, the order ID, and a summary of the purchased items and total amount. It will also provide options to view order details or continue shopping. All monetary values will be formatted in Indian Rupees (₹) using `toLocaleString('en-IN', { style: 'currency', currency: 'INR' })`.

---

## Authentication UI

**Name:** `auth-ui`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/components/ProtectedRoute.tsx` — A React component that acts as a route guard, restricting access to its children based on user authentication status and optional roles.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): { children: React.ReactNode; roles: string[] | undefined }
- `frontend/src/pages/LoginPage.tsx` — A React page component providing a login form for user authentication.
- `frontend/src/pages/SignupPage.tsx` — A React page component providing a signup form for new user registration.
- `frontend/src/pages/AccountPage.tsx` — A React page component serving as the customer's account dashboard with tabs for profile details and order history.
- `frontend/src/components/account/ProfileDetails.tsx` — A React component displaying the authenticated user's profile information within the account page.
- `frontend/src/components/account/OrderHistory.tsx` — A React component displaying a list of the authenticated user's past orders.

**Feature Instruction:**

## Design Tokens
- Navbar: bg-[#1A3A6D] text-white
- Primary CTA: bg-[#E87A00] hover:bg-[#D46B00] text-white font-semibold rounded-md px-6 py-3 transition-all duration-200
- Secondary CTA: bg-gray-200 hover:bg-gray-300 text-[#212121] font-semibold rounded-md px-6 py-3 transition-all duration-200
- Brand text accent: text-[#E87A00]
- Section bg: bg-[#F5F5F5] (odd sections) / bg-white (even sections)
- Card: bg-white rounded-lg shadow-sm border border-gray-100 p-5
- Section container: <section className="py-12 px-4"><div className="max-w-7xl mx-auto">
- Hero h1: text-4xl md:text-6xl font-bold text-white
- Body: text-[#212121] leading-relaxed
- Input field: border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-[#E87A00] focus:border-transparent

This `auth-ui` feature provides the user interface for authentication, including login, signup, and a protected account dashboard. It consists of three main pages: `LoginPage`, `SignupPage`, and `AccountPage`, along with a `ProtectedRoute` component to guard routes and two sub-components for the account page: `ProfileDetails` and `OrderHistory`.

### `ProtectedRoute.tsx`
This component acts as a route guard. It uses the `useAuth()` hook (from the fenced foundation) to check if a user is authenticated. If the user is not authenticated, they are redirected to the `/login` page. Optionally, it can also check for specific user roles. The component renders its children only if the authentication and role conditions are met.

### `LoginPage.tsx`
This page provides a form for users to log in. It will use the `useAuth()` hook to access the `login` function. The form will include fields for email and password. Upon successful login, the user will be redirected to the home page (`/`). The UI should be clean and modern, with clear input fields and a prominent call to action button using the primary CTA design token. It should also include a link to the `SignupPage` for new users.

### `SignupPage.tsx`
This page offers a form for new users to create an account. It will use the `useAuth()` hook to access the `signup` function. The form will include fields for name, email, and password. Upon successful signup, the user will be redirected to the `LoginPage`. The UI should be welcoming and straightforward, consistent with the `LoginPage`'s design, using the primary CTA design token for the signup button.

### `AccountPage.tsx`
This page serves as the customer's personal dashboard. It will display user-specific information and actions. The page will feature a tabbed interface, with tabs for "Profile Details" and "Order History". It will use the `useAuth()` hook to retrieve the current user's details (`user` object) and display a welcome message. The page will render the `ProfileDetails` component when the "Profile Details" tab is active and the `OrderHistory` component when the "Order History" tab is active. The layout should be clean and easy to navigate, reflecting a reliable and community-focused tone.

### `ProfileDetails.tsx`
This component, rendered within `AccountPage`, displays the authenticated user's profile information. It will retrieve user details from the `useAuth()` hook. It should display fields such as name and email, and potentially offer an option to edit these details (though the edit functionality itself is out of scope for this feature). The design should be simple and clear, using standard input field design tokens.

### `OrderHistory.tsx`
This component, rendered within `AccountPage`, displays a list of the authenticated user's past orders. It will fetch the order history by calling the generated service function `getAllOrders(): Promise<List<OrderResponse>>` from the `order-management-api` feature. The orders should be displayed in a clear, tabular format, showing details like `orderDate`, `totalAmount`, `status`, and `orderItems`. Each order item should display `productName`, `quantity`, and `unitPrice`. Monetary values (`totalAmount`, `unitPrice`) must be formatted in Indian Rupees (₹) using `toLocaleString('en-IN', { style: 'currency', currency: 'INR' })`. If there are no orders, a friendly message should be displayed. The component will use the `OrderResponse` data shape from `order-management-api` to render the order details.

---

## Customer Engagement

**Name:** `customer-engagement`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/types/review.ts` — Generated from the backend API contract — defines TypeScript types for product reviews.
- `frontend/src/services/reviewService.ts` — Generated from the backend API contract — provides functions for submitting and fetching product reviews.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): methods: getReviewsByProductId(productId: number): Promise<ReviewDto[]>; createReview(request: { productId: number; rating: number; comment: string; }): Promise<ReviewDto>
- `frontend/src/types/event.ts` — Generated from the backend API contract — defines TypeScript types for in-store events.
- `frontend/src/services/eventService.ts` — Generated from the backend API contract — provides functions for fetching event data from the API.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): methods: getAllEvents(): Promise<EventDto[]>
- `frontend/src/components/home/InstagramFeed.tsx` — COMPONENT layer — displays a grid of recent Instagram posts with placeholder content.
- `frontend/src/components/review/ReviewList.tsx` — COMPONENT layer — displays a list of customer reviews for a product and integrates ReviewForm for new submissions. It consumes the generated service function getReviewsByProductId(productId: Long): Promise<ReviewDto[]>.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): { productId: number }
- `frontend/src/components/review/ReviewForm.tsx` — COMPONENT layer — a form for authenticated users to submit a rating and a written review. It consumes the generated service function createReview(request: CreateReviewRequest): Promise<ReviewDto>.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): { productId: number; onReviewSubmitted: (review: ReviewDto) => void }
- `frontend/src/pages/EventsPage.tsx` — PAGE layer — displays a list of upcoming in-store events. It consumes the generated service function getAllEvents(): Promise<EventDto[]>.
- `frontend/src/components/event/EventList.tsx` — COMPONENT layer — displays a list of event cards.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): { events: EventDto[] }
- `frontend/src/components/event/EventCard.tsx` — COMPONENT layer — displays information about a single store event.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): { event: EventDto }
- `frontend/src/pages/AboutPage.tsx` — PAGE layer — a static page telling the story of Prakash Stores.
- `frontend/src/pages/ContactPage.tsx` — PAGE layer — a static page with store address, contact details, opening hours, and an embedded map.
- `frontend/src/components/shared/WhatsAppCta.tsx` — COMPONENT layer — a floating action button for WhatsApp chat integration.

**Feature Instruction:**

## Design Tokens
- Navbar: bg-[#1A3A6D] text-white
- Primary CTA: bg-[#E87A00] hover:bg-[#D46C00] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200
- Brand text accent: text-[#E87A00]
- Section bg: bg-white (odd sections) / bg-[#F5F5F5] (even sections)
- Card: bg-white rounded-xl shadow-md border border-gray-100 p-6
- Section container: <section className="py-16 px-4"><div className="max-w-7xl mx-auto">
- Hero h1: text-4xl md:text-6xl font-bold text-white
- Body: text-[#212121] leading-relaxed

This `customer-engagement` feature provides components and pages for customer interaction, including product reviews, in-store events, and static content like About Us and Contact Us pages. It also includes a floating WhatsApp CTA for direct customer service.

### Data Flow and Interactions

1.  **Reviews:**
    *   `ReviewList.tsx` displays reviews for a specific product and integrates `ReviewForm.tsx` for submitting new reviews. It fetches existing reviews using the generated service function `getReviewsByProductId(productId: Long): Promise<ReviewDto[]>` from the `review-system` backend feature.
    *   `ReviewForm.tsx` allows authenticated users to submit a rating and comment. Upon submission, it calls the generated service function `createReview(request: CreateReviewRequest): Promise<ReviewDto>` from the `review-system` backend feature. The `CreateReviewRequest` object will contain `productId`, `rating`, and `comment`.
    *   `review.ts` defines the `Review` and `CreateReviewRequest` TypeScript interfaces, mirroring the backend DTOs.
    *   `reviewService.ts` provides the client-side functions to interact with the `/api/v1/reviews` and `/api/v1/reviews/product/{productId}` endpoints of the `review-system` backend feature.

2.  **Events:**
    *   `EventsPage.tsx` is the main page for displaying upcoming events. It fetches all events using the generated service function `getAllEvents(): Promise<EventDto[]>` from the `event-management` backend feature.
    *   `EventList.tsx` receives a list of `EventDto` objects and renders them using `EventCard.tsx` components.
    *   `EventCard.tsx` displays individual event details such as name, description, date, time, and image.
    *   `event.ts` defines the `Event` and `EventDto` TypeScript interfaces, mirroring the backend DTOs.
    *   `eventService.ts` provides the client-side functions to interact with the `/api/v1/events` endpoint of the `event-management` backend feature.

3.  **Static Pages:**
    *   `AboutPage.tsx` presents information about Prakash Stores, its history, and values. It will include a hero section with a relevant image and text, followed by sections detailing the business's story and commitment to the community. The hero image should be `https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80` with a `bg-black bg-opacity-50` overlay.
    *   `ContactPage.tsx` displays the store's address (Showroom No 1, 90 Madhukunj, Aundh Rd, Pune, Maharashtra 411020), phone number (093710 25731), opening hours, and an embedded Google Map using the coordinates 18.562196, 73.813639. The map should be a simple iframe or a react-google-maps component if available in the scaffolded project, displaying a marker at the given coordinates.

4.  **Instagram Feed:**
    *   `InstagramFeed.tsx` is a component intended for the home page (or similar landing pages) to display a grid of recent Instagram posts. It will contain placeholder content as there is no direct API integration for Instagram in this project. It should visually represent an Instagram feed with image placeholders and engagement metrics.

5.  **WhatsApp CTA:**
    *   `WhatsAppCta.tsx` is a floating action button that provides a direct link to WhatsApp for customer service. It should be positioned at the bottom right of the screen and include the WhatsApp icon and a link to `https://wa.me/919371025731` (using the business phone number).

### Styling and Design
All components and pages will adhere to the defined design tokens and visual direction. Use Tailwind CSS classes for all styling. Monetary values, if any, should be formatted using `toLocaleString('en-IN', { style: 'currency', currency: 'INR' })`.

---

## Admin Portal

**Name:** `admin-portal`  
**Type:** FRONTEND  
**Change required:** true

**Files in this feature:**
- `frontend/src/components/AdminLayout.tsx` — Admin layout component — provides the consistent navigation sidebar and header for all admin pages, rendering its children within the main content area.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): { children: React.ReactNode }
- `frontend/src/pages/admin/AdminDashboardPage.tsx` — Admin dashboard page — displays an overview of key metrics and provides quick navigation links for administrators.
- `frontend/src/pages/admin/AdminProductsPage.tsx` — Admin product management page — fetches and displays products, and orchestrates product creation, editing, and deletion using ProductTable and ProductForm components.
- `frontend/src/components/admin/product/ProductTable.tsx` — Product table component — displays a list of products with actions for editing, deleting, and updating stock.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): { products: ProductDto[]; onEdit: (product: ProductDto) => void; onDelete: (product: ProductDto) => void; onUpdateStock: (product: ProductDto, newQuantity: number) => void }
- `frontend/src/components/admin/product/ProductForm.tsx` — Product form component — provides a form for creating or editing product details, including fetching categories and brands.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): { initialData: ProductDto | null; onSubmit: (data: ProductDto) => void; onCancel: () => void }
- `frontend/src/pages/admin/AdminOrdersPage.tsx` — Admin order management page — fetches and displays customer orders, allowing status updates via the OrderTable component.
- `frontend/src/components/admin/order/OrderTable.tsx` — Order table component — displays a list of customer orders with options to filter and update order status.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): { orders: Order[]; onUpdateStatus: (order: Order, newStatus: OrderStatus) => void }
- `frontend/src/pages/admin/AdminEventsPage.tsx` — Admin event management page — fetches and displays events, and orchestrates event creation, editing, and deletion using EventTable and EventForm components.
- `frontend/src/components/admin/event/EventTable.tsx` — Event table component — displays a list of store events with actions for editing and deleting.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): { events: EventDto[]; onEdit: (event: EventDto) => void; onDelete: (event: EventDto) => void }
- `frontend/src/components/admin/event/EventForm.tsx` — Event form component — provides a form for creating or editing event details.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): { initialData: EventDto | null; onSubmit: (data: EventDto) => void; onCancel: () => void }
- `frontend/src/components/admin/shared/DeleteConfirmationDialog.tsx` — Reusable delete confirmation dialog component — prompts the user to confirm a delete action.

RECONCILED CONTRACT (ground truth — implement EXACTLY this interface): { isOpen: boolean; onClose: () => void; onConfirm: () => void; itemToDeleteName: string }

**Feature Instruction:**

## Design Tokens
- Navbar: bg-[#1A3A6D] text-white
- Sidebar: bg-[#1A3A6D] text-white
- Primary CTA: bg-[#E87A00] hover:bg-[#D46A00] text-white font-semibold rounded-md px-4 py-2 transition-all duration-200
- Secondary CTA: bg-gray-200 hover:bg-gray-300 text-[#212121] font-semibold rounded-md px-4 py-2 transition-all duration-200
- Brand text accent: text-[#E87A00]
- Section bg: bg-[#F5F5F5]
- Card: bg-white rounded-lg shadow-sm border border-gray-100 p-4
- Section container: <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
- Body: text-[#212121] leading-relaxed
- Table Header: bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider
- Table Row: bg-white border-b border-gray-200 hover:bg-gray-50

This Admin Portal feature provides a comprehensive web interface for Prakash Stores' administrators to manage products, orders, and events. It consists of a main layout (`AdminLayout.tsx`) that provides consistent navigation and structure for all admin pages. The `AdminDashboardPage.tsx` serves as the entry point, offering an overview. Product management is handled by `AdminProductsPage.tsx`, which integrates `ProductTable.tsx` for displaying products and `ProductForm.tsx` for creating/editing them. Similarly, `AdminOrdersPage.tsx` uses `OrderTable.tsx` to manage customer orders, and `AdminEventsPage.tsx` uses `EventTable.tsx` and `EventForm.tsx` for event management. A shared `DeleteConfirmationDialog.tsx` component provides a consistent experience for confirming delete operations across the portal.

### AdminLayout.tsx
This component provides the overall structure for the admin section, including a sidebar for navigation and a main content area. It will render its children within this layout. The sidebar will contain links to the Dashboard, Products, Orders, and Events pages. The layout will have a fixed header with the business name "Prakash Stores Admin" and a user menu (placeholder for future authentication features).

### AdminDashboardPage.tsx
This page serves as the landing page for the admin portal. It will display a welcome message and provide quick links or summary statistics for products, orders, and events. For example, it could show counts of total products, pending orders, and upcoming events. This page will use the `Section container` design token for its layout.

### AdminProductsPage.tsx
This page allows administrators to manage the product catalog. It will fetch all products using the generated service function `getAllProducts()` from the `product-catalog-api` feature. It will render the `ProductTable` component to display the products. It will also include buttons to "Add New Product" and handle product editing and deletion. When adding or editing a product, a modal will open, rendering the `ProductForm` component. The `ProductForm` will be responsible for submitting new product data or updated product data using the generated service functions `createProduct()` and `updateProduct()` respectively. Deletion will trigger the `DeleteConfirmationDialog` and then call the `deleteProduct()` service function. Stock updates will be handled via an inline action in the `ProductTable` and call `updateProductStock()`.

### ProductTable.tsx
This component displays a paginated table of products. It will receive a list of `ProductDto` objects as props. Each row will display product details such as `id`, `name`, `price` (formatted in INR), `stockQuantity`, `category`, and `brand`. It will include action buttons for "Edit", "Delete", and a stepper for "Stock Quantity" adjustment. The "Edit" button will trigger the `onEdit` callback with the product data. The "Delete" button will trigger the `onDelete` callback with the product ID. The stock stepper will trigger the `onUpdateStock` callback with the product ID and the new quantity.

### ProductForm.tsx
This component provides a form for creating or editing a `ProductDto`. It will accept an optional `ProductDto` prop for pre-filling the form when editing. The form will include fields for `name`, `description`, `price`, `imageUrl`, `stockQuantity`, `size`, `color`, `material`, `gender`, `active`, `category` (dropdown), and `brand` (dropdown). The `category` and `brand` dropdowns will fetch their options using `getAllProductCategories()` and `getAllBrands()` from the `product-browsing` feature's generated service functions. Upon submission, it will call the `onSubmit` callback with the form data. Input fields will have appropriate validation.

### AdminOrdersPage.tsx
This page allows administrators to view and manage customer orders. It will fetch all orders using the generated service function `getAllOrders()` from the `order-management-api` feature. It will render the `OrderTable` component to display the orders. It will also provide filtering options by order status.

### OrderTable.tsx
This component displays a table of customer orders. It will receive a list of `OrderResponse` objects as props. Each row will display order details such as `id`, `orderDate`, `totalAmount` (formatted in INR), `status`, `orderType`, `shippingAddress`, and `contactPhone`. It will include an action to update the order status using a dropdown, which will call the `onUpdateStatus` callback with the order ID and the new status. The `onUpdateStatus` callback will then call the generated service function `updateOrderStatus()` from the `order-management-api` feature.

### AdminEventsPage.tsx
This page allows administrators to manage in-store events. It will fetch all events using the generated service function `getAllEvents()` from the `event-management` feature. It will render the `EventTable` component to display the events. It will also include buttons to "Add New Event" and handle event editing and deletion. When adding or editing an event, a modal will open, rendering the `EventForm` component. The `EventForm` will be responsible for submitting new event data or updated event data using the generated service functions `createEvent()` and `updateEvent()` respectively. Deletion will trigger the `DeleteConfirmationDialog` and then call the `deleteEvent()` service function.

### EventTable.tsx
This component displays a table of events. It will receive a list of `EventDto` objects as props. Each row will display event details such as `id`, `name`, `eventDate`, `eventTime`, and `imageUrl`. It will include action buttons for "Edit" and "Delete". The "Edit" button will trigger the `onEdit` callback with the event data. The "Delete" button will trigger the `onDelete` callback with the event ID.

### EventForm.tsx
This component provides a form for creating or editing an `EventDto`. It will accept an optional `EventDto` prop for pre-filling the form when editing. The form will include fields for `name`, `description`, `eventDate`, `eventTime`, and `imageUrl`. Upon submission, it will call the `onSubmit` callback with the form data. Input fields will have appropriate validation.

### DeleteConfirmationDialog.tsx
This is a reusable modal dialog component that prompts the user to confirm a delete action. It will accept `isOpen` (boolean), `onClose` (function), `onConfirm` (function), and `itemToDeleteName` (string) as props. It will display a message like "Are you sure you want to delete [itemToDeleteName]? This action cannot be undone." and provide "Cancel" and "Delete" buttons. The "Delete" button will be styled with a destructive color (e.g., red) and trigger the `onConfirm` callback.

---

## Infrastructure

**Name:** `infrastructure`  
**Type:** INFRA  
**Change required:** true

**Files in this feature:**
- `frontend/src/App.tsx`
- `frontend/src/pages/NotFoundPage.tsx`

**Feature Instruction:**

_Not enriched (INFRA or skipped)._

---

