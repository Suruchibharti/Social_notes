import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { getUsers } from "../api/users";
import UserCard from "../components/user/UserCard";
import EmptyState from "../components/ui/EmptyState";
import ErrorMessage from "../components/ui/ErrorMessage";
import Loader from "../components/ui/Loader";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getUsers({ search: query, page: 1, limit: 8 });
        setUsers(data.users || []);
        setPage(1);
        setPages(data.pagination?.pages || 1);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  async function loadMore() {
    const nextPage = page + 1;
    setLoadingMore(true);
    setError("");
    try {
      const data = await getUsers({ search: query, page: nextPage, limit: 8 });
      setUsers((current) => [...current, ...(data.users || [])]);
      setPage(nextPage);
      setPages(data.pagination?.pages || nextPage);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <section className="page-stack">
      <div className="page-header">
        <div className="discover-title">
          <h1>Find people</h1>
          <span>Search creators by username or email and follow the voices you like.</span>
        </div>
      </div>
      <div className="search-box">
        <Search size={20} />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by username or email" />
      </div>
      <ErrorMessage message={error} />
      {loading ? <Loader label="Searching users" /> : users.map((user) => <UserCard key={user._id} user={user} />)}
      {!loading && users.length === 0 && <EmptyState title="No users found" text="Try another name or email." />}
      {!loading && page < pages && (
        <button className="secondary-btn load-more-btn" onClick={loadMore} disabled={loadingMore}>
          {loadingMore ? "Loading..." : "Load more people"}
        </button>
      )}
    </section>
  );
}
