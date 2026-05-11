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
  const [error, setError] = useState("");

  async function fetchUsers(nextPage = 1) {
    setLoading(true);
    setError("");
    try {
      const data = await getUsers({ search: query, page: nextPage, limit: 8 });
      setUsers(data.users || []);
      setPage(nextPage);
      setPages(data.pagination?.pages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(async () => {
      fetchUsers(1);
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

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
      {!loading && users.length > 0 && (
        <div className="pagination-controls">
          <button className="secondary-btn" disabled={page === 1} onClick={() => fetchUsers(page - 1)}>
            Previous
          </button>
          <span>{page} / {pages}</span>
          <button className="secondary-btn" disabled={page === pages} onClick={() => fetchUsers(page + 1)}>
            Next
          </button>
        </div>
      )}
    </section>
  );
}
