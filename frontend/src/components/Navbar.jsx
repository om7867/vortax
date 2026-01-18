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
        { name: 'Recommendations', path: '/recommendations' },
        { name: 'Learning Journey', path: '/learning-journey' },
    ];

    return (
        <nav className="bg-white border-b border-gray-100 shadow-sm fixed top-0 w-full z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center gap-8">
                        {/* Logo */}
                        <Link to="/dashboard" className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-hasis-green rounded-xl flex items-center justify-center text-white">
                                <BarChart2 className="w-6 h-6" />
                            </div>
                            <span className="text-2xl font-black text-hasis-green tracking-tighter">PathIQ</span>
                        </Link>

                        {/* Nav Links */}
                        <div className="hidden md:flex items-center gap-1">
                            {navItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${isActive
                                            ? 'text-hasis-green bg-hasis-green-pale shadow-sm'
                                            : 'text-hasis-text-secondary hover:text-hasis-text-primary hover:bg-gray-50'
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
                        <Button variant="ghost" size="icon" className="text-hasis-text-secondary hover:text-hasis-green hover:bg-hasis-green-pale relative rounded-xl transition-all">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </Button>

                        <div className="flex items-center gap-3 pl-4 border-l border-hasis-border">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-hasis-text-primary">{user.username}</p>
                                <p className="text-xs text-hasis-text-secondary capitalize">{user.role?.toLowerCase() || 'Member'}</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={logout} className="rounded-xl bg-gray-50 text-hasis-text-secondary hover:bg-red-50 hover:text-red-600 transition-all">
                                <LogOut className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
