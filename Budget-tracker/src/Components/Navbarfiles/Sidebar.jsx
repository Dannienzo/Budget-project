import React, { useState } from 'react';
import { DollarSign, LogOut, TrendingUp, BarChart3, FileText, MessageCircle, HelpCircle, Settings, X, Menu, FolderOpen } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';

function Sidebar({ currentPage, onPageChange }) {
  const { logout, userProfile } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sidebarItems = [
    { name: 'Dashboard', icon: BarChart3, page: 'FinanceDashboard' },
    { name: 'Analytics', icon: TrendingUp, page: 'Analytics' },
    { name: 'Transaction', icon: FileText, page: 'Transaction' },
    { name: 'Budgeting', icon: MessageCircle, page: 'Budgeting' }, 
    { name: 'Savings & Goal', icon: HelpCircle, page: 'Savings' },
    { name: 'Report', icon: FolderOpen, page: 'Report'},
    { name: 'Settings', icon: Settings, page: 'Settings' }
  ];

  const handlePageChange = (page) => {
    onPageChange(page);
    setIsMobileMenuOpen(false); 
  };

  return (
    <>
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#252525] border border-[#2F2F2F] rounded-lg text-white hover:bg-[#2F2F2F] transition-colors"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-[#252525] border-r border-[#2F2F2F] 
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="p-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <DollarSign className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-white">Budget Tracker</span>
          </div>
        </div>

        {/* Sidebar navigation */}
        <nav className="flex-1 px-4 py-2 overflow-y-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handlePageChange(item.page)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-1 text-left transition-colors ${
                currentPage === item.page
                  ? 'bg-white text-[#1D1D1D]'
                  : 'text-gray-300 hover:bg-[#2F2F2F] hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="truncate">{item.name}</span>
            </button>
          ))}
        </nav>

        {/* Logout button */}
        <div className="p-4 border-t border-[#2F2F2F]">

          <div className="flex items-center gap-3 px-2 py-3 mb-2">
            {userProfile?.avatar ? (
            <img
              src={userProfile.avatar}
              alt="avatar"
              className="w-8 h-8 rounded-full object-cover border-2 border-primary shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">
                {userProfile?.username?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          )}
          <span className="text-sm text-white truncate">{userProfile?.username || 'User'}</span>
          </div>

          <button 
            onClick={() => logout("/login")}
            className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-[#2F2F2F] hover:text-white rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;