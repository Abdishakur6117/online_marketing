import { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Menu, X } from "lucide-react";

export default function CustomerLayout() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/auth/me", { withCredentials: true });
        setUser(res.data);
      } catch (err) {
        console.error("User fetch failed", err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  // Close dropdowns when route changes
  useEffect(() => {
    setDropdownOpen(false);
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading customer dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[250px_1fr] bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-white border-r p-4 space-y-2 shadow-md z-40
        fixed inset-y-0 left-0 w-64 transform transition-transform duration-300 md:relative md:translate-x-0
        ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <h1 className="text-xl font-bold mb-6">Customer Dashboard</h1>
        <NavItem to="/customer" label="Home" end />
        <NavItem to="/customer/orders" label="My Orders" />
        <NavItem to="/customer/orderDetails" label="My Order Details" />
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex flex-col">
        {/* Navbar */}
        <header className="bg-white shadow px-4 md:px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button
              className="md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h2 className="text-lg md:text-xl font-semibold text-purple-600">
              Online Marketing Platform
            </h2>
          </div>

          {/* Profile */}
          <div className="relative">
            {user ? (
              <>
                <img
                  src={
                    user.image
                      ? user.image
                      : "https://i.pravatar.cc/40?u=default"
                  }
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full cursor-pointer border"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                />

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded shadow-md border z-50">
                    <div className="p-4 text-sm text-gray-700 border-b">
                      <div className="font-semibold">
                        {user.username || "No Name"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {user.email || "No Email"}
                      </div>
                    </div>
                    <ul className="text-sm">
                      <li>
                        <NavLink
                          to="/customer/account"
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => setDropdownOpen(false)}
                        >
                          My Account
                        </NavLink>
                      </li>
                      <li>
                        <button
                          className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
                          onClick={handleLogout}
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
            )}
          </div>
        </header>

        {/* Outlet for pages */}
        <main className="flex-1 p-4 md:p-6 bg-gray-50 overflow-y-auto">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-white text-center py-2 text-sm border-t">
          &copy; {new Date().getFullYear()} Online Marketing Platform — Customer
        </footer>
      </div>
    </div>
  );
}

function NavItem({ to, label, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `block px-4 py-2 rounded hover:bg-purple-100 transition ${
          isActive
            ? "bg-purple-200 text-purple-800 font-semibold"
            : "text-gray-700"
        }`
      }
    >
      {label}
    </NavLink>
  );
}
