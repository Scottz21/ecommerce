import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";
import type { Order, Product } from "../types/types";
import { auth } from "../firebaseConfig";

// Defines the shape of the order context for TypeScript
interface OrderContextType {
  orders: Order[];
  placeOrder: (cartProducts: Product[], total: number) => Promise<void>;
  fetchOrders: () => Promise<void>;
}

// Create the order context, initialized as undefined for safety
const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  // Fetch all orders for the currently logged-in user
  const fetchOrders = async () => {
    const user = auth.currentUser;
    if (!user) return;
    // Query the 'orders' collection where userId matches current user
    const q = query(collection(db, "orders"), where("userId", "==", user.uid));
    const snapshot = await getDocs(q);
    // Map snapshot documents to Order objects (with TypeScript casting)
    const ordersData: Order[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Order[];
    setOrders(ordersData);
  };

  // Place a new order for the current user, then refresh order list
  const placeOrder = async (cartProducts: Product[], total: number) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Not logged in");
    // Add the order document to Firestore with user reference and timestamp
    await addDoc(collection(db, "orders"), {
      userId: user.uid,
      products: cartProducts,
      createdAt: Date.now(),
      total,
    });
    await fetchOrders();
  };

  // Fetch user orders when the provider mounts (user logs in/out)
  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <OrderContext.Provider value={{ orders, placeOrder, fetchOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

// Custom hook for accessing the order context, with usage safety check
export const useOrderContext = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrderContext must be used within an OrderProvider");
  return ctx;
};

