import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shirt, User, LogOut, Plus, Home, Settings, MessageSquare, ArrowUpDown, History } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';

export function Header() {
  const { user, logout } = useAuth();
  const { messages } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const unreadMessages = user ? messages.filter(msg => 
    msg.receiverId === user.id && !msg.read
  ).length : 0;
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Shirt className="h-8 w-8 text-emerald-600" />
            <span className="text-2xl font-bold text-gray-900">ReWear</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/browse" className="text-gray-700 hover:text-emerald-600 transition-colors">
              Browse Items
            </Link>
            {user && (
              <>
                <Link to="/add-item" className="text-gray-700 hover:text-emerald-600 transition-colors">
                  List Item
                </Link>
                <Link to="/dashboard" className="text-gray-700 hover:text-emerald-600 transition-colors">
                  Dashboard
                </Link>
                <Link to="/swap-requests" className="text-gray-700 hover:text-emerald-600 transition-colors">
                  Swaps
                </Link>
                <Link to="/messages" className="text-gray-700 hover:text-emerald-600 transition-colors relative">
                  Messages
                  {unreadMessages > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {unreadMessages}
                    </span>
                  )}
                </Link>
                <Link to="/history" className="text-gray-700 hover:text-emerald-600 transition-colors">
                  History
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-gray-700 hover:text-emerald-600 transition-colors">
                    Admin
                  </Link>
                )}
              </>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Points:</span>
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-sm font-medium">
                    {user.points}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full" />
                  ) : (
                    <User className="h-8 w-8 text-gray-400" />
                  )}
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {user.name}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-emerald-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {user && (
        <div className="md:hidden border-t border-gray-200 bg-gray-50">
          <div className="flex justify-around py-2">
            <Link to="/dashboard" className="flex flex-col items-center p-2 text-gray-600 hover:text-emerald-600">
              <Home className="h-5 w-5" />
              <span className="text-xs mt-1">Dashboard</span>
            </Link>
            <Link to="/browse" className="flex flex-col items-center p-2 text-gray-600 hover:text-emerald-600">
              <Shirt className="h-5 w-5" />
              <span className="text-xs mt-1">Browse</span>
            </Link>
            <Link to="/add-item" className="flex flex-col items-center p-2 text-gray-600 hover:text-emerald-600">
              <Plus className="h-5 w-5" />
              <span className="text-xs mt-1">Add Item</span>
            </Link>
            <Link to="/swap-requests" className="flex flex-col items-center p-2 text-gray-600 hover:text-emerald-600">
              <ArrowUpDown className="h-5 w-5" />
              <span className="text-xs mt-1">Swaps</span>
            </Link>
            <Link to="/messages" className="flex flex-col items-center p-2 text-gray-600 hover:text-emerald-600 relative">
              <MessageSquare className="h-5 w-5" />
              <span className="text-xs mt-1">Messages</span>
              {unreadMessages > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-3 w-3 flex items-center justify-center">
                  {unreadMessages > 9 ? '9+' : unreadMessages}
                </span>
              )}
            </Link>
            <Link to="/history" className="flex flex-col items-center p-2 text-gray-600 hover:text-emerald-600">
              <History className="h-5 w-5" />
              <span className="text-xs mt-1">History</span>
            </Link>
            {user.role === 'admin' && (
              <Link to="/admin" className="flex flex-col items-center p-2 text-gray-600 hover:text-emerald-600">
                <Settings className="h-5 w-5" />
                <span className="text-xs mt-1">Admin</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}