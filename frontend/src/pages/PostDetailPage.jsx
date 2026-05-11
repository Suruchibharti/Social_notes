import { Link, useParams } from "react-router-dom";
import { getPost } from "../api/posts";
import Avatar from "../components/ui/Avatar";
import ErrorMessage from "../components/ui/ErrorMessage";
import Loader from "../components/ui/Loader";
import { useAsync } from "../hooks/useAsync";
import { formatDate } from "../utils/format";

export default function PostDetailPage() {
  const { id } = useParams();
  const { data, loading, error } = useAsync(() => getPost(id), [id]);

  if (loading) return <Loader label="Loading post" />;
  if (error) return <ErrorMessage message={error} />;
  const post = data.post;

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
        {post.content?.trim() && <p className="detail-content">{post.content}</p>}
      </div>
    </article>
  );
}
