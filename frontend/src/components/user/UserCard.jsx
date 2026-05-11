import { Link } from "react-router-dom";
import Avatar from "../ui/Avatar";
import FollowButton from "./FollowButton";

export default function UserCard({ user, onFollowChange, forceFollowing = false }) {
  return (
    <div className="user-card">
      <Link to={`/users/${user._id}`} className="user-card-main">
        <Avatar user={user} />
        <span>
          <strong>{user.username}</strong>
        </span>
      </Link>
      <FollowButton user={user} onChange={onFollowChange} forceFollowing={forceFollowing} />
    </div>
  );
}
