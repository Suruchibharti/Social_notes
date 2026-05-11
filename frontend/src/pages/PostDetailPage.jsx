import { Heart, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPost } from "../api/posts";
import Avatar from "../components/ui/Avatar";
import ErrorMessage from "../components/ui/ErrorMessage";
import Loader from "../components/ui/Loader";
import { useAuth } from "../context/AuthContext";
import { useAsync } from "../hooks/useAsync";
import { formatDate } from "../utils/format";
import { addComment, getEngagement, toggleLike } from "../utils/localEngagement";

export default function PostDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { data, loading, error } = useAsync(() => getPost(id), [id]);
  const [engagement, setEngagement] = useState(() => getEngagement(id));
  const [comment, setComment] = useState("");

  if (loading) return <Loader label="Loading post" />;
  if (error) return <ErrorMessage message={error} />;
  const post = data.post;

  function submitComment(event) {
    event.preventDefault();
    if (!comment.trim()) return;
    setEngagement(addComment(id, { body: comment.trim(), author: user?.username || "You", avatar: user?.profilePic || "" }));
    setComment("");
  }

  return (
    <article className="detail-wrap">
      <div className="post-detail">
        <Link to={`/users/${post.author?._id}`} className="author-line detail-author">
          <Avatar user={post.author} />
          <span>
            <strong>{post.author?.username}</strong>
            <small>{formatDate(post.createdAt)}</small>
          </span>
        </Link>
        <h1>{post.title}</h1>
        {post.image && <img className="detail-image" src={post.image} alt={post.title} />}
        <p className="detail-content">{post.content}</p>
        <div className="post-actions detail-actions">
          <button className={engagement.liked ? "reaction active" : "reaction"} onClick={() => setEngagement(toggleLike(id))}>
            <Heart size={18} fill={engagement.liked ? "currentColor" : "none"} />
            <span>{engagement.likes} likes</span>
          </button>
          <span className="reaction">
            <MessageCircle size={18} />
            <span>{engagement.comments.length} comments</span>
          </span>
        </div>
      </div>
      <section className="comments-panel">
        <h2>Comments</h2>
        <form className="comment-form" onSubmit={submitComment}>
          <Avatar user={user} size="sm" />
          <input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a thoughtful comment" />
          <button className="icon-btn primary-icon" title="Send">
            <Send size={18} />
          </button>
        </form>
        <div className="comment-list">
          {engagement.comments.map((item) => (
            <div className="comment" key={item.id}>
              <Avatar user={{ username: item.author, profilePic: item.avatar }} size="sm" />
              <span>
                <strong>{item.author}</strong>
                <p>{item.body}</p>
              </span>
            </div>
          ))}
          {engagement.comments.length === 0 && <p className="muted">Be the first to comment.</p>}
        </div>
      </section>
    </article>
  );
}
