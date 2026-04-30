import { Navigate } from "react-router-dom";

const PublicOnlyRoute = ({ children }) => {
  const token = sessionStorage.getItem("token");
  const profile = sessionStorage.getItem("profile");

  if (token) {
    // If user hasn't completed onboarding
    if (!profile) {
      return <Navigate to="/questions" replace />;
    }

    // If fully onboarded
    return <Navigate to="/training-page" replace />;
  }

  return children;
};

export default PublicOnlyRoute;