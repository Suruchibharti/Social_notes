import { Heart, MessageCircle, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { deletePost } from "../../api/posts";
import { useAuth } from "../../context/AuthContext";
import { getEngagement, toggleLike } from "../../utils/localEngagement";
import { timeAgo } from "../../utils/format";
import { useState } from "react";
import Avatar from "../ui/Avatar";

export default function PostCard({ post, onDeleted }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [engagement, setEngagement] = useState(() => getEngagement(post._id));
  const [busy, setBusy] = useState(false);
  const isOwner = user?._id === post.author?._id;

  async function handleDelete() {
    if (!confirm("Delete this post?")) return;
    setBusy(true);
    try {
      await deletePost(post._id);
      onDeleted?.(post._id);
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="post-card">
      <div className="post-head">
        <Link to={`/users/${post.author?._id}`} className="author-line">
          <Avatar user={post.author} />
          <span>
            <strong>{post.author?.username || "Unknown"}</strong>
            <small>{timeAgo(post.createdAt)} ago</small>
          </span>
        </Link>
        {isOwner ? (
          <div className="post-menu">
            <button className="icon-btn" onClick={() => navigate(`/posts/${post._id}/edit`)} title="Edit">
              <Pencil size={18} />
            </button>
            <button className="icon-btn danger" onClick={handleDelete} disabled={busy} title="Delete">
              <Trash2 size={18} />
            </button>
          </div>
        ) : (
          <MoreHorizontal size={20} className="muted-icon" />
        )}
      </div>
      <Link to={`/posts/${post._id}`} className="post-link">
        <h2>{post.title}</h2>
        <p>{post.content}</p>
        {post.image && <img className="post-image" src={post.image} alt={post.title} />}
      </Link>
      <div className="post-actions">
        <button className={engagement.liked ? "reaction active" : "reaction"} onClick={() => setEngagement(toggleLike(post._id))}>
          <Heart size={18} fill={engagement.liked ? "currentColor" : "none"} />
          <span>{engagement.likes}</span>
        </button>
        <Link className="reaction" to={`/posts/${post._id}`}>
          <MessageCircle size={18} />
          <span>{engagement.comments.length}</span>
        </Link>
      </div>
    </article>
  );
}
