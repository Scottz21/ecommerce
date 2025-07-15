import { createContext, useContext, useReducer, useEffect } from "react";
import type { ReactNode } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import type { Product } from "../types/types";

// Action types for reducer: set products, set selected category
type ProductAction =
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'SET_SELECTED_CATEGORY'; payload: string };

// State structure for product context
interface ProductState {
  products: Product[];
  selectedCategory: string;
}

const initialState: ProductState = {
  products: [],
  selectedCategory: ''
};

// Reducer to handle product state updates
const productReducer = (state: ProductState, action: ProductAction): ProductState => {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'SET_SELECTED_CATEGORY':
      return { ...state, selectedCategory: action.payload };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

// ProductContext type includes state, actions, and derived categories
interface ProductContextType extends ProductState {
  dispatch: React.Dispatch<ProductAction>;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, "id">) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  categories: string[]; // Derived from product data
}

// Initialize context (undefined for type safety)
const ProductContext = createContext<ProductContextType | undefined>(undefined);

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, initialState);

  // Fetch all products from Firestore and update context state
  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "products"));
    const products: Product[] = querySnapshot.docs.map(docu => ({
      id: docu.id,
      ...docu.data(),
    })) as Product[];
    dispatch({ type: "SET_PRODUCTS", payload: products });
  };

  // Add new product to Firestore and refresh context state
  const addProduct = async (product: Omit<Product, "id">) => {
    await addDoc(collection(db, "products"), product);
    await fetchProducts();
  };

  // Update a Firestore product by ID and refresh context state
  const updateProduct = async (id: string, product: Partial<Product>) => {
    await updateDoc(doc(db, "products", id), product);
    await fetchProducts();
  };

  // Delete a product from Firestore by ID and refresh context state
  const deleteProduct = async (id: string) => {
    await deleteDoc(doc(db, "products", id));
    await fetchProducts();
  };

  // On mount, fetch products (side effect)
  useEffect(() => {
    fetchProducts();
  }, []);

  // Derive categories from all unique product.category values
  const categories = Array.from(new Set(state.products.map(product => product.category)));

  return (
    <ProductContext.Provider value={{
      ...state,
      dispatch,
      fetchProducts,
      addProduct,
      updateProduct,
      deleteProduct,
      categories // Expose as context value
    }}>
      {children}
    </ProductContext.Provider>
  );
};

// Custom hook for safer context access (enforces provider usage)
export const useProductContext = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductContext must be used within a ProductProvider");
  }
  return context;
};
