import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProductProvider } from "./context/ProductContext";
import { AuthProvider } from "./context/AuthContext";
import { OrderProvider } from "./context/OrderContext";
import Navbar from "./components/Navbar/Navbar";

import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Cart from "./components/Cart";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import UserProducts from "./pages/UserProducts";

function App() {
  // QueryClient instance for React Query (caching, async state)
  const client = new QueryClient();

  return (
    <QueryClientProvider client={client}>
      {/* Product context provides product state/actions across the app */}
      <ProductProvider>
        {/* Auth context manages login state for all children */}
        <AuthProvider>
          {/* Order context manages order creation and retrieval */}
          <OrderProvider>
            <BrowserRouter>
              {/* Navigation bar always present */}
              <Navbar />
              {/* Route definitions */}
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/my-products" element={<UserProducts />} /> {/* User's product management */}
                {/* Add more routes as needed */}
              </Routes>
            </BrowserRouter>
          </OrderProvider>
        </AuthProvider>
      </ProductProvider>
    </QueryClientProvider>
  );
}

export default App;

