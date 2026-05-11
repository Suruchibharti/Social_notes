import { Search } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

export default function Header() {
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
      </nav>
    </header>
  );
}
