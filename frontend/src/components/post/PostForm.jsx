import { ImagePlus, Save } from "lucide-react";
import { useEffect, useState } from "react";
import ErrorMessage from "../ui/ErrorMessage";

export default function PostForm({ initialPost, onSubmit, loading }) {
  const [form, setForm] = useState({ title: "", content: "", image: null });
  const [preview, setPreview] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (initialPost) {
      setForm({ title: initialPost.title || "", content: initialPost.content || "", image: null });
      setPreview(initialPost.image || "");
    }
  }, [initialPost]);

  function handleImage(file) {
    setForm({ ...form, image: file });
    setFieldErrors({ ...fieldErrors, image: "" });
    setPreview(file ? URL.createObjectURL(file) : initialPost?.image || "");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = "Title is required";
    if (!initialPost && !form.image) nextErrors.image = "Image is required";
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      return;
    }
    const payload = new FormData();
    payload.append("title", form.title.trim());
    payload.append("content", form.content.trim() || " ");
    if (form.image) payload.append("image", form.image);
    await onSubmit(payload);
  }

  return (
    <form className="post-form" onSubmit={handleSubmit} noValidate>
      <label>
        <span>Title <b className="required-star">*</b></span>
        <input
          className={fieldErrors.title ? "plain-input title-input input-error" : "plain-input title-input"}
          value={form.title}
          onChange={(e) => {
            setForm({ ...form, title: e.target.value });
            setFieldErrors({ ...fieldErrors, title: "" });
          }}
          placeholder="Enter post title"
        />
        {fieldErrors.title && <small className="field-error-text">{fieldErrors.title}</small>}
      </label>
      <label>
        <span>Note</span>
        <textarea
          className="plain-input editor"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          placeholder="Write your note optional"
        />
      </label>
      {preview && <img className="editor-preview" src={preview} alt="Post preview" />}
      <div className="form-footer">
        <div>
        <label className={fieldErrors.image ? "secondary-btn file-action input-error" : "secondary-btn file-action"}>
          <ImagePlus size={18} />
          <span>Image</span>
          <input type="file" accept="image/*" onChange={(e) => handleImage(e.target.files?.[0])} />
        </label>
        {fieldErrors.image && <small className="field-error-text image-error-text">{fieldErrors.image}</small>}
        </div>
        <button className="primary-btn" disabled={loading}>
          <Save size={18} />
          <span>{loading ? "Saving..." : "Publish"}</span>
        </button>
      </div>
    </form>
  );
}
