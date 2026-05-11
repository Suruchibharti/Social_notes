import { FALLBACK_AVATAR } from "../../config";
import { initials } from "../../utils/format";

export default function Avatar({ user, size = "md" }) {
  const className = `avatar avatar-${size}`;
  if (user?.profilePic) {
    return <img className={className} src={user.profilePic || FALLBACK_AVATAR} alt={user.username || "User"} />;
  }
  return <div className={className}>{initials(user?.username)}</div>;
}
