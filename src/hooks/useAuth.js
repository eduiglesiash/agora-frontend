
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";


/**
 * It returns the value of the AuthContext object
 * @returns The useContext hook is being used to return the AuthContext.
 */
const useAuth = () => {
  return useContext(AuthContext);
}

export { useAuth }
