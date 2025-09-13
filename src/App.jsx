import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Login from './components/AuthPages/Login/Login';
import Register from './components/AuthPages/Register/Register';
import AuthLayout from './components/AuthPages/AuthLayout';
import MainLayout from './components/MainPages/MainLayout';
import Home from './components/MainPages/Home/Home';


function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token"); 
  if (!token) {
    return <Navigate to="/login" replace />; 
  }
  return children; 
}

function App() {
  const route = createBrowserRouter([
    {
      path: "",
      element: <AuthLayout />,
      children: [
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
        { path: "/", element: <Navigate to="/login" replace /> }, 
      ],
    },
    {
      path: "",
      element: <ProtectedRoute><MainLayout /></ProtectedRoute>,
      children: [
        { path: "home", element: <Home /> },
      ],
    },
  ]);

  return <RouterProvider router={route} />;
  
}

export default App;
