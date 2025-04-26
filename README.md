# E-commerce Backend Service

A TypeScript-based backend service for handling e-commerce operations including cart management, checkout, and payment processing.

## Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT Authentication

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── config/           # Configuration files
├── controllers/      # Route controllers
├── models/          # MongoDB models
├── routes/          # API routes
├── services/        # Business logic
├── middlewares/     # Custom middlewares
├── types/           # TypeScript interfaces
├── utils/           # Helper functions
└── app.ts           # Main application file
```

## API Endpoints

### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details
- `GET /api/products/source/:sourceId` - Get products by source

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:itemId` - Update cart item
- `DELETE /api/cart/items/:itemId` - Remove item from cart
- `PUT /api/cart/items/:itemId/select` - Toggle item selection

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - List user's orders
- `GET /api/orders/:id` - Get order details

## Development

To start the development server with hot reload:
```bash
npm run dev
```

To build the project:
```bash
npm run build
```

## Testing

To run tests:
```bash
npm test
```

## License

MIT 