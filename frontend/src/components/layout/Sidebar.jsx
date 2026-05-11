import { Compass, Home, LogOut, PenLine, UserRound, UsersRound } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../ui/Avatar";

const links = [
  { to: "/dashboard", label: "Feed", icon: Home },
  { to: "/compose", label: "Create", icon: PenLine },
  { to: "/discover", label: "Discover", icon: Compass },
  { to: "/following", label: "Following", icon: UsersRound },
  { to: "/profile", label: "Profile", icon: UserRound }
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-card">
        <div className="side-links">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className="side-link">
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
        <div className="sidebar-bottom">
          <Link className="sidebar-profile" to="/profile">
            <Avatar user={user} size="sm" />
            <span>{user?.username}</span>
          </Link>
          <button className="side-link logout-link" onClick={logout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
