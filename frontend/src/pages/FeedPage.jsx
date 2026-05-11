import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFeed } from "../api/posts";
import PostCard from "../components/post/PostCard";
import EmptyState from "../components/ui/EmptyState";
import ErrorMessage from "../components/ui/ErrorMessage";
import Loader from "../components/ui/Loader";

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadFeed = useCallback(async (nextPage = 1) => {
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const data = await getFeed({ page: nextPage, limit: 3 });
      setPosts(data.posts || []);
      setPage(nextPage);
      setPages(data.pagination?.pages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    loadFeed(1);
  }, []);

  return (
    <section className="page-stack">
      <ErrorMessage message={error} />
      {posts.map((post) => (
        <PostCard key={post._id} post={post} onDeleted={(id) => setPosts(posts.filter((item) => item._id !== id))} />
      ))}
      {!loading && posts.length === 0 && (
        <EmptyState
          title="No notes yet"
          text="Follow people or publish your first note to start shaping your feed."
          action={<Link className="primary-btn" to="/compose">Write a note</Link>}
        />
      )}
      {loading && <Loader label="Loading notes" />}
      {!loading && posts.length > 0 && (
        <div className="pagination-controls">
          <button className="secondary-btn" disabled={page === 1} onClick={() => loadFeed(page - 1)}>
            Previous
          </button>
          <span>{page} / {pages}</span>
          <button className="secondary-btn" disabled={page === pages} onClick={() => loadFeed(page + 1)}>
            Next
          </button>
        </div>
      )}
    </section>
  );
}
