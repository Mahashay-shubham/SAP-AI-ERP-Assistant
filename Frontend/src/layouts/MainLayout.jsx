import { NavLink, Outlet } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function MainLayout() {
  const { logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex min-h-screen">

        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white p-6 transform transition-transform duration-300 md:static md:block md:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <h1 className="text-xl font-bold">
            SAP AI ERP
          </h1>

          <nav className="mt-8 space-y-2">

            <NavLink
              to="/dashboard"
                onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 ${
                  isActive
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/analytics"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 ${
                  isActive
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              Analytics
            </NavLink>

            <NavLink
              to="/materials"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 ${
                  isActive
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              Materials
            </NavLink>

            <NavLink
              to="/vendors"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 ${
                  isActive
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              Vendors
            </NavLink>

            <NavLink
              to="/purchase-orders"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 ${
                  isActive
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              Purchase Orders
            </NavLink>

            <NavLink
              to="/inventory"
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 ${
                  isActive
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              Inventory
            </NavLink>

            <NavLink
              to="/ai-assistant"
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 ${
                  isActive
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              AI Assistant
            </NavLink>

          </nav>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="flex flex-1 flex-col">

          <header className="flex items-center justify-between bg-white px-6 py-4 shadow-sm">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="mr-4 rounded-md bg-slate-900 px-3 py-2 text-white md:hidden"
            >
              ☰
            </button>

            <h2 className="text-xl font-semibold text-gray-800">
              ERP Workspace
            </h2>

            <button
              onClick={logout}
              className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Logout
            </button>
          </header>

          <main className="flex-1 overflow-x-auto p-4 sm:p-6">
            <Outlet />
          </main>

        </div>
      </div>
    </div>
  )
}

export default MainLayout