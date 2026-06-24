import React, { createContext, useContext, useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  NavLink,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { apiClient } from "./shared/api/client";
import type { MeResponse, AuthContextValue } from "./features/auth/types";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import Waitlist from "./features/auth/Waitlist";
import Landing from "./features/auth/Landing";
import Terms from "./features/auth/Terms";
import Account from "./features/profile/Account";
import RegisterOrganization from "./features/organization/RegisterOrganization";
import OrgProfile from "./features/organization/OrgProfile";
import AlumniMap from "./features/map/AlumniMap";

const AuthContext = createContext<AuthContextValue>({
  me: null,
  setMe: () => {},
  loading: true,
});
export const useAuth = () => useContext(AuthContext);

const MAP_ROUTE = "/app/alumni-map";

function NavToggleButton({
  visible,
  onToggle,
}: {
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      aria-label={visible ? "Hide navigation" : "Show navigation"}
      className="fixed top-3 right-3 z-50 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-0 bg-white/90 shadow-md backdrop-blur-sm transition-all hover:bg-white"
      title={visible ? "Hide navigation" : "Show navigation"}
    >
      {visible ? (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1l12 12M13 1L1 13" stroke="#1f4e9c" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ) : (
        <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1h14M1 7h14M1 13h14" stroke="#1f4e9c" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
    </button>
  );
}

function Nav({ visible, onToggle }: { visible: boolean; onToggle: () => void }) {
  const { me, setMe } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMap = location.pathname === MAP_ROUTE;

  const logout = async () => {
    await apiClient.delete("/api/v1/session");
    setMe(null);
    navigate("/login");
  };

  return (
    <>
      {isMap && <NavToggleButton visible={visible} onToggle={onToggle} />}
      {visible && (
        <nav className="nav">
          <Link to="/" className="brand">Erasmus+ NGO Hub</Link>
          <NavLink to="/app/alumni-map">Alumni map</NavLink>
          <span className="spacer" />
          {me?.organization ? (
            me.user.org_role === "org_admin" ? (
              <NavLink to={`/app/organizations/${me.organization.id}`} className="muted">
                {me.organization.name}
              </NavLink>
            ) : (
              <span className="muted">{me.organization.name}</span>
            )
          ) : (
            <NavLink to="/app/register-organization" className="muted">
              Register your NGO
            </NavLink>
          )}
          <NavLink to="/app/account">Account</NavLink>
          <a href="#logout" onClick={(e) => { e.preventDefault(); logout(); }}>
            Log out
          </a>
          {isMap && (
            <button
              onClick={onToggle}
              className="ml-2 cursor-pointer border-0 bg-transparent p-0 text-white/70 hover:text-white"
              aria-label="Hide navigation"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </nav>
      )}
    </>
  );
}

function PublicNav({ visible, onToggle }: { visible: boolean; onToggle: () => void }) {
  const location = useLocation();
  const isMap = location.pathname === MAP_ROUTE;

  return (
    <>
      {isMap && <NavToggleButton visible={visible} onToggle={onToggle} />}
      {visible && (
        <nav className="nav">
          <Link to="/" className="brand">Erasmus+ NGO Hub</Link>
          <NavLink to="/app/alumni-map">Alumni map</NavLink>
          <span className="spacer" />
          <Link to="/login">Log in</Link>
          <Link to="/register" className="btn px-4 py-1.5 text-sm">Sign up</Link>
          {isMap && (
            <button
              onClick={onToggle}
              className="ml-2 cursor-pointer border-0 bg-transparent p-0 text-white/70 hover:text-white"
              aria-label="Hide navigation"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </nav>
      )}
    </>
  );
}

function Protected({
  children,
  navVisible,
  onNavToggle,
}: {
  children: React.ReactNode;
  navVisible: boolean;
  onNavToggle: () => void;
}) {
  const { me, loading } = useAuth();
  const location = useLocation();
  const isMap = location.pathname === MAP_ROUTE;

  if (loading) return null;
  if (!me) return <Navigate to="/login" replace />;
  if (
    me.organization &&
    me.organization.status !== "approved" &&
    !me.user.admin
  ) {
    return <Navigate to="/app/waitlist" replace />;
  }
  return (
    <>
      <Nav visible={navVisible} onToggle={onNavToggle} />
      <main className={isMap ? "" : undefined}>{children}</main>
    </>
  );
}

function AppRoutes() {
  const { me, loading } = useAuth();
  const location = useLocation();
  const isMap = location.pathname === MAP_ROUTE;

  const [navVisible, setNavVisible] = useState(!isMap);
  useEffect(() => { setNavVisible(!isMap); }, [isMap]);
  const toggleNav = () => setNavVisible((v) => !v);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/app" element={<Navigate to="/app/alumni-map" replace />} />
      <Route path="/app/waitlist" element={<Waitlist />} />
      <Route
        path="/app/account"
        element={
          <Protected navVisible={navVisible} onNavToggle={toggleNav}>
            <Account />
          </Protected>
        }
      />
      <Route
        path="/app/register-organization"
        element={
          <Protected navVisible={navVisible} onNavToggle={toggleNav}>
            <RegisterOrganization />
          </Protected>
        }
      />
      <Route
        path="/app/organizations/:id"
        element={
          <Protected navVisible={navVisible} onNavToggle={toggleNav}>
            <OrgProfile />
          </Protected>
        }
      />
      <Route
        path="/app/alumni-map"
        element={
          loading ? null : me ? (
            <Protected navVisible={navVisible} onNavToggle={toggleNav}>
              <AlumniMap />
            </Protected>
          ) : (
            <>
              <PublicNav visible={navVisible} onToggle={toggleNav} />
              <AlumniMap />
            </>
          )
        }
      />
      <Route path="*" element={<Navigate to="/app/alumni-map" replace />} />
    </Routes>
  );
}

export default function App() {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get<MeResponse>("/api/v1/me")
      .then(setMe)
      .catch(() => setMe(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ me, setMe, loading }}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthContext.Provider>
  );
}
