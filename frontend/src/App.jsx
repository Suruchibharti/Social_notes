import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout.jsx";
import ProtectedRoute from "./components/layout/ProtectedRoute.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import FeedPage from "./pages/FeedPage.jsx";
import PostEditorPage from "./pages/PostEditorPage.jsx";
import PostDetailPage from "./pages/PostDetailPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import SocialListPage from "./pages/SocialListPage.jsx";
import { useAuth } from "./context/AuthContext.jsx";

export default function App() {
  const { token } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={token ? <Navigate to="/" replace /> : <AuthPage mode="login" />} />
      <Route path="/register" element={token ? <Navigate to="/" replace /> : <AuthPage mode="register" />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<FeedPage />} />
        <Route path="compose" element={<PostEditorPage />} />
        <Route path="posts/:id" element={<PostDetailPage />} />
        <Route path="posts/:id/edit" element={<PostEditorPage editMode />} />
        <Route path="profile" element={<ProfilePage mine />} />
        <Route path="users/:id" element={<ProfilePage />} />
        <Route path="discover" element={<SearchPage />} />
        <Route path="following" element={<SocialListPage type="following" />} />
        <Route path="followers/:id" element={<SocialListPage type="followers" />} />
      </Route>
      <Route path="*" element={<Navigate to={token ? "/" : "/login"} replace />} />
    </Routes>
  );
}
