import { useState, FormEvent } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";

const Login = () => {
  // Local state for form fields and error display
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Handles login form submission
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Handles user logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out!");
    } catch (err: any) {
      // In production, you may want to show user-friendly feedback here
      console.error("Logout error:", err.message);
    }
  };

  return (
    <>
      {/* Basic login form */}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        {/* Error message displayed if login fails */}
        {error && <p>{error}</p>}
      </form>
      {/* Logout button is always rendered (could be conditional in a real app) */}
      <button onClick={handleLogout}>Logout</button>
    </>
  );
};

export default Login;
