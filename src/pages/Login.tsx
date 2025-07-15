import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import styles from "../styles/auth-styles";
import { useNavigate } from "react-router-dom";



const Login = () => {
  // Local state for controlled form fields and status
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Handle login form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Attempt to sign in user with Firebase Auth
      await signInWithEmailAndPassword(auth, email, password);
      // On success, redirect to profile page
      navigate("/profile");
    } catch (err: any) {
      // Show error if authentication fails
      setError(err.message || "Failed to log in");
    } finally {
      setLoading(false); // Always clear loading spinner
    }
  };

  return (
    <div style={styles.form}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        {/* Show error message if present */}
        {error && <p style={styles.error}>{error}</p>}
        <fieldset style={styles.fieldset}>
          <legend style={styles.legend}>Login</legend>
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </fieldset>
        <button
          style={styles.button}
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
