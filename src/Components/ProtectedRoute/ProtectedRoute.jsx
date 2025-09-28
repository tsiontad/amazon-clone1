import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStateValue } from "../DataProvider/DataProvider";

function ProtectedRoute({ children, msg, redirect }) {
  const navigate = useNavigate();
  const [{ user }, dispatch] = useStateValue(); // Fixed: removed usecontext

  useEffect(() => {
    if (!user) {
      navigate("/auth", {
        state: {
          msg: msg || "Please log in to access this page",
          redirect: redirect || window.location.pathname,
        },
      });
    }
  }, [user, navigate, msg, redirect]); // Fixed: added dependencies

  // Don't render children if user is not authenticated
  if (!user) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
          fontSize: "18px",
        }}
      >
        Redirecting to login...
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;
