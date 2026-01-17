import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { BarChart2, Bell, User, LogOut } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const location = useLocation();

    if (!user) return null;

    const navItems = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Profile', path: '/profile' },
        { name: 'Skills', path: '/skills/assessment' },
        { name: 'Gap Analysis', path: '/skills/gap-analysis' },
        { name: 'Recommendations', path: '/skills/recommendations' },
        { name: 'Learning Journey', path: '/learning-journey' },
    ];

    return (
        <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center gap-8">
                        {/* Logo */}
                        {/* Logo */}
                        <Link to="/dashboard" className="flex items-center gap-3">
                            <img src="/logo.png" alt="PathIQ Logo" className="h-14 w-auto object-contain" />
                            {/* <span className="font-bold text-xl text-gray-900 tracking-tight">PathIQ</span> */}
                            {/* Text hidden if logo contains text? Assessing user image... image has text "PathIQ". Hiding text span or keeping it? */}
                            {/* User image has text PathIQ. I will hide the text span to avoid duplication, or just keep it for accessibility/fallback? */}
                            {/* Let's keep it clean: Just the logo image if it's a full lockout. */}
                        </Link>

                        {/* Nav Links */}
                        <div className="hidden md:flex items-center gap-1">
                            {navItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                            ? 'text-blue-600 bg-blue-50'
                                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                            }`}
                                    >
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="text-gray-500 relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </Button>

                        <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-gray-900">{user.username}</p>
                                <p className="text-xs text-gray-500 capitalize">{user.role?.toLowerCase() || 'Member'}</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={logout} className="rounded-full bg-gray-50 hover:bg-red-50 hover:text-red-600">
                                <LogOut className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
