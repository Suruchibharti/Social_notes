import { Edit3, Mail, UsersRound } from "lucide-react";
import { useParams } from "react-router-dom";
import { updateCurrentProfile } from "../api/auth";
import { getUserById as fetchUser } from "../api/users";
import FollowButton from "../components/user/FollowButton";
import PostCard from "../components/post/PostCard";
import Avatar from "../components/ui/Avatar";
import ErrorMessage from "../components/ui/ErrorMessage";
import Loader from "../components/ui/Loader";
import { useAuth } from "../context/AuthContext";
import { useAsync } from "../hooks/useAsync";
import { useState } from "react";

export default function ProfilePage({ mine = false }) {
  const { id } = useParams();
  const { user: currentUser, refreshProfile, setUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [form, setForm] = useState({ username: "", email: "", profilePic: null });
  const state = useAsync(async () => {
    if (mine) {
      const refreshedUser = await refreshProfile();
      const data = await fetchUser(refreshedUser._id);
      return { ...data, user: refreshedUser };
    }
    return fetchUser(id);
  }, [id, mine]);

  if (state.loading) return <Loader label="Loading profile" />;
  if (state.error) return <ErrorMessage message={state.error} />;

  const profile = mine ? currentUser : state.data.user;
  const posts = state.data.posts || [];

  function startEdit() {
    setForm({ username: profile.username || "", email: profile.email || "", profilePic: null });
    setEditing(true);
  }

  async function saveProfile(event) {
    event.preventDefault();
    setSaving(true);
    setProfileError("");
    const payload = new FormData();
    payload.append("username", form.username);
    payload.append("email", form.email);
    if (form.profilePic) payload.append("profilePic", form.profilePic);
    try {
      const data = await updateCurrentProfile(payload);
      setUser({ ...currentUser, ...data.user });
      setEditing(false);
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="page-stack">
      <div className="profile-hero">
        <Avatar user={profile} size="xl" />
        <div>
          <p className="eyebrow">Profile</p>
          <h1>{profile.username}</h1>
          <p className="profile-email">
            <Mail size={16} />
            {profile.email}
          </p>
          <div className="profile-stats">
            <span><strong>{profile.followers?.length || 0}</strong> followers</span>
            <span><strong>{profile.following?.length || 0}</strong> following</span>
          </div>
        </div>
        <div className="profile-actions">
          {mine ? (
            <button className="secondary-btn" onClick={startEdit}>
              <Edit3 size={18} />
              <span>Edit</span>
            </button>
          ) : (
            <FollowButton user={profile} onChange={() => state.run().catch(() => {})} />
          )}
        </div>
      </div>
      {editing && (
        <form className="profile-edit" onSubmit={saveProfile}>
          <ErrorMessage message={profileError} />
          <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, profilePic: e.target.files?.[0] })} />
          <button className="primary-btn" disabled={saving}>{saving ? "Saving..." : "Save profile"}</button>
        </form>
      )}
      {!mine && (
        <div className="section-title">
          <UsersRound size={20} />
          <h2>{profile.username}'s posts</h2>
        </div>
      )}
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
      {posts.length === 0 && !mine && <div className="empty-state"><h3>No public posts yet</h3></div>}
    </section>
  );
}
