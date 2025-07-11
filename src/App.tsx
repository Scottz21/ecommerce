import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS for styling
import { ProductProvider } from "./context/ProductContext"; // Provides custom product context
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // For React Query
import Cart from "./components/Cart"; // Shopping cart page

function App() {
  // Create a QueryClient instance for React Query
  const client = new QueryClient();

  return (
    // Provide React Query context to all children
    <QueryClientProvider client={client}>
      {/* Provide custom product context */}
      <ProductProvider>
        {/* Set up React Router for page navigation */}
        <BrowserRouter>
          <Routes>
            {/* Route for home/product listing */}
            <Route path="/" element={<Home />} />
            {/* Route for user profile */}
            <Route path="/profile" element={<Profile />} />
            {/* Route for shopping cart */}
            <Route path="/cart" element={<Cart />} />
            {/* Add more routes as needed */}
          </Routes>
        </BrowserRouter>
      </ProductProvider>
    </QueryClientProvider>
  );
}

export default App;
