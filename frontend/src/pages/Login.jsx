import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Loader2, Sprout, ArrowRight } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-white">
            {/* Left Side - Visual */}
            <div className="hidden lg:flex w-1/2 flex-col justify-center items-center bg-gray-50 relative overflow-hidden p-12">
                <div className="absolute inset-0 bg-blue-50/50 backdrop-blur-3xl"></div>
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-green-50 to-blue-50 opacity-50 z-0"></div>

                <div className="relative z-10 max-w-lg text-center">
                    <img
                        src="/login-art.png"
                        alt="PathIQ Login"
                        className="w-full h-auto drop-shadow-2xl rounded-2xl border border-white/50 mb-8 transform hover:scale-105 transition-transform duration-700"
                    />
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Master the Future of Agriculture</h2>
                    <p className="text-gray-500 text-lg">
                        Join the world's leading platform for cross-domain skills in AgriTech, Healthcare, and Smart Cities.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
                <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                    <div className="text-center lg:text-left">
                        <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
                            <img src="/logo.png" alt="PathIQ Logo" className="h-12 w-auto object-contain" />
                            {/* 
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-green-500">
                                PathIQ
                            </span>
                            */}
                        </Link>
                        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Welcome Back</h1>
                        <p className="mt-2 text-gray-500">Enter your credentials to access your dashboard.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email or Username</Label>
                            <Input
                                id="email"
                                type="text"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-12 bg-gray-50 border-gray-200 focus:ring-green-500 focus:border-green-500 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <a href="#" className="text-sm font-medium text-green-600 hover:text-green-500">Forgot password?</a>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="h-12 bg-gray-50 border-gray-200 focus:ring-green-500 focus:border-green-500 transition-all"
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-md text-sm text-red-600 flex items-center gap-2">
                                <span>⚠️</span> {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full h-12 text-base bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200 transition-all" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Sign In'}
                            {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-gray-500">New to PathIQ?</span>
                        </div>
                    </div>

                    <div className="text-center">
                        <Link to="/signup">
                            <Button variant="outline" className="w-full h-12 border-gray-200 hover:bg-gray-50 font-semibold group">
                                Create an Account <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
