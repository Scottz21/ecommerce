import { useAuth } from "../../context/AuthContext";
import { Link as RouterLink } from "react-router-dom";
import { AppBar, Toolbar, Button, Box } from "@mui/material";

const Navbar = () => {
  const { user } = useAuth(); // Get current user from auth context

  return (
    <AppBar position="static" color="primary" elevation={2}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box>
          {/* Home and Cart links always visible */}
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
            sx={{ fontWeight: "bold", fontSize: "1.2rem", mr: 1, letterSpacing: 2 }}
          >
            Home
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/cart"
            sx={{ fontWeight: 500, fontSize: "1rem", mr: 1 }}
          >
            Cart
          </Button>
          {/* Only show Manage Products if logged in */}
          {user && (
            <Button
              color="inherit"
              component={RouterLink}
              to="/my-products"
              sx={{ fontWeight: 500, fontSize: "1rem", mr: 1 }}
            >
              Manage Products
            </Button>
          )}
        </Box>
        <Box>
          {user ? (
            <>
              {/* Show Profile and Logout when logged in */}
              <Button
                color="inherit"
                component={RouterLink}
                to="/profile"
                sx={{ fontWeight: 500, fontSize: "1rem", mr: 1 }}
              >
                Profile
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/logout"
                sx={{ fontWeight: 500, fontSize: "1rem" }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              {/* Show Register and Login when logged out */}
              <Button
                color="inherit"
                component={RouterLink}
                to="/register"
                sx={{ fontWeight: 500, fontSize: "1rem", mr: 1 }}
              >
                Register
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/login"
                sx={{ fontWeight: 500, fontSize: "1rem" }}
              >
                Login
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
