import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Loader2, UserPlus, Mail, Lock, User, CheckCircle2, Eye, EyeOff } from 'lucide-react';

export default function Signup() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            // Map to the username/email/password expected by backend
            const username = formData.email.split('@')[0] + Math.floor(Math.random() * 1000);
            await signup(username, formData.email, formData.password, `${formData.firstName} ${formData.lastName}`);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to create account. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Password requirements simulation
    const passReqs = {
        length: formData.password.length >= 8,
        uppercase: /[A-Z]/.test(formData.password),
        number: /[0-9]/.test(formData.password) || /[^A-Za-z0-9]/.test(formData.password)
    };

    const passwordStrength = Object.values(passReqs).filter(Boolean).length;
    const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];

    return (
        <div className="flex min-h-screen bg-hasis-page-bg">
            {/* Left Side: Showcase */}
            <div className="hidden lg:flex lg:w-1/2 bg-white flex-col items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-hasis-green/5 rounded-full -ml-32 -mt-32"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-hasis-green/5 rounded-full -mr-32 -mb-32"></div>

                <div className="relative z-10 max-w-lg text-center">
                    <div className="mb-12">
                        <h2 className="text-4xl font-bold mb-4">Authentication & User Access</h2>
                        <p className="text-hasis-text-secondary text-lg">Secure, user-friendly login and signup flows with minimal friction</p>
                    </div>
                    <div className="bg-hasis-page-bg p-8 rounded-[2.5rem] shadow-xl border border-hasis-border transform hover:scale-[1.02] transition-transform duration-500">
                        <img
                            src="/signup-showcase.png"
                            alt="HASIS Signup"
                            className="w-full h-auto rounded-3xl"
                            onError={(e) => { e.target.src = 'https://placehold.co/600x400/2E7D32/FFFFFF?text=Join+HASIS'; }}
                        />
                    </div>
                </div>
            </div>

            {/* Right Side: Form (Matches screenshot 0 right card) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-hasis-green-pale rounded-2xl mb-6 shadow-sm">
                            <UserPlus className="w-8 h-8 text-hasis-green" />
                        </div>
                        <h1 className="text-3xl font-bold text-hasis-text-primary">Create Account</h1>
                        <p className="mt-2 text-hasis-text-secondary">Get started with HASIS</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                    id="firstName"
                                    type="text"
                                    placeholder="John"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                    className="hasis-input"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                    id="lastName"
                                    type="text"
                                    placeholder="Doe"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                    className="hasis-input"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="hasis-input"
                                />
                                {formData.email.includes('@') && (
                                    <div className="absolute right-4 top-3.5 flex items-center gap-1 text-[10px] text-hasis-green font-bold">
                                        <CheckCircle2 className="w-4 h-4" />
                                        Valid email format
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="hasis-input pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-3.5 text-hasis-text-secondary hover:text-hasis-text-primary"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            {/* Strength Bar */}
                            <div className="pt-2 flex flex-col gap-1">
                                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden flex">
                                    <div
                                        className={`h-full transition-all duration-500 ${passwordStrength === 0 ? 'w-0' :
                                                passwordStrength === 1 ? 'w-1/3 bg-red-500' :
                                                    passwordStrength === 2 ? 'w-2/3 bg-yellow-500' :
                                                        'w-full bg-hasis-green'
                                            }`}
                                    />
                                </div>
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-[10px] text-hasis-text-secondary uppercase font-bold tracking-wider">Password requirements:</span>
                                    <span className={`text-[10px] font-black uppercase ${passwordStrength === 3 ? 'text-hasis-green' : 'text-hasis-text-secondary'
                                        }`}>
                                        {strengthLabels[passwordStrength] || 'Weak'}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-hasis-text-secondary mt-1">
                                <div className="flex items-center gap-1">
                                    <CheckCircle2 className={`w-3 h-3 ${passReqs.length ? 'text-hasis-green' : 'text-gray-300'}`} />
                                    At least 8 characters
                                </div>
                                <div className="flex items-center gap-1">
                                    <CheckCircle2 className={`w-3 h-3 ${passReqs.uppercase ? 'text-hasis-green' : 'text-gray-300'}`} />
                                    One uppercase letter
                                </div>
                                <div className="flex items-center gap-1">
                                    <CheckCircle2 className={`w-3 h-3 ${passReqs.number ? 'text-hasis-green' : 'text-gray-300'}`} />
                                    One number or symbol
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full hasis-button-primary h-12 text-lg mt-4" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Sign Up'}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-hasis-text-secondary">
                        Already have an account?{' '}
                        <Link to="/login" className="font-bold text-hasis-green hover:underline">
                            Log In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

