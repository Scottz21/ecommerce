import type { Product } from "../types/types";
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { useState } from "react";
import {  
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
} from "@mui/material";

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false); // Track "Added to cart" feedback state

  return (
    <Card
      elevation={4}
      sx={{
        width: 340,                  // Wider card for visual emphasis
        minWidth: 320,
        borderRadius: 4,
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "scale(1.035)",
          boxShadow: "0 10px 32px 0 rgba(80,120,220,0.13)",
        },
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "linear-gradient(135deg, #fffbe6 65%, #f0f4ff 100%)"
      }}
    >
      {/* Product image */}
      <CardMedia
        component="img"
        image={product.image}
        alt={product.title}
        sx={{
          height: 200, // Keeps images a consistent height
          objectFit: "contain",
          background: "linear-gradient(90deg,#fffbe6 80%, #e3f0ff 100%)",
          p: 2,
        }}
      />
      {/* Product info and actions */}
      <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {/* Category badge */}
        <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600, mb: 0.5 }}>
          {product.category}
        </Typography>
        {/* Title */}
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, minHeight: 58 }}>
          {product.title}
        </Typography>
        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, minHeight: 46 }}
        >
          {product.description}
        </Typography>
        {/* Price and rating */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Typography variant="subtitle1" color="success.main" sx={{ fontWeight: 700 }}>
            ${product.price}
          </Typography>
          <Chip
            label={`${product?.rating?.rate} ★`}
            size="small"
            sx={{
              bgcolor: "#fff8e1",
              color: "#ff9800",
              fontWeight: 700,
              fontSize: "1rem",
              px: 1.5,
              borderRadius: 2
            }}
          />
        </Box>
        {/* Add to Cart button with feedback */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => {
            dispatch(addToCart(product)); // Dispatch add-to-cart action
            setAdded(true);               // Show feedback
            setTimeout(() => setAdded(false), 1200); // Remove feedback after 1.2s
          }}
          sx={{
            fontWeight: 700,
            letterSpacing: 1,
            mb: 0.5,
            background: "linear-gradient(90deg, #43cea2 0%, #185a9d 100%)"
          }}
        >
          Add to Cart
        </Button>
        {/* Temporary added-to-cart confirmation */}
        {added && (
          <Typography variant="body2" sx={{ color: "green", textAlign: "center", mt: 0.5 }}>
            ✓ Added!
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;
