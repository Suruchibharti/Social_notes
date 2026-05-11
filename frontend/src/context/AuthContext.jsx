import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getCurrentProfile, loginUser } from "../api/auth";
import { tokenStore } from "../api/http";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(tokenStore.get());
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(Boolean(token));

  async function refreshProfile() {
    const data = await getCurrentProfile();
    setUser(data.user);
    return data.user;
  }

  async function login(credentials) {
    const data = await loginUser(credentials);
    setToken(data.token);
    setUser(data.user);
    return data;
  }

  function logout() {
    tokenStore.clear();
    setToken(null);
    setUser(null);
  }

  useEffect(() => {
    let active = true;
    if (!token) {
      setBooting(false);
      return;
    }
    setBooting(true);
    refreshProfile()
      .catch(() => {
        if (active) logout();
      })
      .finally(() => active && setBooting(false));
    return () => {
      active = false;
    };
  }, [token]);

  const value = useMemo(
    () => ({ token, user, setUser, booting, login, logout, refreshProfile }),
    [token, user, booting]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
