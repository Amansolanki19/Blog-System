import { HashRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ConfirmProvider } from './context/ConfirmContext';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import Feed from './pages/Feed';
import Search from './pages/Search';
import BlogDetail from './pages/BlogDetail';
import NewBlog from './pages/NewBlog';
import EditBlog from './pages/EditBlog';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <ConfirmProvider>
          <AuthProvider>
            <HashRouter>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Feed />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/blog/:id" element={<BlogDetail />} />
                  <Route path="/profile/:username" element={<Profile />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />

                  <Route element={<ProtectedRoute />}>
                    <Route path="/new" element={<NewBlog />} />
                    <Route path="/edit/:id" element={<EditBlog />} />
                    <Route path="/me" element={<Settings />} />
                  </Route>

                  <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<Admin />} />
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </HashRouter>
          </AuthProvider>
        </ConfirmProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
