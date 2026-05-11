import { UserCheck, UserPlus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { followUser, unfollowUser } from "../../api/users";
import { useAuth } from "../../context/AuthContext";

function getUserId(value) {
  if (!value) return "";
  if (typeof value === "object") return String(value._id || value.id || "");
  return String(value);
}

export default function FollowButton({ user, onChange, forceFollowing = false }) {
  const { user: currentUser, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const authIsFollowing = useMemo(() => {
    const targetId = getUserId(user);
    return currentUser?.following?.some((item) => getUserId(item) === targetId);
  }, [currentUser?.following, user?._id]);
  const [isFollowing, setIsFollowing] = useState(() => forceFollowing || authIsFollowing);

  useEffect(() => {
    setIsFollowing(forceFollowing || Boolean(authIsFollowing));
  }, [forceFollowing, authIsFollowing]);

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
      <span>{isFollowing ? "Unfollow" : "Follow"}</span>
    </button>
  );
}
