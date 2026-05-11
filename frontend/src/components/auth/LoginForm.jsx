import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ErrorMessage from "../ui/ErrorMessage";

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  function validate() {
    const nextErrors = {};
    if (!form.email.trim()) nextErrors.email = "Email can not be empty";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = "Enter a valid email";
    if (!form.password.trim()) nextErrors.password = "Password can not be empty";
    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError("");
    try {
      await login(form);
      navigate("/dashboard");
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
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={form.password}
            onChange={(e) => {
              setForm({ ...form, password: e.target.value });
              setFieldErrors({ ...fieldErrors, password: "" });
            }}
          />
          <button className="password-toggle" type="button" onClick={() => setShowPassword((value) => !value)} title="Show password">
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {fieldErrors.password && <small className="field-error-text">{fieldErrors.password}</small>}
      </label>
      <button className="primary-btn full" disabled={loading}>
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
