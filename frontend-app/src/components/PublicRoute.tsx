import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PublicRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {

  const auth = useAuth();
  
  if(auth.user.id != null){
    return <Navigate to="/user/profile" />
  }
  else return children;
};

export default PublicRoute;