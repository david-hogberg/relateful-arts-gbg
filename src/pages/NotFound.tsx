import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="page-title">404</h1>
        <p className="page-description">Oops! Page not found</p>
        <a href="/" className="text-primary underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
