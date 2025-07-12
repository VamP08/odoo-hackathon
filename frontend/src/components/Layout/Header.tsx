// src/components/Layout/Header.tsx
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Shirt,
  User as UserIcon,
  LogOut,
  Plus,
  Home,
  Settings,
  ArrowUpDown,
  History,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

export function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <Shirt className="h-8 w-8 text-emerald-600" />
          <span className="text-2xl font-bold text-gray-900">ReWear</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/browse" className="text-gray-700 hover:text-emerald-600">
            Browse Items
          </Link>
          {user && (
            <>
              <Link to="/add-item" className="text-gray-700 hover:text-emerald-600">
                List Item
              </Link>
              <Link to="/dashboard" className="text-gray-700 hover:text-emerald-600">
                Dashboard
              </Link>
              <Link to="/swap-requests" className="text-gray-700 hover:text-emerald-600">
                Swaps
              </Link>
              <Link to="/history" className="text-gray-700 hover:text-emerald-600">
                History
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="text-gray-700 hover:text-emerald-600">
                  Admin
                </Link>
              )}
            </>
          )}
        </nav>

        {/* User / Auth Buttons */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              {/* Points */}
              <div className="hidden sm:flex items-center space-x-2">
                <span className="text-sm text-gray-600">Points:</span>
                <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-sm font-medium">
                  {user.points_balance}
                </span>
              </div>

              {/* Avatar + Name */}
              <div className="flex items-center space-x-2">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.full_name ?? user.email}
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <UserIcon className="h-8 w-8 text-gray-400" />
                )}
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  {user.full_name ?? user.email}
                </span>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-gray-600"
                title="Log out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-700 hover:text-emerald-600">
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Nav (only if logged in) */}
      {user && (
        <div className="md:hidden border-t border-gray-200 bg-gray-50">
          <div className="flex justify-around py-2">
            <Link to="/dashboard" className="flex flex-col items-center text-gray-600 hover:text-emerald-600">
              <Home className="h-5 w-5" />
              <span className="text-xs mt-1">Dashboard</span>
            </Link>
            <Link to="/browse" className="flex flex-col items-center text-gray-600 hover:text-emerald-600">
              <Shirt className="h-5 w-5" />
              <span className="text-xs mt-1">Browse</span>
            </Link>
            <Link to="/add-item" className="flex flex-col items-center text-gray-600 hover:text-emerald-600">
              <Plus className="h-5 w-5" />
              <span className="text-xs mt-1">Add Item</span>
            </Link>
            <Link to="/swap-requests" className="flex flex-col items-center text-gray-600 hover:text-emerald-600">
              <ArrowUpDown className="h-5 w-5" />
              <span className="text-xs mt-1">Swaps</span>
            </Link>
            <Link to="/history" className="flex flex-col items-center text-gray-600 hover:text-emerald-600">
              <History className="h-5 w-5" />
              <span className="text-xs mt-1">History</span>
            </Link>
            {user.role === 'admin' && (
              <Link to="/admin" className="flex flex-col items-center text-gray-600 hover:text-emerald-600">
                <Settings className="h-5 w-5" />
                <span className="text-xs mt-1">Admin</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
