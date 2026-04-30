import { Navigate } from "react-router-dom";

const OnboardingRoute = ({ children }) => {
  const profile = sessionStorage.getItem("profile");

  // If profile exists → user already onboarded
  if (profile) {
    return <Navigate to="/training-page" replace />;
  }

  return children;
};

export default OnboardingRoute;