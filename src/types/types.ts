// Represents a single product in the store
export interface Product {
  id?: string;                // Firestore document ID (optional for new products)
  title: string;              // Name/title of the product
  price: number;              // Price in USD (or other currency)
  description: string;        // Short product description
  category: string;           // Category name (ex: "electronics")
  image?: string;             // Image URL (optional for flexibility)
  rating?: {                  // Optional user rating (if available)
    rate: number;             // Average rating value (ex: 4.5)
    count: number;            // Number of ratings
  };
}

// Represents a single user order
export interface Order {
  id?: string;                // Firestore document ID for order
  userId: string;             // ID of the user who placed the order
  products: Product[];        // Array of products in this order
  createdAt: number;          // Timestamp (milliseconds since epoch)
  total: number;              // Total order price
}

// Alias for product category name
export type Category = string;
