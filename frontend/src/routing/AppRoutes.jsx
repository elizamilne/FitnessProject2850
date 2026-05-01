import { Routes, Route } from "react-router-dom";

// Layout
import PublicLayout from "../common/layout/PublicLayout";

// Public pages
import HomePage from "../features/home/HomePage";
import Login from "../features/auth/Login";
import SignUp from "../features/auth/Signup";

// Auth flow
import Questions from "../features/auth/Questions";

// App pages
import TrainingPage from "../features/training/TrainingPage";
import ActivitiesPage from "../features/activities/ActivitiesPage";
import ChatPage from "../features/chats";

// Guards
import ProtectedRoute from "./ProtectedRoute";
import OnboardingRoute from "./OnboardingRoute";
import DashboardRoute from "./DashboardRoute";
import PublicOnlyRoute from "./PublicOnlyRoute";
import NotFound from "./NotFoundRoute";

const AppRoutes = () => {
  return (
    <Routes>

      {/* Public routes */}
      <Route element={<PublicLayout />}>

        <Route path="/" element={
            <PublicOnlyRoute>
                <HomePage />
            </PublicOnlyRoute>
        } />

        {/* Block if already logged in */}
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <PublicOnlyRoute>
              <SignUp />
            </PublicOnlyRoute>
          }
        />
      </Route>

      {/* Onboarding (questions) */}
      <Route
        path="/questions"
        element={
          <ProtectedRoute>
            <OnboardingRoute>
              <Questions />
            </OnboardingRoute>
          </ProtectedRoute>
        }
      />

      {/* Authenticated app */}
      <Route
        path="/training-page"
        element={
          <ProtectedRoute>
            <DashboardRoute>
              <TrainingPage />
            </DashboardRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/activities-page"
        element={
          <ProtectedRoute>
            <DashboardRoute>
              <ActivitiesPage />
            </DashboardRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/chats"
        element={
          <ProtectedRoute>
            <DashboardRoute>
              <ChatPage />
            </DashboardRoute>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />

    </Routes>
  );
};

export default AppRoutes;