import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ProjectDetailPage } from "./pages/ProjectDetailPage";
import { Spinner } from "./components/atoms";

function Protected() {
  const { isAuth, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size={28} />
      </div>
    );
  }
  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
}

function Public() {
  const { isAuth, isLoading } = useAuth();
  if (isLoading) return null;
  return isAuth ? <Navigate to="/dashboard" replace /> : <Outlet />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Public />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>
          <Route element={<Protected />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
