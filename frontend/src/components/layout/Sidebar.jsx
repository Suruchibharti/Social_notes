import { Compass, Home, PenLine, UserRound, UsersRound } from "lucide-react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "Feed", icon: Home },
  { to: "/compose", label: "Create", icon: PenLine },
  { to: "/discover", label: "Discover", icon: Compass },
  { to: "/following", label: "Following", icon: UsersRound },
  { to: "/profile", label: "Profile", icon: UserRound }
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-card">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className="side-link">
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
}
