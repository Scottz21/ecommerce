import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Button,
  Stack,
  Divider,
  Grid,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store";
import { removeFromCart, clearCart } from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";
import { useOrderContext } from "../context/OrderContext";

const Cart = () => {
  // Access cart items from Redux store
  const cart = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Custom context for placing orders
  const { placeOrder } = useOrderContext();

  // Calculate total quantity and total price for summary display
  const totalCount = cart.reduce((sum, item) => sum + item.count, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.count * item.price, 0);

  // Handles checkout: places order in Firestore, clears cart, handles errors
  const handleCheckout = async () => {
    if (!cart.length) return;
    try {
      await placeOrder(cart, totalPrice);
      dispatch(clearCart());
      alert("Checkout complete! Your order was placed and your cart has been cleared.");
    } catch (err: any) {
      alert("Failed to place order: " + err.message);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* Cart container with paper background and padding */}
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3 }}>
        {/* Header: cart icon and title */}
        <Stack direction="row" alignItems="center" spacing={2} mb={3}>
          <ShoppingCartCheckoutIcon color="primary" fontSize="large" />
          <Typography variant="h4" fontWeight={700}>
            Shopping Cart
          </Typography>
        </Stack>
        {cart.length === 0 ? (
          // If cart is empty, show message and navigation button
          <Box textAlign="center" py={5}>
            <Typography variant="h6" color="text.secondary" mb={2}>
              Your cart is empty.
            </Typography>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/")}
              variant="contained"
              color="primary"
            >
              Continue Shopping
            </Button>
          </Box>
        ) : (
          <>
            {/* Product list as responsive grid of cards */}
            <Grid container spacing={3} mb={2}>
              {cart.map((item) => (
                <Grid item xs={12} sm={6} key={item.id}>
                  <Card sx={{ display: "flex", alignItems: "center", p: 1, borderRadius: 2 }}>
                    {/* Product image thumbnail */}
                    <CardMedia
                      component="img"
                      image={item.image}
                      alt={item.title}
                      sx={{
                        width: 70,
                        height: 70,
                        objectFit: "contain",
                        borderRadius: 2,
                        mr: 2,
                        bgcolor: "#f9f9f9",
                      }}
                    />
                    {/* Product title, price, count */}
                    <CardContent sx={{ flex: 1, p: 1 }}>
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Price: <b>${item.price}</b>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Count: <b>{item.count}</b>
                      </Typography>
                    </CardContent>
                    {/* Remove item button */}
                    <IconButton
                      color="error"
                      onClick={() => dispatch(removeFromCart(item.id))}
                      aria-label="remove item"
                      size="large"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Card>
                </Grid>
              ))}
            </Grid>
            {/* Divider separates items from summary and actions */}
            <Divider sx={{ my: 3 }} />
            {/* Cart totals and action buttons */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems="center"
              spacing={3}
            >
              <Box>
                <Typography variant="subtitle1">
                  <b>Total items:</b> {totalCount}
                </Typography>
                <Typography variant="subtitle1">
                  <b>Total price:</b>{" "}
                  <span style={{ color: "#1976d2", fontWeight: 700 }}>${totalPrice.toFixed(2)}</span>
                </Typography>
              </Box>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                {/* Checkout action */}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCheckout}
                  disabled={!cart.length}
                >
                  Checkout
                </Button>
                {/* Return to shopping action */}
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate("/")}
                  startIcon={<ArrowBackIcon />}
                >
                  Continue Shopping
                </Button>
              </Stack>
            </Stack>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default Cart;
