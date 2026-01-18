import { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell
} from 'recharts';
import {
    ChevronRight,
    CheckCircle2,
    ArrowLeft,
    Share2,
    Download,
    TrendingUp,
    Target,
    Brain,
    Lock,
    ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { cn } from '../../lib/utils';

export default function SkillsDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/api/dashboard/complete');
                setData(response.data);
            } catch (error) {
                console.error("Analytics error:", error);
                // Mock data matches screenshot 3
                setData({
                    proficiencies: [
                        { skill: 'Precision Farming', level: 85 },
                        { skill: 'Data Analysis', level: 65 },
                        { skill: 'Crop Management', level: 90 },
                        { skill: 'Agri IoT', level: 45 },
                        { skill: 'Sustainability', level: 75 }
                    ],
                    pathway: [
                        { id: 1, title: 'Foundations of AgriTech', status: 'completed', date: 'Oct 2023' },
                        { id: 2, title: 'Intermediate Data Modeling', status: 'completed', date: 'Dec 2023' },
                        { id: 3, title: 'Advanced Precision Systems', status: 'in-progress', date: 'Jan 2024' },
                        { id: 4, title: 'Senior Agronomist Certification', status: 'locked', date: 'Q3 2024' }
                    ]
                });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-hasis-page-bg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hasis-green"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-hasis-page-bg flex flex-col">

            {/* Header */}
            <header className="px-6 lg:px-12 py-8 mt-2">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-hasis-text-primary">Detailed Analytics</h1>
                        <p className="text-hasis-text-secondary mt-1 italic">Deep dive into your professional skill evolution</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="p-3 bg-white border border-hasis-border rounded-xl hover:bg-gray-50 transition-colors relative">
                            <Share2 className="w-5 h-5 text-hasis-text-secondary" />
                        </button>
                        <button className="hasis-button-primary px-8">
                            <Download className="w-4 h-4 mr-2" /> Download PDF
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto w-full px-6 lg:px-12 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* Left Column: Skill Proficiency Heatmap (Matches Screenshot 3) */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="hasis-card bg-white p-8">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h2 className="text-xl font-bold text-hasis-text-primary">Skill Proficiency Heatmap</h2>
                                <p className="text-sm text-hasis-text-secondary mt-1">Relative performance across core domains</p>
                            </div>
                            <div className="flex gap-2">
                                <span className="w-3 h-3 bg-hasis-green rounded-sm"></span>
                                <span className="text-[10px] font-bold text-hasis-text-secondary uppercase tracking-widest leading-none mt-0.5">Proficient</span>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {data?.proficiencies?.map((item, i) => (
                                <div key={i} className="group">
                                    <div className="flex justify-between items-center mb-3 px-1">
                                        <span className="font-bold text-hasis-text-primary group-hover:text-hasis-green transition-colors">{item.skill}</span>
                                        <span className="text-sm font-black text-hasis-text-primary">{item.level}%</span>
                                    </div>
                                    <div className="h-4 w-full bg-hasis-green-pale rounded-full overflow-hidden flex">
                                        {/* Segmented Gradient Bar like in Screenshot 3 */}
                                        <div
                                            className="h-full bg-gradient-to-r from-hasis-green/40 via-hasis-green to-hasis-green-light transition-all duration-1000 shadow-sm"
                                            style={{ width: `${item.level}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between mt-2 px-1 text-[8px] font-bold text-hasis-text-secondary uppercase tracking-[0.2em]">
                                        <span>Fundamental</span>
                                        <span>Mastery</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 p-6 bg-gray-50 border border-hasis-border rounded-[2rem] flex flex-col md:flex-row items-center gap-6 justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white rounded-2xl shadow-sm">
                                    <TrendingUp className="w-6 h-6 text-hasis-green" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-hasis-text-primary">Growth Momentum</p>
                                    <p className="text-xs text-hasis-text-secondary">Your learning velocity increased by 15% this quarter.</p>
                                </div>
                            </div>
                            <button className="text-sm font-black text-hasis-green hover:underline flex items-center gap-1 shrink-0">
                                Detailed Log <ArrowUpRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Career Progression (Matches Screenshot 3 Vertical Stepper) */}
                <div className="space-y-8">
                    <div className="hasis-card bg-white p-8">
                        <h2 className="text-xl font-bold text-hasis-text-primary mb-10">Career Pathway</h2>

                        <div className="relative pl-10 space-y-12">
                            {/* Vertical Line */}
                            <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-100"></div>

                            {data?.pathway?.map((node, i) => (
                                <div key={node.id} className="relative group cursor-pointer">
                                    {/* node Circle */}
                                    <div className={cn(
                                        "absolute -left-[30px] w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center transition-all duration-300 z-10",
                                        node.status === 'completed' ? 'bg-hasis-green' :
                                            node.status === 'in-progress' ? 'bg-amber-400 animate-pulse' :
                                                'bg-gray-200'
                                    )}>
                                        {node.status === 'completed' && <CheckCircle2 className="w-3 h-3 text-white" />}
                                    </div>

                                    {/* Content */}
                                    <div className={cn(
                                        "transition-all",
                                        node.status === 'locked' ? 'opacity-50' : 'opacity-100 group-hover:translate-x-1'
                                    )}>
                                        <p className="text-[10px] font-bold text-hasis-text-secondary uppercase tracking-widest mb-1">{node.date}</p>
                                        <p className="font-bold text-hasis-text-primary leading-tight">{node.title}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className={cn(
                                                "text-[8px] font-black uppercase px-2 py-0.5 rounded",
                                                node.status === 'completed' ? 'bg-green-50 text-green-600' :
                                                    node.status === 'in-progress' ? 'bg-amber-50 text-amber-600' :
                                                        'bg-gray-100 text-gray-400'
                                            )}>
                                                {node.status}
                                            </span>
                                            {node.status === 'in-progress' && (
                                                <button className="text-[10px] font-bold text-hasis-green hover:underline ml-auto">Continue</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 bg-hasis-green bg-opacity-5 p-6 rounded-2xl border border-hasis-green border-opacity-10 text-center">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto mb-4">
                                <Target className="w-6 h-6 text-hasis-green" />
                            </div>
                            <h4 className="text-sm font-bold text-hasis-text-primary">Target Achieved?</h4>
                            <p className="text-xs text-hasis-text-secondary mt-1">Once you complete the certification, you will be eligible for Senior roles.</p>
                            <button className="mt-4 text-xs font-black text-hasis-green hover:underline">Download Resume Guide</button>
                        </div>
                    </div>

                    <div className="hasis-card bg-white p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <Brain className="w-6 h-6 text-hasis-green" />
                            <h2 className="text-lg font-bold text-hasis-text-primary">AI Insight</h2>
                        </div>
                        <p className="text-sm text-hasis-text-secondary leading-relaxed italic">
                            "You are currently outpacing 85% of your peers in AgriTech data modeling. Focusing on 'GPS Mapping' could secure a lead role by year-end."
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
