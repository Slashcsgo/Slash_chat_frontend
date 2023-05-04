import { FunctionComponent } from "react";
import { Navigate } from "react-router-dom";

export const Logout: FunctionComponent = () => {
  window.localStorage.clear()
  return <Navigate to={'/login'} />
}