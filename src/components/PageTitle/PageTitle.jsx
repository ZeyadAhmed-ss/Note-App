import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function PageTitle() {
  const location = useLocation();

  useEffect(() => {
    
    const titles = {
      "/login": "Login",
      "/register": "Register",
      "/home": "Home",
    };

    const title = titles[location.pathname] || "My App";
    document.title = title;
  }, [location.pathname]); 
}
