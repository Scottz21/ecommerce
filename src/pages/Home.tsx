import { useEffect } from "react";
import type { Product } from "../types/types";
import ProductCard from "../components/ProductCard";
import { useProductContext } from "../context/ProductContext";
import { useNavigate } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from "../api/api";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

import {
  Container,
  Grid,
  Select,
  MenuItem,
  Button,
  Box,
  Typography,
  Badge,
  Stack,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import PersonIcon from "@mui/icons-material/Person";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { products, dispatch, selectedCategory, categories } = useProductContext();

  // Select total item count from Redux cart state for cart badge
  const cartCount = useSelector((state: RootState) =>
    state.cart.reduce((sum, item) => sum + item.count, 0)
  );

  // Optionally fetch products via React Query (not needed if ProductContext fetches already)
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  // If productsData is available from React Query, update the context state
  useEffect(() => {
    if (productsData) {
      dispatch({ type: 'SET_PRODUCTS', payload: productsData.data });
    }
  }, [productsData, dispatch]);

  // Filter products by selected category
  const filteredProducts = selectedCategory
    ? products.filter((product: Product) => product.category === selectedCategory)
    : products;

  return (
    <Container maxWidth="lg" sx={{ pt: 6, pb: 6 }}>
      {/* Action buttons (Cart, Clear Filter, Profile) */}
      <Stack
        direction="row"
        justifyContent="center"
        spacing={2}
        mb={3}
        sx={{ width: "100%" }}
      >
        <Button
          color="secondary"
          variant="contained"
          startIcon={
            <Badge badgeContent={cartCount} color="error">
              <ShoppingCartIcon />
            </Badge>
          }
          onClick={() => navigate("/cart")}
          sx={{ fontWeight: 700 }}
        >
          Cart
        </Button>
        <Button
          variant="outlined"
          startIcon={<ClearAllIcon />}
          onClick={() => dispatch({ type: 'SET_SELECTED_CATEGORY', payload: '' })}
        >
          Clear Filter
        </Button>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<PersonIcon />}
          onClick={() => navigate("/profile")}
        >
          Profile
        </Button>
      </Stack>

      {/* Title and category filter dropdown */}
      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        alignItems={{ xs: "flex-start", md: "center" }}
        justifyContent="center"
        mb={4}
        gap={3}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mr: { md: 2 },
            mb: { xs: 2, md: 0 }
          }}
        >
          Featured Products
        </Typography>
        {/* Category dropdown, populated from context */}
        <Select
          value={selectedCategory}
          onChange={e => dispatch({ type: 'SET_SELECTED_CATEGORY', payload: e.target.value })}
          displayEmpty
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">All Categories</MenuItem>
          {categories.map((category: string) => (
            <MenuItem key={category} value={category}>{category}</MenuItem>
          ))}
        </Select>
      </Box>

      {/* Products grid or loading indicator */}
      {isLoading ? (
        <Typography variant="h6" align="center">Loading...</Typography>
      ) : (
        <Grid container spacing={4} justifyContent="center">
          {filteredProducts.map((product: Product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id} display="flex" justifyContent="center">
              {/* Each product rendered as a card */}
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Home;
