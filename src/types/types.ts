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
  userId: string;             // ID of the user who created/owns the product
}

export interface Order {
  id: string; // Firestore document ID
  userId: string;
  products: Product[]; // Array of products in the order  
  createdAt: number; // Timestamp of when the order was placed
  total: number; // Total price of the order

}