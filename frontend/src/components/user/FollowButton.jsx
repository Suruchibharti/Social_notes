import { UserCheck, UserPlus } from "lucide-react";
import { useState } from "react";
import { followUser, unfollowUser } from "../../api/users";
import { useAuth } from "../../context/AuthContext";

export default function FollowButton({ user, onChange }) {
  const { user: currentUser, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(() => currentUser?.following?.includes(user?._id));

  if (!user || currentUser?._id === user._id) return null;

  async function toggle() {
    setLoading(true);
    const next = !isFollowing;
    setIsFollowing(next);
    try {
      if (next) await followUser(user._id);
      else await unfollowUser(user._id);
      await refreshProfile();
      onChange?.(next);
    } catch {
      setIsFollowing(!next);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button className={isFollowing ? "secondary-btn" : "primary-btn"} onClick={toggle} disabled={loading}>
      {isFollowing ? <UserCheck size={18} /> : <UserPlus size={18} />}
      <span>{isFollowing ? "Following" : "Follow"}</span>
    </button>
  );
}
