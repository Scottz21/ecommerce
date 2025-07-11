import { useEffect } from "react";
import type { Product } from "../types/types";
import ProductCard from "../components/ProductCard";
import { useProductContext } from "../context/ProductContext";
import { useNavigate } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { fetchProducts, fetchCategories } from "../api/api";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { products, dispatch, selectedCategory } = useProductContext();

  // Get cart count from Redux
  const cartCount = useSelector((state: RootState) =>
    state.cart.reduce((sum, item) => sum + item.count, 0)
  );
  
  // Fetch products using react-query
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  useEffect(() => {
    if (productsData) {
      dispatch({ type: 'SET_PRODUCTS', payload: productsData.data });
    }
  }, [productsData, dispatch]);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const getFilteredProducts = () => {
    if (selectedCategory) {
      return products.filter((product: Product) => product.category === selectedCategory);
    }
    return products;
  };

  const filteredProducts = getFilteredProducts();

  return (
    <section className="bg-light py-5">
      <div className="container">
        {/* 🛒 View Cart Button with Badge */}
        <div className="d-flex justify-content-end mb-3 position-relative">
          <button
            className="btn btn-warning position-relative"
            onClick={() => navigate("/cart")}
          >
            🛒 View Cart
            {cartCount > 0 && (
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                style={{ fontSize: "0.85rem" }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>

        <select 
          onChange={(e) => dispatch({ type: 'SET_SELECTED_CATEGORY', payload: e.target.value })}
          className="form-select mb-4"
          value={selectedCategory}
        >
          <option value="">All Categories</option>
          {categories?.data.map((category: string) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <button
          className="btn btn-secondary mb-4 ms-2"
          onClick={() => dispatch({ type: 'SET_SELECTED_CATEGORY', payload: '' })}
        >
          Clear Filter
        </button>
        <button
          onClick={() => navigate("/profile")}
          className="btn btn-primary mb-4 ms-2"
        >
          Go to Profile
        </button>
        {isLoading && <div className="text-center">Loading...</div>}
        <h2 className="text-center fw-bold mb-4">Featured Products</h2>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {filteredProducts.map((product: Product) => (
            <div className="col d-flex" key={product.id}>
              <div className="w-100 h-100 d-flex align-items-stretch">
                <ProductCard product={product} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home;
