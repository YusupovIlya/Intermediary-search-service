import React from "react";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import history from '../hooks/history';
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute: React.FC<{ children: JSX.Element}> = ({ children }) => {

  const auth = useAuth();
  const { t } = useTranslation('toast_messages');
  
  if(auth.user.id == null){
    toast.error(t("unAuthMessage"));
    return <Navigate to={`/auth/login/?returnUrl=${history.location.pathname}`} />
  }
  if(auth.user.role == "User" && history.location.pathname == "/admin/users")
    return <Navigate to="/notfound" />
  else return children;
};

export default ProtectedRoute;