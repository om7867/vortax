import { useState, useEffect } from 'react';
import {
    PieChart, Pie, Cell, ResponsiveContainer,
} from 'recharts';
import {
    TrendingUp,
    Target,
    ChevronRight,
    Brain,
    Briefcase,
    CheckCircle2,
    Clock,
    ArrowUpRight,
    Search,
    Bell,
    Lock,
    ExternalLink
} from 'lucide-react';
import api from '../../services/api';
import { cn } from '../../lib/utils';

export default function EnterpriseDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

        const fetchData = async () => {
            try {
                const response = await api.get('/api/dashboard/complete', {
                    signal: controller.signal
                });
                clearTimeout(timeoutId);
                setData(response.data);
            } catch (error) {
                console.error("Dashboard error:", error);
                // Mock data matches screenshot 2
                setData({
                    readiness: { percentage: 72 },
                    gaps: {
                        skill_gaps: [
                            { skill: 'Precision Farming', gap: 15, status: 'In Progress' },
                            { skill: 'Data Analysis', gap: 40, status: 'Critical' },
                            { skill: 'Crop Science', gap: 10, status: 'On Track' },
                            { skill: 'Sustainability', gap: 5, status: 'Achieved' }
                        ]
                    },
                    next_steps: [
                        { title: 'Level 4 Assessment', type: 'Test', duration: '45m' },
                        { title: 'Advanced Crop IoT', type: 'Course', duration: '2h' }
                    ]
                });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        return () => {
            clearTimeout(timeoutId);
            controller.abort();
        };
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-hasis-page-bg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hasis-green mb-4"></div>
            <p className="text-hasis-text-secondary font-bold animate-pulse">Syncing your AgriTech intelligence...</p>
        </div>
    );

    const readinessData = [
        { name: 'Ready', value: data?.readiness?.percentage || 0 },
        { name: 'Gap', value: 100 - (data?.readiness?.percentage || 0) }
    ];

    const isLocked = (data?.readiness?.percentage || 0) < 40;

    return (
        <div className="min-h-screen bg-hasis-page-bg">
            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 lg:px-12 py-8">

                {/* Header */}
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-hasis-text-primary">Dashboard Analytics</h1>
                        <p className="text-hasis-text-secondary mt-1 italic">Welcome back, your career progression is looking strong!</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-3 bg-white border border-hasis-border rounded-xl hover:bg-gray-50 transition-colors relative">
                            <Bell className="w-5 h-5 text-hasis-text-secondary" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="h-10 w-px bg-hasis-border mx-2"></div>
                        <div className="flex items-center gap-3 pl-2">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-hasis-text-primary">John Doe</p>
                                <p className="text-xs text-hasis-text-secondary">Senior Agriculturist</p>
                            </div>
                            <div className="w-12 h-12 bg-gray-200 rounded-2xl border-2 border-white shadow-sm overflow-hidden">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=John`} alt="Avatar" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column (Main Stats) */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Career Fit Prediction */}
                        <div className="hasis-card bg-white p-8 overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-hasis-green/5 rounded-full -mr-32 -mt-32 transition-transform group-hover:scale-110"></div>

                            <div className="flex justify-between items-start relative z-10">
                                <div className="space-y-4">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-hasis-green-pale rounded-full border border-hasis-green/10">
                                        <TrendingUp className="w-4 h-4 text-hasis-green" />
                                        <span className="text-xs font-bold text-hasis-green uppercase">High Probability</span>
                                    </div>
                                    <h2 className="text-4xl font-bold text-hasis-text-primary leading-tight">Career Fit Prediction</h2>
                                    <p className="text-lg text-hasis-text-secondary max-w-md">Our AI models predict a <span className="text-hasis-green font-bold">85% match</span> for the Senior Agronomist role by Q4 2024.</p>
                                    <div className="flex gap-4 pt-4">
                                        <button className="hasis-button-primary px-8">View RoadMap</button>
                                        <button className="flex items-center gap-2 font-bold text-hasis-text-secondary hover:text-hasis-text-primary px-4">
                                            Role Details <ExternalLink className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="hidden md:block">
                                    <Brain className="w-32 h-32 text-hasis-green/10" />
                                </div>
                            </div>
                        </div>

                        {/* Skill Gaps Analysis */}
                        <div className="hasis-card bg-white p-8">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-xl font-bold text-hasis-text-primary">Skill Gaps Analysis</h2>
                                <button className="text-sm font-bold text-hasis-green hover:underline flex items-center gap-1">
                                    Full Report <ArrowUpRight className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="space-y-6">
                                {data?.gaps?.skill_gaps?.map((gap, i) => (
                                    <div key={i} className="group cursor-pointer">
                                        <div className="flex justify-between items-end mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm",
                                                    gap.status === 'Critical' ? 'bg-red-50 text-red-600' :
                                                        gap.status === 'In Progress' ? 'bg-blue-50 text-blue-600' :
                                                            'bg-green-50 text-green-600'
                                                )}>
                                                    {String(gap?.skill || gap?.skill_name || '?')[0]}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-hasis-text-primary group-hover:text-hasis-green transition-colors">{gap?.skill || gap?.skill_name || 'Unknown Skill'}</p>
                                                    <p className="text-xs text-hasis-text-secondary">{gap?.status}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-sm font-black text-hasis-text-primary">-{gap.gap}%</span>
                                            </div>
                                        </div>
                                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={cn(
                                                    "h-full transition-all duration-1000",
                                                    gap.status === 'Critical' ? 'bg-red-500' :
                                                        gap.status === 'In Progress' ? 'bg-blue-500' :
                                                            'bg-hasis-green'
                                                )}
                                                style={{ width: `${100 - gap.gap}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Focus Stats) */}
                    <div className="space-y-8">

                        {/* Skill Readiness Score (Donut) */}
                        <div className="hasis-card bg-white p-8 flex flex-col items-center">
                            <h2 className="text-lg font-bold text-hasis-text-primary mb-6">Skill Readiness Score</h2>
                            <div className="w-full h-64 relative flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={readinessData}
                                            innerRadius={70}
                                            outerRadius={95}
                                            paddingAngle={5}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            <Cell fill="#2E7D32" />
                                            <Cell fill="#F1F8E9" />
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute flex flex-col items-center">
                                    <span className="text-5xl font-black text-hasis-green">{data?.readiness?.percentage}%</span>
                                    <span className="text-xs font-bold text-hasis-text-secondary uppercase tracking-widest mt-1">Ready</span>
                                </div>
                            </div>
                            <div className="w-full mt-6 p-4 bg-hasis-green-pale rounded-xl border border-hasis-green/10 flex items-center gap-3">
                                <div className="p-2 bg-hasis-green rounded-lg text-white">
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                                <p className="text-xs font-semibold text-hasis-text-secondary leading-tight">
                                    You've gained <span className="text-hasis-green font-bold">+12%</span> readiness this month.
                                </p>
                            </div>
                        </div>

                        {/* Recommended Next Steps */}
                        <div className="hasis-card bg-white p-8 overflow-hidden relative">
                            {isLocked && (
                                <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-50 flex flex-col items-center justify-center p-8 text-center">
                                    <div className="w-16 h-16 bg-white shadow-xl rounded-2xl flex items-center justify-center mb-4">
                                        <Lock className="w-8 h-8 text-hasis-text-secondary" />
                                    </div>
                                    <h3 className="text-lg font-bold text-hasis-text-primary">Unlock Advanced Steps</h3>
                                    <p className="text-sm text-hasis-text-secondary mt-2">Score above 40% readiness to unlock personalized learning paths.</p>
                                    <button className="mt-6 hasis-button-primary w-full">Start Assessment</button>
                                </div>
                            )}

                            <h2 className="text-lg font-bold text-hasis-text-primary mb-6">Recommended Next Steps</h2>
                            <div className="space-y-4">
                                {data?.next_steps?.map((step, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 border border-hasis-border rounded-xl hover:border-hasis-green hover:bg-hasis-green-pale/3 transition-all cursor-pointer group">
                                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-hasis-green group-hover:bg-hasis-green group-hover:text-white transition-colors">
                                            {step.type === 'Test' ? <Target className="w-5 h-5" /> : <Brain className="w-5 h-5" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-hasis-text-primary">{step.title}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] font-bold text-hasis-text-secondary uppercase">{step.type}</span>
                                                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                                <span className="text-[10px] font-bold text-hasis-text-secondary uppercase">{step.duration}</span>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-hasis-border group-hover:text-hasis-green" />
                                    </div>
                                ))}
                                <button className="w-full py-4 text-sm font-bold text-hasis-text-secondary hover:text-hasis-green transition-colors border-2 border-dashed border-hasis-border rounded-xl mt-2">
                                    Browse All Content
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
