import { Camera, Edit3, Grid3X3, X } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { updateCurrentProfile } from "../api/auth";
import { getUserById as fetchUser } from "../api/users";
import FollowButton from "../components/user/FollowButton";
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
  const [postPage, setPostPage] = useState(1);
  const [socialModal, setSocialModal] = useState(null);
  const postsPerPage = 9;
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
  const postCount = posts.length;
  const visiblePosts = posts.slice(0, postPage * postsPerPage);
  const modalUsers = socialModal === "followers" ? profile.followers || [] : profile.following || [];

  function updateProfilePhoto(file) {
    if (file) setForm({ ...form, profilePic: file });
  }

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
    <section className="profile-page">
      <div className="profile-cover">
        <div className="profile-avatar-ring">
          <Avatar user={profile} size="xl" />
        </div>
        <div className="profile-summary">
          <div className="profile-title-row">
            <h1>{profile.username}</h1>
            {mine ? (
              <button className="secondary-btn" onClick={startEdit}>
                <Edit3 size={18} />
                <span>Edit profile</span>
              </button>
            ) : (
              <FollowButton user={profile} onChange={() => state.run().catch(() => {})} />
            )}
          </div>
          <div className="profile-stats">
            <span><strong>{postCount}</strong> posts</span>
            <button type="button" onClick={() => setSocialModal("followers")}>
              <strong>{profile.followers?.length || 0}</strong> followers
            </button>
            <button type="button" onClick={() => setSocialModal("following")}>
              <strong>{profile.following?.length || 0}</strong> following
            </button>
          </div>
          <div className="profile-bio">
            <strong>{profile.username}</strong>
            <p>{mine ? "Your SocialBlog space for ideas, notes, and stories." : `${profile.username}'s public notes and posts.`}</p>
          </div>
        </div>
      </div>

      {editing && (
        <div className="edit-profile-overlay">
          <form className="profile-edit profile-edit-modal" onSubmit={saveProfile}>
            <div className="edit-modal-head">
              <div>
                <p className="eyebrow">Account</p>
                <h2>Edit profile</h2>
              </div>
              <button className="icon-btn" type="button" onClick={() => setEditing(false)} title="Close">
                <X size={18} />
              </button>
            </div>
            <ErrorMessage message={profileError} />
            <div
              className="edit-photo-row"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                updateProfilePhoto(event.dataTransfer.files?.[0]);
              }}
            >
              <Avatar user={{ ...profile, profilePic: form.profilePic ? URL.createObjectURL(form.profilePic) : profile.profilePic }} size="xl" />
              <label className="secondary-btn file-action">
                <Camera size={18} />
                <span>Drop or choose photo</span>
                <input type="file" accept="image/*" onChange={(e) => updateProfilePhoto(e.target.files?.[0])} />
              </label>
            </div>
            <label>
              <span>Username</span>
              <input className="plain-input" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            </label>
            <label>
              <span>Email</span>
              <input className="plain-input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </label>
            <div className="edit-modal-actions">
              <button className="secondary-btn" type="button" onClick={() => setEditing(false)}>Cancel</button>
              <button className="primary-btn" disabled={saving}>{saving ? "Saving..." : "Save changes"}</button>
            </div>
          </form>
        </div>
      )}

      <div className="profile-tabs">
        <span>
          <Grid3X3 size={15} />
          Posts
        </span>
      </div>

      {posts.length > 0 ? (
        <div className="profile-post-grid">
          {visiblePosts.map((post) => (
            <Link className="profile-post-tile" to={`/posts/${post._id}`} key={post._id}>
              {post.image ? (
                <img src={post.image} alt={post.title} />
              ) : (
                <div className="profile-post-text">
                  <strong>{post.title}</strong>
                </div>
              )}
              <div className="profile-post-overlay">
                <strong>{post.title}</strong>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No posts yet</h3>
          <p>{mine ? "Create your first post to fill your profile grid." : "This user has not shared any posts yet."}</p>
        </div>
      )}

      {visiblePosts.length < posts.length && (
        <button className="secondary-btn load-more-btn" onClick={() => setPostPage((page) => page + 1)}>
          Load more posts
        </button>
      )}

      {socialModal && (
        <div className="edit-profile-overlay">
          <div className="social-modal">
            <div className="edit-modal-head">
              <h2>{socialModal === "followers" ? "Followers" : "Following"}</h2>
              <button className="icon-btn" type="button" onClick={() => setSocialModal(null)} title="Close">
                <X size={18} />
              </button>
            </div>
            <div className="social-modal-list">
              {modalUsers.length > 0 ? modalUsers.map((person) => (
                <Link className="social-modal-user" to={`/users/${person._id}`} key={person._id} onClick={() => setSocialModal(null)}>
                  <Avatar user={person} size="sm" />
                  <strong>{person.username}</strong>
                </Link>
              )) : <p className="muted">No users to show.</p>}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
