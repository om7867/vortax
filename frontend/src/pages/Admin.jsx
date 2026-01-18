import { useState, useEffect } from 'react';
import api from '../services/api';
import { Brain, Users, Briefcase, GraduationCap, Activity, Shield, Plus, Lock, ArrowRight, LayoutDashboard } from 'lucide-react';

export default function Admin() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Form states
    const [skillName, setSkillName] = useState('');

    const fetchAnalytics = async () => {
        try {
            const response = await api.get('/admin/analytics');
            setData(response.data);
        } catch (err) {
            setError('System Access Violation: Insufficient Administrative Clearance.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const handleCreateSkill = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/skills', { name: skillName, category: "Technology" });
            setSkillName('');
            fetchAnalytics();
        } catch (err) {
            alert(err.response?.data?.detail || "Node injection failed.");
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-hasis-page-bg flex items-center justify-center font-bold">
            <div className="text-center">
                <div className="w-16 h-16 bg-hasis-green-pale rounded-2xl flex items-center justify-center mx-auto mb-4 border border-hasis-green/10">
                    <Shield className="w-8 h-8 text-hasis-green animate-pulse" />
                </div>
                <p className="text-hasis-text-secondary font-black tracking-widest uppercase text-xs">Synchronizing System Metrics...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-hasis-page-bg flex items-center justify-center p-6 text-center">
            <div className="hasis-card bg-white max-w-sm w-full p-12 border-red-100">
                <div className="w-20 h-20 bg-red-50 rounded-[2rem] flex items-center justify-center text-red-500 mx-auto mb-8 border border-red-100">
                    <Lock className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-red-900 mb-4 tracking-tight uppercase">Access Restricted</h3>
                <p className="text-red-700 mb-8 font-bold italic">"{error}"</p>
                <button onClick={() => window.location.href = '/'} className="hasis-button-primary bg-red-600 hover:bg-red-700 w-full py-4 text-xs">
                    Return to Safe Zone
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-hasis-page-bg pb-20">
            {/* Command Header */}
            <div className="bg-hasis-text-primary text-white pt-24 pb-32 px-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[40%] h-full bg-hasis-green blur-[120px] opacity-10 -mr-20"></div>

                <div className="max-w-[1400px] mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center text-hasis-green border border-white/10">
                                <Shield className="w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black tracking-tighter uppercase">Intelligence Command</h1>
                                <p className="text-white/40 font-bold italic mt-1 uppercase tracking-widest text-[10px]">PathIQ System Administrative Terminal</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] bg-white/5 px-6 py-3 rounded-2xl border border-white/10 italic">
                            <span className="w-2 h-2 bg-hasis-green rounded-full shadow-[0_0_10px_rgba(46,125,50,0.8)] animate-pulse"></span>
                            Satellite Node Connectivity: Established
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-8 -mt-16 space-y-10">

                {/* Core Metrics Portfolio */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <AdminStatCard icon={<Users className="w-6 h-6 text-hasis-green" />} label="Identity Assets" value={data.metrics?.users} />
                    <AdminStatCard icon={<Brain className="w-6 h-6 text-amber-500" />} label="Logic Grafts" value={data.metrics?.skills} />
                    <AdminStatCard icon={<Briefcase className="w-6 h-6 text-blue-500" />} label="Career Vectors" value={data.metrics?.careers} />
                    <AdminStatCard icon={<Activity className="w-6 h-6 text-rose-500" />} label="Sync Recommendations" value={data.metrics?.recommendations} />
                </div>

                <div className="grid lg:grid-cols-7 gap-10 lg:items-start">

                    {/* Infrastructure Control */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="hasis-card bg-white p-10">
                            <div className="flex items-center justify-between mb-10 pb-6 border-b border-hasis-border">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-hasis-green-pale rounded-2xl">
                                        <LayoutDashboard className="w-6 h-6 text-hasis-green" />
                                    </div>
                                    <h2 className="text-xl font-black text-hasis-text-primary uppercase tracking-tight">Content Infrastructure</h2>
                                </div>
                                <span className="text-[10px] font-black text-hasis-green px-4 py-2 bg-hasis-green-pale rounded-xl uppercase tracking-widest">Priority Phase 1</span>
                            </div>

                            <form onSubmit={handleCreateSkill} className="space-y-6">
                                <div className="bg-gray-50/50 p-8 rounded-[2.5rem] border border-hasis-border space-y-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-sm font-black text-hasis-text-primary uppercase tracking-widest">Initialize New Skill Node</h3>
                                        <GraduationCap className="w-5 h-5 text-hasis-text-secondary" />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-hasis-text-secondary uppercase tracking-[0.2em] ml-1">Asset Nomenclature</label>
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <input
                                                value={skillName}
                                                onChange={(e) => setSkillName(e.target.value)}
                                                placeholder="e.g. Neural Link Processing"
                                                required
                                                className="hasis-input flex-1"
                                            />
                                            <button type="submit" className="hasis-button-primary px-8 py-5 text-xs whitespace-nowrap">
                                                Inject Node <Plus className="ml-2 w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Placeholder for Future Modules */}
                                <div className="p-8 rounded-[2.5rem] border border-hasis-border border-dashed relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gray-50/10 opacity-60 backdrop-blur-sm z-10 flex items-center justify-center">
                                        <span className="bg-white px-6 py-2 rounded-full shadow-sm text-[10px] font-black text-hasis-text-secondary border border-hasis-border uppercase tracking-widest group-hover:scale-110 transition-transform">Upcoming: Career Vectoring</span>
                                    </div>
                                    <div className="flex items-center gap-4 mb-4 opacity-10">
                                        <Briefcase className="w-6 h-6 text-hasis-text-primary" />
                                        <h3 className="text-sm font-black text-hasis-text-primary uppercase tracking-widest">Add New Career</h3>
                                    </div>
                                    <div className="h-14 bg-gray-100/50 rounded-2xl opacity-10"></div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Sentinel Audit Log */}
                    <div className="lg:col-span-3">
                        <div className="hasis-card bg-white p-0 overflow-hidden">
                            <div className="p-8 border-b border-hasis-border flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Activity className="w-6 h-6 text-hasis-green" />
                                    <h2 className="text-xl font-black text-hasis-text-primary uppercase tracking-tight">Sentinel Audit Log</h2>
                                </div>
                            </div>
                            <div className="max-h-[600px] overflow-y-auto overflow-x-hidden bg-gray-50/30 custom-scrollbar">
                                {data.recent_activity.map((log, i) => (
                                    <div key={i} className="p-6 border-b border-hasis-border last:border-0 hover:bg-white transition-all group">
                                        <div className="flex items-start gap-4">
                                            <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${i === 0 ? 'bg-hasis-green shadow-[0_0_8px_rgba(46,125,50,0.6)] animate-pulse' : 'bg-hasis-text-secondary/20'}`}></div>
                                            <div className="space-y-2 flex-1 min-w-0">
                                                <p className="text-sm font-black text-hasis-text-primary uppercase tracking-tight leading-tight group-hover:text-hasis-green transition-colors">{log.action}</p>
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <span className="text-[10px] font-black text-hasis-green px-2 py-1 bg-hasis-green-pale rounded-lg uppercase tracking-widest">{log.user}</span>
                                                    <span className="text-[10px] font-bold text-hasis-text-secondary italic">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                                </div>
                                                {log.details && (
                                                    <div className="mt-3 p-3 bg-white rounded-xl border border-hasis-border text-[9px] font-bold text-hasis-text-secondary overflow-x-auto">
                                                        <code className="whitespace-pre">{JSON.stringify(log.details, null, 2)}</code>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const AdminStatCard = ({ icon, label, value }) => (
    <div className="hasis-card bg-white p-8 group hover:border-hasis-green/20 hover:shadow-2xl hover:shadow-hasis-green/5 transition-all">
        <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-hasis-green-pale/50 rounded-2xl flex items-center justify-center border border-hasis-green/5 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-black text-hasis-text-secondary uppercase tracking-[0.2em] mb-1">{label}</p>
                <div className="text-3xl font-black text-hasis-text-primary tracking-tighter">{value}</div>
            </div>
        </div>
    </div>
);
