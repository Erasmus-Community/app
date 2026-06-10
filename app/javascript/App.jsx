import React, { createContext, useContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link, NavLink, Navigate, useNavigate } from "react-router-dom";
import { api } from "./api";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Waitlist from "./pages/Waitlist";
import Directory from "./pages/Directory";
import Connections from "./pages/Connections";
import VacancyBoard from "./pages/VacancyBoard";
import VacancyDetail from "./pages/VacancyDetail";
import Projects from "./pages/Projects";
import ProjectWorkspace from "./pages/ProjectWorkspace";
import OrgProfile from "./pages/OrgProfile";
import Admin from "./pages/Admin";
import PublicVacancy from "./pages/PublicVacancy";
import Landing from "./pages/Landing";

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
      <NavLink to="/app/directory">Partners</NavLink>
      <NavLink to="/app/connections">Network</NavLink>
      <NavLink to="/app/vacancies">Vacancy board</NavLink>
      <NavLink to="/app/projects">My projects</NavLink>
      {me.user.admin && <NavLink to="/app/admin">Admin</NavLink>}
      <span className="spacer" />
      <NavLink to="/app/profile">{me.organization.name}</NavLink>
      <a href="#logout" onClick={(e) => { e.preventDefault(); logout(); }}>Log out</a>
    </nav>
  );
}

function Protected({ children }) {
  const { me, loading } = useAuth();
  if (loading) return null;
  if (!me) return <Navigate to="/login" replace />;
  if (me.organization.status !== "approved" && !me.user.admin) return <Navigate to="/app/waitlist" replace />;
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
          <Route path="/app" element={<Navigate to="/app/directory" replace />} />
          <Route path="/app/waitlist" element={<Waitlist />} />
          <Route path="/v/:token" element={<PublicVacancy />} />
          <Route path="/app/directory" element={<Protected><Directory /></Protected>} />
          <Route path="/app/connections" element={<Protected><Connections /></Protected>} />
          <Route path="/app/vacancies" element={<Protected><VacancyBoard /></Protected>} />
          <Route path="/app/vacancies/:id" element={<Protected><VacancyDetail /></Protected>} />
          <Route path="/app/projects" element={<Protected><Projects /></Protected>} />
          <Route path="/app/projects/:id" element={<Protected><ProjectWorkspace /></Protected>} />
          <Route path="/app/profile" element={<Protected><OrgProfile /></Protected>} />
          <Route path="/app/admin" element={<Protected><Admin /></Protected>} />
          <Route path="*" element={<Navigate to="/app/directory" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}
