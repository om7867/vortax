import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Loader2, LogIn, Mail, Lock, X, Eye, EyeOff } from 'lucide-react';
import api from '../services/api';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Forgot Password State
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotLoading, setForgotLoading] = useState(false);
    const [forgotMessage, setForgotMessage] = useState('');

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
            setError(err.response?.data?.detail || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setForgotLoading(true);
        setForgotMessage('');
        try {
            await api.post('/auth/forgot-password', { email: forgotEmail });
            setForgotMessage('If an account exists, a reset link has been sent.');
        } catch (err) {
            setForgotMessage('Failed to process request. Please try again.');
        } finally {
            setForgotLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-hasis-page-bg">
            {/* Forgot Password Modal */}
            {showForgotModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-6 border-b border-hasis-border">
                            <h2 className="text-xl font-bold text-hasis-text-primary">Recover Password</h2>
                            <button onClick={() => setShowForgotModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-5 h-5 text-hasis-text-secondary" />
                            </button>
                        </div>
                        <form onSubmit={handleForgotPassword} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="forgotEmail">Registration Email</Label>
                                <Input
                                    id="forgotEmail"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                    required
                                    className="hasis-input"
                                />
                            </div>
                            {forgotMessage && (
                                <div className={`p-3 rounded-xl text-sm ${forgotMessage.includes('sent') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                    {forgotMessage}
                                </div>
                            )}
                            <Button type="submit" className="w-full hasis-button-primary" disabled={forgotLoading}>
                                {forgotLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Send Reset Link'}
                            </Button>
                        </form>
                    </div>
                </div>
            )}

            {/* Left Side: Layout matches screenshot 0 */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-hasis-green rounded-2xl mb-6 shadow-lg shadow-hasis-green/20">
                            <LogIn className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-hasis-text-primary">Welcome Back</h1>
                        <p className="mt-2 text-hasis-text-secondary">Sign in to your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-hasis-text-secondary" />
                                <Input
                                    id="email"
                                    type="text"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="hasis-input pl-12"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <button
                                    type="button"
                                    onClick={() => setShowForgotModal(true)}
                                    className="text-sm font-medium text-hasis-green hover:text-hasis-green-light"
                                >
                                    Forgot password?
                                </button>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-hasis-text-secondary" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="hasis-input pl-12 pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-3.5 text-hasis-text-secondary hover:text-hasis-text-primary"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                type="checkbox"
                                className="w-4 h-4 text-hasis-green border-hasis-border rounded focus:ring-hasis-green"
                            />
                            <label htmlFor="remember-me" className="ml-2 text-sm text-hasis-text-secondary">
                                Remember me
                            </label>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full hasis-button-primary h-12 text-lg" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Sign In'}
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-hasis-border"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-hasis-page-bg text-hasis-text-secondary italic">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-2 h-12 border border-hasis-border rounded-xl bg-white hover:bg-gray-50 transition-colors">
                            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                            <span className="text-sm font-semibold">Google</span>
                        </button>
                        <button className="flex items-center justify-center gap-2 h-12 border border-hasis-border rounded-xl bg-white hover:bg-gray-50 transition-colors">
                            <img src="https://www.apple.com/favicon.ico" alt="Apple" className="w-4 h-4" />
                            <span className="text-sm font-semibold">Apple</span>
                        </button>
                    </div>

                    <p className="text-center text-sm text-hasis-text-secondary">
                        Don't have an account?{' '}
                        <Link to="/signup" className="font-bold text-hasis-green hover:underline">
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Side: Showcase */}
            <div className="hidden lg:flex lg:w-1/2 bg-white flex-col items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-hasis-green/5 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-hasis-green/5 rounded-full -ml-32 -mb-32"></div>

                <div className="relative z-10 max-w-lg text-center">
                    <div className="mb-12">
                        <h2 className="text-4xl font-bold mb-4">Authentication & User Access</h2>
                        <p className="text-hasis-text-secondary text-lg">Secure, user-friendly login and signup flows with minimal friction</p>
                    </div>
                    <div className="bg-hasis-page-bg p-8 rounded-[2.5rem] shadow-xl border border-hasis-border transform hover:scale-[1.02] transition-transform duration-500">
                        <img
                            src="/login-showcase.png"
                            alt="HASIS Showcase"
                            className="w-full h-auto rounded-3xl"
                            onError={(e) => { e.target.src = 'https://placehold.co/600x400/2E7D32/FFFFFF?text=HASIS+Intelligence'; }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
