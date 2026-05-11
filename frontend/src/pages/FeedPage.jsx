import { RefreshCw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getFeed } from "../api/posts";
import PostCard from "../components/post/PostCard";
import EmptyState from "../components/ui/EmptyState";
import ErrorMessage from "../components/ui/ErrorMessage";
import Loader from "../components/ui/Loader";

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const sentinelRef = useRef(null);

  const loadFeed = useCallback(async (nextPage = 1, replace = false) => {
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const data = await getFeed({ page: nextPage, limit: 6 });
      setPosts((current) => (replace ? data.posts : [...current, ...data.posts]));
      setPage(nextPage);
      setHasNext(Boolean(data.pagination?.hasNextPage));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    loadFeed(1, true);
  }, []);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasNext) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading) loadFeed(page + 1);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNext, loading, page, loadFeed]);

  return (
    <section className="page-stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">Home Feed</p>
          <h1>Latest notes</h1>
        </div>
        <button className="secondary-btn" onClick={() => loadFeed(1, true)}>
          <RefreshCw size={18} />
          <span>Refresh</span>
        </button>
      </div>
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
      <div ref={sentinelRef} className="feed-sentinel" />
    </section>
  );
}
