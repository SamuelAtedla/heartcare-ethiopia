import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import apiClient from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import {
    Heart, LayoutDashboard, Calendar, FileText,
    Wallet, Settings, LogOut, Menu, X, User, Clock,
} from 'lucide-react';

const DashboardLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        const role = user?.role;
        logout();
        if (role === 'doctor') {
            navigate('/login');
        } else {
            navigate('/');
        }
    };

    const NavItem = ({ to, icon: Icon, label }) => {
        const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);
        return (
            <Link
                to={to}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition ${isActive
                    ? 'bg-red-50 text-red-600 font-bold'
                    : 'text-gray-600 hover:bg-gray-50'
                    }`}
            >
                <Icon size={20} />
                <span>{label}</span>
            </Link>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar - Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                <div className="p-6 h-full flex flex-col">
                    <div className="flex items-center space-x-2 mb-8">
                        <div className="bg-red-600 p-1.5 rounded-lg">
                            <Heart className="text-white w-5 h-5" fill="currentColor" />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-gray-800 uppercase">
                            HEART CARE
                        </span>
                    </div>

                    <nav className="flex-1 space-y-1">
                        {user?.role === 'patient' && (
                            <>
                                <NavItem to="/patient/dashboard" icon={LayoutDashboard} label="Timeline" />
                                <NavItem to="/patient/records" icon={FileText} label="My Records" />
                                <NavItem to="/patient/settings" icon={Settings} label="Settings" />
                            </>
                        )}

                        {user?.role === 'doctor' && (
                            <>
                                <NavItem to="/doctor/dashboard" icon={Calendar} label="My Tasks" />
                                <NavItem to="/doctor/finance" icon={Wallet} label="Finance" />
                                <NavItem to="/doctor/archive" icon={User} label="Patient Archive" />
                                <NavItem to="/doctor/schedule" icon={Clock} label="Schedule" />
                                <NavItem to="/doctor/settings" icon={Settings} label="Settings" />
                            </>
                        )}
                    </nav>

                    <div className="pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-3 px-4 py-3 mb-2">
                            {user?.profileImage ? (
                                <img
                                    src={`${apiClient.defaults.baseURL.replace('/api/v1', '')}/${user.profileImage}`}
                                    className="w-8 h-8 rounded-full object-cover border-2 border-red-50"
                                    alt="Profile"
                                    onError={(e) => {
                                        e.target.src = '/doctor-default.png';
                                    }}
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-600 font-bold text-xs border-2 border-red-100 overflow-hidden">
                                    <img src="/doctor-default.png" alt="Default" className="w-full h-full object-cover opacity-50" />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-black text-gray-900 truncate">{user?.fullName}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{user?.role}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition text-sm font-medium"
                        >
                            <LogOut size={18} />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="bg-white border-b border-gray-200 p-4 lg:hidden flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="bg-red-600 p-1.5 rounded-lg">
                            <Heart className="text-white w-5 h-5" fill="currentColor" />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-gray-800 uppercase">
                            HEART CARE
                        </span>
                    </div>
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-600">
                        <Menu size={24} />
                    </button>
                </header>

                <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
