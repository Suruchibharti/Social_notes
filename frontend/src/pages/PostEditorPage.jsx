import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createPost, getPost, updatePost } from "../api/posts";
import PostForm from "../components/post/PostForm";
import ErrorMessage from "../components/ui/ErrorMessage";
import Loader from "../components/ui/Loader";
import { useAsync } from "../hooks/useAsync";

export default function PostEditorPage({ editMode = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const postState = useAsync(() => (editMode ? getPost(id) : Promise.resolve({ post: null })), [id, editMode]);

  async function handleSubmit(formData) {
    setSaving(true);
    setError("");
    try {
      const data = editMode ? await updatePost(id, formData) : await createPost(formData);
      navigate(`/posts/${data.post._id}`);
    } catch (err) {
      const message = err.message || "";
      setError(message.toLowerCase().includes("content") ? "" : message);
    } finally {
      setSaving(false);
    }
  }

  if (postState.loading) return <Loader label="Opening editor" />;

  return (
    <section className="page-stack">
      <div className="page-header">
        <div>
          <h1>{editMode ? "Refine your note" : "Write a new note"}</h1>
        </div>
      </div>
      <ErrorMessage message={error || postState.error} />
      <PostForm initialPost={postState.data?.post} onSubmit={handleSubmit} loading={saving} />
    </section>
  );
}
