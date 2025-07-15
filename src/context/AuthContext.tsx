import { createContext, useState, useEffect, useContext, type ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "../firebaseConfig";

// Defines the shape of our authentication context.
interface AuthContextType {
  user: User | null;
  setUser: (user: User) => void;
}

// Create the AuthContext with default values.
const AuthContext = createContext<AuthContextType>({
  user: null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setUser: (_user: User) => {}
});


// Provider component wraps the app and supplies auth state to consumers.
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Listen for Firebase auth state changes (login/logout)
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // Set user when logged in
      } else {
        setUser(null); // Set user to null when logged out
      }
    });
    // Cleanup the subscription when component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easier access to AuthContext in components
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
