import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig"; 

const Logout = () => {
  useEffect(() => {
    // Signs out the user as soon as this component is mounted
    signOut(auth);
    // Optionally: You may want to redirect the user to login or home page after sign out
    // Example: navigate("/");
  }, []);

  return (
    <div>Logout</div> // Placeholder: can replace with spinner or redirect logic
  );
};

export default Logout;
