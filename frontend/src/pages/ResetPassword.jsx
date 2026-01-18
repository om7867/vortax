import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, ShieldCheck, ArrowRight, Lock } from 'lucide-react';
import api from '../services/api';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!token) {
            setError('Missing or invalid reset token. Please request a new link.');
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setError('');
        setLoading(true);
        try {
            await api.post('/auth/reset-password', {
                token,
                new_password: password
            });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to reset password. Link may be expired.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-hasis-page-bg flex items-center justify-center p-6">
            <div className="w-full max-w-md hasis-card bg-white p-10 border-hasis-border shadow-2xl shadow-hasis-green/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-hasis-green-pale rounded-full -mr-16 -mt-16 blur-3xl opacity-50"></div>

                <div className="text-center space-y-4 mb-10 relative z-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-hasis-green-pale text-hasis-green border border-hasis-green/5 mb-2">
                        <Lock className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-black text-hasis-text-primary tracking-tighter uppercase">Identity Recovery</h1>
                    <p className="text-hasis-text-secondary font-bold italic text-sm leading-relaxed mx-auto max-w-[280px]">
                        "Establish a new secure entrance to your PathIQ professional hub."
                    </p>
                </div>

                {success ? (
                    <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500 py-6">
                        <div className="p-5 bg-hasis-green-pale text-hasis-green rounded-2xl border border-hasis-green/10 text-xs font-black uppercase tracking-widest leading-relaxed">
                            Logic Reset Successful. Redirecting to Authentication Hub...
                        </div>
                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-hasis-green" />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-hasis-text-secondary uppercase tracking-[0.2em] ml-1">New Hub Secret</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-hasis-text-secondary group-focus-within:text-hasis-green transition-colors w-4 h-4" />
                                <input
                                    type="password"
                                    placeholder="Minimum 6 characters"
                                    className="hasis-input pl-12"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-hasis-text-secondary uppercase tracking-[0.2em] ml-1">Verify Secret</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-hasis-text-secondary group-focus-within:text-hasis-green transition-colors w-4 h-4" />
                                <input
                                    type="password"
                                    placeholder="Re-type new secret"
                                    className="hasis-input pl-12"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 text-red-700 border border-red-100 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 italic">
                                <span>⚠️ System Alert:</span> {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="hasis-button-primary w-full py-5 text-sm"
                            disabled={loading || (!!error && !token)}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" /> Finalizing...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    Reset Password <ArrowRight className="w-5 h-5" />
                                </span>
                            )}
                        </button>
                    </form>
                )}

                <div className="mt-10 pt-8 border-t border-hasis-border text-center">
                    <p className="text-xs font-black text-hasis-text-secondary uppercase tracking-widest">
                        Remembered your secret? {' '}
                        <button onClick={() => navigate('/login')} className="text-hasis-green hover:underline decoration-2 underline-offset-4">
                            Log In
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
