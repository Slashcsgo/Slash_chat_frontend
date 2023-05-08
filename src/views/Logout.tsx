import { FunctionComponent, useEffect } from "react";
import { Navigate } from "react-router-dom";

export const Logout: FunctionComponent = () => {
  useEffect(() => {
    window.localStorage.clear()
  }, [])
  return <Navigate to={'/login'} />
}