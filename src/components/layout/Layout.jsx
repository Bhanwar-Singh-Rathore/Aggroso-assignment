import { useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { Home, FileText, ChevronRight, Menu } from "lucide-react";

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-50">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 transform transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="h-16 flex items-center px-6 border-b border-gray-50">
            <Link
              to="/"
              className="flex items-center gap-2 font-bold text-xl text-gray-900 tracking-tight"
            >
              <span className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white">
                N
              </span>
              NotaAI
            </Link>
          </div>

          <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
            <Link
              to="/"
              className={`sidebar-link ${location.pathname === "/" ? "active" : ""}`}
            >
              <Home size={18} />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/tracker"
              className={`sidebar-link ${location.pathname === "/tracker" ? "active" : ""}`}
            >
              <FileText size={18} />
              <span>New Meeting</span>
            </Link>
          </nav>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={20} />
            </button>

            <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
              <span className="font-medium text-gray-900">Meeting Tracker</span>
              <ChevronRight size={14} />
              <span>
                {location.pathname === "/" ? "Dashboard" : "Transcribe"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                alt="User"
              />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-5xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
