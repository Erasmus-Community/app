import React, { createContext, useContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link, NavLink, Navigate, useNavigate } from "react-router-dom";
import { api } from "./api";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RegisterOrganization from "./pages/RegisterOrganization";
import Waitlist from "./pages/Waitlist";
import Landing from "./pages/Landing";
import AlumniMap from "./pages/AlumniMap";
import Terms from "./pages/Terms";
import Account from "./pages/Account";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

function Nav() {
  const { me, setMe } = useAuth();
  const navigate = useNavigate();

  const logout = async () => {
    await api.delete("/api/v1/session");
    setMe(null);
    navigate("/login");
  };

  return (
    <nav className="nav">
      <Link to="/" className="brand">Erasmus+ NGO Hub</Link>
      <NavLink to="/app/alumni-map">Alumni map</NavLink>
      <span className="spacer" />
      {me.organization ? (
        <span className="muted">{me.organization.name}</span>
      ) : (
        <NavLink to="/app/register-organization" className="muted">Register your NGO</NavLink>
      )}
      <NavLink to="/app/account">Account</NavLink>
      <a href="#logout" onClick={(e) => { e.preventDefault(); logout(); }}>Log out</a>
    </nav>
  );
}

function PublicNav() {
  return (
    <nav className="nav">
      <Link to="/" className="brand">Erasmus+ NGO Hub</Link>
      <NavLink to="/app/alumni-map">Alumni map</NavLink>
      <span className="spacer" />
      <Link to="/login">Log in</Link>
      <Link to="/register" className="btn" style={{ padding: "6px 16px", fontSize: 14 }}>Sign up</Link>
    </nav>
  );
}

function Protected({ children }) {
  const { me, loading } = useAuth();
  if (loading) return null;
  if (!me) return <Navigate to="/login" replace />;
  if (me.organization && me.organization.status !== "approved" && !me.user.admin) {
    return <Navigate to="/app/waitlist" replace />;
  }
  return (
    <>
      <Nav />
      <main className="container">{children}</main>
    </>
  );
}

export default function App() {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/v1/me")
      .then(setMe)
      .catch(() => setMe(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ me, setMe, loading }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/app" element={<Navigate to="/app/alumni-map" replace />} />
          <Route path="/app/waitlist" element={<Waitlist />} />
          <Route path="/app/account" element={<Protected><Account /></Protected>} />
          <Route path="/app/register-organization" element={<Protected><RegisterOrganization /></Protected>} />
          <Route path="/app/alumni-map" element={
            loading ? null : me ? (
              <Protected><AlumniMap /></Protected>
            ) : (
              <>
                <PublicNav />
                <main className="container"><AlumniMap /></main>
              </>
            )
          } />
          <Route path="*" element={<Navigate to="/app/alumni-map" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}
