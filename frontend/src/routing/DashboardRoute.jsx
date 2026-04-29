import { Navigate } from "react-router-dom";

const DashboardRoute = ({ children }) => {
  const profile = sessionStorage.getItem("profile");

  // If no profile → force onboarding
  if (!profile) {
    return <Navigate to="/questions" replace />;
  }

  return children;
};

export default DashboardRoute;
