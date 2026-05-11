import { Link } from "react-router-dom";
import { Check, SquareCheckBig } from "lucide-react";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";

export default function AuthPage({ mode }) {
  const isLogin = mode === "login";
  return (
    <main className="auth-page">
      <section className="auth-intro">
        <div className="brand auth-brand">
          <span className="brand-mark">
            <SquareCheckBig size={22} />
          </span>
          <span>SocialBlog</span>
        </div>

        {isLogin ? (
          <div className="auth-copy">
            <h2>"Share ideas, follow voices, and stay inspired."</h2>
            <p>Create posts, discover people, and keep your favorite notes in one clean social feed.</p>
          </div>
        ) : (
          <div className="auth-benefits">
            <div>
              <span><Check size={14} /></span>
              <p><strong>Create notes instantly</strong>Publish thoughts, images, and stories from your personal space.</p>
            </div>
            <div>
              <span><Check size={14} /></span>
              <p><strong>Follow your circle</strong>See posts from people you follow in a personalized feed.</p>
            </div>
            <div>
              <span><Check size={14} /></span>
              <p><strong>Like and comment</strong>React to ideas and keep conversations moving.</p>
            </div>
          </div>
        )}

        <p className="auth-footer">© 2026 SocialBlog. Built for modern creators.</p>
      </section>
      <section className="auth-panel">
        <h1>{isLogin ? "Sign in" : "Create account"}</h1>
        <p>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <Link to={isLogin ? "/register" : "/login"}>{isLogin ? "Create one" : "Sign in"}</Link>
        </p>
        {isLogin ? <LoginForm /> : <RegisterForm />}
      </section>
    </main>
  );
}
