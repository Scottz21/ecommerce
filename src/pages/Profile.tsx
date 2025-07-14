import { useState, useEffect } from "react";
import { updateProfile, deleteUser } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useProductContext } from '../context/ProductContext';
import { useOrderContext } from '../context/OrderContext';
import type { Product } from '../types/types';
import { useNavigate } from "react-router-dom";

// Material-UI
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

const Profile: React.FC = () => {
  const user = auth.currentUser;
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const { products } = useProductContext();
  const { orders } = useOrderContext();
  const navigate = useNavigate();

  // On mount, fetch additional user data from Firestore (if available)
  useEffect(() => {
    const fetchUserDoc = async () => {
      if (!user) return;
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setDisplayName(data.displayName || "");
          setEmail(data.email || user.email || "");
        }
      } catch (err) {
        setError("Failed to fetch user profile.");
      }
    };
    fetchUserDoc();
  }, [user]);

  // Handles profile update (display name only, email is read-only)
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (auth.currentUser && displayName) {
        await updateProfile(auth.currentUser, { displayName });
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, { displayName });
        setSuccess("Profile updated!");
      }
    } catch (err: any) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  // Handles user account deletion (both Firestore user doc and auth)
  const handleDeleteAccount = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (auth.currentUser) {
        await deleteDoc(doc(db, "users", auth.currentUser.uid));
        await deleteUser(auth.currentUser);
        setSuccess("Account deleted. Goodbye!");
        // Redirect to register after a short delay
        setTimeout(() => {
          navigate("/register");
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete account.");
    } finally {
      setLoading(false);
    }
  };

  // Only products belonging to this user
  const myProducts = products.filter(
    (product: Product) => product.userId === user?.uid
  );

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        {/* Profile header */}
        <Box display="flex" alignItems="center" mb={2}>
          <PersonIcon color="primary" fontSize="large" />
          <Typography variant="h4" ml={1}>
            Profile
          </Typography>
        </Box>
        {/* Profile form */}
        <Box component="form" onSubmit={handleUpdateProfile} display="flex" flexDirection="column" gap={2}>
          {error && (
            <Typography color="error" align="center">
              {error}
            </Typography>
          )}
          {success && (
            <Typography color="success.main" align="center">
              {success}
            </Typography>
          )}
          <TextField
            label="Name"
            variant="outlined"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            required
          />
          <TextField
            label="Email"
            variant="outlined"
            value={email}
            disabled // Email change is not supported in this UI
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
            size="large"
            sx={{ mt: 1 }}
            fullWidth
          >
            {loading ? <CircularProgress size={26} /> : "Update Profile"}
          </Button>
        </Box>
        {/* Delete account button */}
        <Button
          variant="contained"
          color="error"
          type="button"
          onClick={handleDeleteAccount}
          disabled={loading}
          sx={{ mt: 2 }}
          fullWidth
        >
          {loading ? <CircularProgress size={26} /> : "Delete Account"}
        </Button>
        {/* User's products */}
        <Divider sx={{ my: 4 }} />
        <Typography variant="h6" mb={2}>
          Your Products
        </Typography>
        {myProducts.length > 0 ? (
          myProducts.map((product: Product) => (
            <Paper key={product.id} sx={{ mb: 2, p: 2 }}>
              <Typography variant="subtitle1">{product.title}</Typography>
            </Paper>
          ))
        ) : (
          <Typography color="text.secondary">No products found.</Typography>
        )}

        {/* Order history for user */}
        <Divider sx={{ my: 4 }} />
        <Typography variant="h6" mb={2}>
          Order History
        </Typography>
        {orders.length === 0 ? (
          <Typography color="text.secondary">No orders found.</Typography>
        ) : (
          orders.map(order => (
            <Paper key={order.id} sx={{ mb: 2, p: 2 }}>
              <Typography variant="subtitle1">
                Order #{order.id}
              </Typography>
              <Typography variant="body2">
                Date: {new Date(order.createdAt).toLocaleString()}
              </Typography>
              <Typography variant="body2">
                Total: ${order.total}
              </Typography>
              <Box mt={1}>
                {order.products.map((p, idx) => (
                  <Typography key={idx} variant="body2">
                    {p.title} (${p.price})
                  </Typography>
                ))}
              </Box>
            </Paper>
          ))
        )}
      </Paper>
    </Container>
  );
};

export default Profile;
