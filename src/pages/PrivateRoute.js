import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { config } from "../config/config";
import { useAuth } from "../hooks/useAuth";

const PrivateRoute = ({ children }) => {
  let auth = useAuth();
  let location = useLocation();
  const user = JSON.parse(sessionStorage.getItem('agora-user'))


  
  if (!auth.user && !user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    console.log('Entra en el redirecrt')
    return <Navigate to={config.paths.login} state={{ from: location }} replace />;
  }

  return children;
}

export default PrivateRoute
