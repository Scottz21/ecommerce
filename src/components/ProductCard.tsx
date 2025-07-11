import type { Product } from "../types/types";
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { useState } from "react";

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const dispatch = useDispatch();

  // Local state to show "Added!" feedback message
  const [added, setAdded] = useState(false);

  return (
    <div
      className="card m-2"
      style={{
        width: "260px",
        border: "1px solid rgba(0, 0, 0, 0.05)",
        borderRadius: "1rem",
        overflow: "hidden",
        backgroundColor: "#fff",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)", 
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        cursor: "pointer",
        position: "relative",
      }}
      // Apply hover effect on mouse enter
      onMouseEnter={(e) => {
        const target = e.currentTarget as HTMLDivElement;
        target.style.transform = "translateY(-6px) scale(1.02)";
        target.style.boxShadow = "0 16px 32px rgba(0, 0, 0, 0.15), 0 0 0 2px rgba(13, 110, 253, 0.08)";
      }}
      // Remove hover effect on mouse leave
      onMouseLeave={(e) => {
        const target = e.currentTarget as HTMLDivElement;
        target.style.transform = "none";
        target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.06)"; 
      }}
    >
      <img
        src={product.image}
        alt={product.title}
        className="card-img-top"
        style={{
          height: "200px",
          objectFit: "contain",
          background: "linear-gradient(135deg, #f9fafb, #e9ecf3)",
          padding: "1.25rem",
        }}
      />
      <div className="card-body p-3">
        <h5 className="card-title mb-1 fw-semibold text-dark" style={{ fontSize: "1.1rem" }}>
          {product.title}
        </h5>
        <h6 className="text-secondary mb-2" style={{ fontSize: "0.9rem" }}>
          {product.category}
        </h6>
        <p className="card-text text-muted mb-3" style={{ fontSize: "0.92rem", minHeight: "48px", lineHeight: "1.4" }}>
          {product.description}
        </p>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="fw-bold text-primary" style={{ fontSize: "1.1rem" }}>
            ${product.price}
          </span>
          <span
            className="badge"
            style={{
              background: "linear-gradient(90deg, #ffe259, #ffa751)",
              color: "#212529",
              fontWeight: 600,
              fontSize: "0.85rem",
              padding: "0.4rem 0.75rem",
              borderRadius: "1rem",
              boxShadow: "0 2px 6px rgba(255, 174, 81, 0.4)",
            }}
          >
            {product.rating.rate} ★
          </span>
        </div>
        {/* Add to Cart button. Shows feedback when clicked. */}
        <button
          className="btn btn-success w-100"
          onClick={() => {
            dispatch(addToCart(product));
            setAdded(true);
            setTimeout(() => setAdded(false), 1200); // Hide feedback after 1.2s
          }}
        >
          Add to Cart
        </button>
        {/* Inline feedback message */}
        {added && (
          <div style={{ color: "green", fontWeight: 600, textAlign: "center", marginTop: "0.3rem" }}>
            ✓ Added!
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
