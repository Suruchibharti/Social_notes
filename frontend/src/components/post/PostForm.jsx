import { ImagePlus, Save } from "lucide-react";
import { useEffect, useState } from "react";
import ErrorMessage from "../ui/ErrorMessage";

export default function PostForm({ initialPost, onSubmit, loading }) {
  const [form, setForm] = useState({ title: "", content: "", image: null, tags: "" });
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialPost) {
      setForm({ title: initialPost.title || "", content: initialPost.content || "", image: null, tags: "" });
      setPreview(initialPost.image || "");
    }
  }, [initialPost]);

  function handleImage(file) {
    setForm({ ...form, image: file });
    setPreview(file ? URL.createObjectURL(file) : initialPost?.image || "");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (form.title.trim().length < 3) {
      setError("Title should be at least 3 characters.");
      return;
    }
    const payload = new FormData();
    payload.append("title", form.title.trim());
    payload.append("content", form.content.trim());
    if (form.image) payload.append("image", form.image);
    await onSubmit(payload);
  }

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <ErrorMessage message={error} />
      <label>
        <span>Title</span>
        <input
          className="plain-input title-input"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="A thoughtful title"
          required
        />
      </label>
      <label>
        <span>Note</span>
        <textarea
          className="plain-input editor"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          placeholder="Write your note..."
          required
        />
      </label>
      <label>
        <span>Tags</span>
        <input
          className="plain-input"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
          placeholder="design, learning, ideas"
        />
      </label>
      {preview && <img className="editor-preview" src={preview} alt="Post preview" />}
      <div className="form-footer">
        <label className="secondary-btn file-action">
          <ImagePlus size={18} />
          <span>Image</span>
          <input type="file" accept="image/*" onChange={(e) => handleImage(e.target.files?.[0])} />
        </label>
        <button className="primary-btn" disabled={loading}>
          <Save size={18} />
          <span>{loading ? "Saving..." : "Publish"}</span>
        </button>
      </div>
    </form>
  );
}
