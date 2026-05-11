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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getUsers({ search: query, page: 1, limit: 20 });
        setUsers(data.users || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
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
    </section>
  );
}
