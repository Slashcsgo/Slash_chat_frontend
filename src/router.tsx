import { createBrowserRouter, RouteObject } from "react-router-dom";
import { AuthMiddleware } from "./helpers/AuthHelper";
import Login from "./views/Login";
import { Logout } from "./views/Logout";
import Messages from "./views/Messages";
import Register from "./views/Register";

const routes: RouteObject[] = [
  {
    path: '/',
    element: <AuthMiddleware>
      <Messages />
    </AuthMiddleware>
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/logout',
    element: <Logout />
  }
]

export const router = createBrowserRouter(routes)