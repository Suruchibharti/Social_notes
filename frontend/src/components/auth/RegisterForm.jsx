import { Camera, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../api/auth";
import ErrorMessage from "../ui/ErrorMessage";

export default function RegisterForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", profilePic: null });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const nextErrors = {};
    if (!form.username.trim()) nextErrors.username = "Full name can not be empty";
    if (!form.email.trim()) nextErrors.email = "Email can not be empty";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = "Enter a valid email";
    if (!form.password.trim()) nextErrors.password = "Password can not be empty";
    else if (form.password.length < 6) nextErrors.password = "Password must be at least 6 characters";
    else if (!/[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]`~;]/.test(form.password)) {
      nextErrors.password = "Password must include 1 special character";
    }
    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError("");
    try {
      const payload = new FormData();
      payload.append("username", form.username);
      payload.append("email", form.email);
      payload.append("password", form.password);
      if (form.profilePic) payload.append("profilePic", form.profilePic);
      await registerUser(payload);
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <ErrorMessage message={error} />
      <label>
        <span>Full Name</span>
        <div className={fieldErrors.username || error ? "field field-error" : "field"}>
          <User size={18} />
          <input
            placeholder="Enter your full name"
            value={form.username}
            onChange={(e) => {
              setForm({ ...form, username: e.target.value });
              setFieldErrors({ ...fieldErrors, username: "" });
            }}
          />
        </div>
        {fieldErrors.username && <small className="field-error-text">{fieldErrors.username}</small>}
      </label>
      <label>
        <span>Email</span>
        <div className={fieldErrors.email || error ? "field field-error" : "field"}>
          <Mail size={18} />
          <input
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={(e) => {
              setForm({ ...form, email: e.target.value });
              setFieldErrors({ ...fieldErrors, email: "" });
            }}
          />
        </div>
        {fieldErrors.email && <small className="field-error-text">{fieldErrors.email}</small>}
      </label>
      <label>
        <span>Password</span>
        <div className={fieldErrors.password || error ? "field field-error" : "field"}>
          <Lock size={18} />
          <input
            type="password"
            placeholder="Create a strong password"
            value={form.password}
            onChange={(e) => {
              setForm({ ...form, password: e.target.value });
              setFieldErrors({ ...fieldErrors, password: "" });
            }}
          />
        </div>
        {fieldErrors.password && <small className="field-error-text">{fieldErrors.password}</small>}
      </label>
      <label>
        <span>Profile picture</span>
        <div className="file-field">
          <Camera size={18} />
          <span>{form.profilePic?.name || "Choose image"}</span>
          <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, profilePic: e.target.files?.[0] })} />
        </div>
      </label>
      <button className="primary-btn full" disabled={loading}>
        {loading ? "Creating..." : "Create account"}
      </button>
      <p className="auth-hint">By registering, you can start sharing posts and following creators.</p>
    </form>
  );
}
