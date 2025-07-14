import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import type { UserCredential } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

// Material-UI imports
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const Register = () => {
  // Controlled form state for input fields and status
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Handle registration form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Create new user with Firebase Auth
      const userCredential: UserCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Optionally set display name in Firebase Auth profile
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }

      // Save new user document in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email,
        displayName,
        createdAt: new Date(),
      });

      // Redirect to profile page after successful registration
      navigate("/profile");
    } catch (err: any) {
      setError(err.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        {/* Registration header */}
        <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
          <PersonAddIcon color="primary" fontSize="large" />
          <Typography variant="h4" ml={1}>
            Register
          </Typography>
        </Box>
        {/* Registration form */}
        <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
          {/* Error message if registration fails */}
          {error && (
            <Typography color="error" align="center">
              {error}
            </Typography>
          )}
          <TextField
            label="Email"
            variant="outlined"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoFocus
          />
          <TextField
            label="Name"
            variant="outlined"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            required
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {/* Register button with loading indicator */}
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
            size="large"
            sx={{ mt: 1 }}
            fullWidth
          >
            {loading ? <CircularProgress size={26} /> : "Register"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
