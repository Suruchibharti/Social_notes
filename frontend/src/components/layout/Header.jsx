import { Bell, LogOut, PenLine, Search } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../ui/Avatar";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="topbar">
      <Link to="/dashboard" className="brand">
        <span className="brand-mark">S</span>
        <span>SocialBlog</span>
      </Link>
      <nav className="top-actions">
        <NavLink className="icon-btn" to="/discover" title="Discover">
          <Search size={20} />
        </NavLink>
        <button className="icon-btn" title="Notifications">
          <Bell size={20} />
        </button>
        <button className="primary-btn compact" onClick={() => navigate("/compose")}>
          <PenLine size={18} />
          <span>Write</span>
        </button>
        <Link className="profile-chip" to="/profile">
          <Avatar user={user} size="sm" />
          <span>{user?.username}</span>
        </Link>
        <button className="icon-btn" onClick={logout} title="Logout">
          <LogOut size={20} />
        </button>
      </nav>
    </header>
  );
}
