import { NavLink, Outlet, useNavigate } from "react-router";
import { useAuth } from "@/auth/AuthContext";

const links = [
  ["/drives", "Explore"],
  ["/match", "Match"],
  ["/donations", "My donations"],
  ["/pickups", "Pickups"],
  ["/centers", "Centers"],
  ["/collector", "Collector"],
];

export default function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const visibleLinks = links.filter(([to]) => to !== "/collector" || user?.role === "collector");

  return (
    <div className="min-h-screen bg-[#F5F4EF] text-[#34418E]">
      <header className="sticky top-0 z-40 border-b border-[#34418E]/15 bg-[#F5F4EF]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4 lg:px-8">
          <NavLink to="/" className="font-bold tracking-[0.18em]">DAMAYAN</NavLink>
          <nav className="hidden items-center gap-1 lg:flex">
            {visibleLinks.map(([to, label]) => (
              <NavLink key={to} to={to} className={({ isActive }) => `rounded-full px-4 py-2 text-sm font-semibold transition ${isActive ? "bg-[#34418E] text-white" : "text-[#34418E]/65 hover:bg-[#ECEEF7]"}`}>{label}</NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <span className="hidden text-sm font-semibold sm:inline">{user.name}</span>
                <button onClick={() => { logout(); navigate("/"); }} className="px-3 py-2 text-sm font-semibold">Sign out</button>
              </>
            ) : (
              <NavLink to="/signin" className="px-3 py-2 text-sm font-semibold">Sign in</NavLink>
            )}
            <NavLink to="/donations/new" className="rounded-full bg-[#F2C94C] px-4 py-2.5 text-sm font-bold">Donate</NavLink>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto border-t border-[#34418E]/10 px-4 py-2 lg:hidden">
          {visibleLinks.map(([to, label]) => <NavLink key={to} to={to} className={({ isActive }) => `whitespace-nowrap rounded-full px-3 py-2 text-xs font-semibold ${isActive ? "bg-[#34418E] text-white" : ""}`}>{label}</NavLink>)}
        </nav>
      </header>
      <Outlet />
    </div>
  );
}
