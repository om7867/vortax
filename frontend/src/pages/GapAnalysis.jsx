import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Target,
    ArrowRight,
    AlertCircle,
    CheckCircle2,
    TrendingUp,
    Loader2,
    ChevronRight,
    BarChart3,
    Trophy,
    Search
} from 'lucide-react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis
} from 'recharts';
import gapAnalysisService from '../services/gapAnalysisService';

export default function GapAnalysis() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [radarData, setRadarData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // First evaluate to get fresh data
                await gapAnalysisService.evaluateGapAnalysis();
                const [summary, radar] = await Promise.all([
                    gapAnalysisService.getSummary(),
                    gapAnalysisService.getRadarData()
                ]);
                setData(summary);
                setRadarData(radar.data_points);

                // Mark as viewed so roadmap is accessible
                await gapAnalysisService.markViewed();

                setLoading(false);
            } catch (err) {
                console.error("Gap Analysis Error:", err);
                setError(err.response?.data?.detail || "Failed to load skill gap analysis");
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-hasis-green mx-auto mb-6" />
                    <h2 className="text-2xl font-black text-hasis-text-primary tracking-tight uppercase mb-2">Analyzing Career readiness</h2>
                    <p className="text-hasis-text-secondary italic">"Benchmarking skills against industry standards..."</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-4">
                <div className="bg-white rounded-[32px] shadow-sm border border-rose-100 p-10 max-w-md w-full text-center">
                    <AlertCircle className="h-16 w-16 text-rose-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-hasis-text-primary mb-2">Analysis Blocked</h2>
                    <p className="text-hasis-text-secondary mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="hasis-button-primary w-full h-14 rounded-2xl"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const {
        role_name,
        readiness_percentage,
        achieved_skills_count,
        partial_skills_count,
        missing_skills_count,
        skill_gaps
    } = data;

    const donutData = [
        { name: 'Achieved', value: readiness_percentage, color: '#4ADE80' },
        { name: 'Gap', value: 100 - readiness_percentage, color: '#FEE2E2' }
    ];

    return (
        <div className="min-h-screen bg-[#FDFCFB] py-12 px-6 lg:px-12">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 bg-hasis-green/10 rounded-2xl flex items-center justify-center outline outline-1 outline-hasis-green/20">
                            <Target className="w-6 h-6 text-hasis-green" />
                        </div>
                        <h1 className="text-3xl font-black text-hasis-text-primary tracking-tight uppercase">
                            Skill Gap Analysis
                        </h1>
                    </div>
                    <p className="text-hasis-text-secondary text-lg">
                        Career Benchmark for <span className="text-hasis-green font-bold bg-hasis-green/5 px-2 py-1 rounded-lg border border-hasis-green/10 ml-1">{role_name}</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
                    {/* 1. Overall Readiness Donut */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="lg:col-span-4 bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center relative overflow-hidden"
                    >
                        <h2 className="text-sm font-bold text-hasis-text-secondary uppercase tracking-[0.2em] mb-8">Overall Readiness</h2>

                        <div className="relative w-64 h-64 mb-8">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={donutData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={100}
                                        paddingAngle={0}
                                        dataKey="value"
                                        startAngle={90}
                                        endAngle={-270}
                                    >
                                        {donutData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.color}
                                                stroke="none"
                                            />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-5xl font-black text-hasis-text-primary leading-none">
                                    {Math.round(readiness_percentage)}%
                                </span>
                                <span className="text-[10px] uppercase font-bold text-hasis-text-secondary mt-1 tracking-widest">Ready</span>
                            </div>
                        </div>

                        <div className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all duration-500 ${readiness_percentage >= 80 ? 'bg-green-50 text-green-600 border-green-100' :
                            readiness_percentage >= 60 ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                'bg-rose-50 text-rose-600 border-rose-100'
                            }`}>
                            {readiness_percentage >= 80 ? 'Job Ready' : readiness_percentage >= 60 ? 'Moderate Fit' : 'Early Stages'}
                        </div>
                    </motion.div>

                    {/* 2. Radar Chart Coverage */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-8 bg-white rounded-[32px] p-8 shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-sm font-bold text-hasis-text-secondary uppercase tracking-[0.2em]">Skill Coverage vs Benchmark</h2>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-hasis-green rounded-full shadow-sm" />
                                    <span className="text-[10px] font-bold text-hasis-text-secondary uppercase">User Score</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-gray-300 rounded-full shadow-sm" />
                                    <span className="text-[10px] font-bold text-hasis-text-secondary uppercase">Required</span>
                                </div>
                            </div>
                        </div>

                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                    <PolarGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                                    <PolarAngleAxis
                                        dataKey="skill_name"
                                        tick={{ fill: '#64748B', fontSize: 10, fontWeight: 700 }}
                                    />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar
                                        name="Required"
                                        dataKey="required_score"
                                        stroke="#cbd5e1"
                                        fill="#f1f5f9"
                                        fillOpacity={0.6}
                                    />
                                    <Radar
                                        name="User"
                                        dataKey="user_score"
                                        stroke="#22C55E"
                                        fill="#4ADE80"
                                        fillOpacity={0.5}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </div>

                {/* 3. Skill learning stages */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    <div className="lg:col-span-8 bg-white rounded-[32px] p-10 shadow-sm border border-gray-100">
                        <h2 className="text-sm font-bold text-hasis-text-secondary uppercase tracking-[0.2em] mb-8">Learning Stages breakdown</h2>

                        <div className="space-y-8 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                            {skill_gaps.map((gap, index) => (
                                <motion.div
                                    key={gap.skill_id}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group"
                                >
                                    <div className="flex justify-between items-end mb-3">
                                        <div>
                                            <h3 className="font-bold text-hasis-text-primary group-hover:text-hasis-green transition-colors">{gap.skill_name}</h3>
                                            <div className={`mt-1 inline-block px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${gap.gap_status === 'achieved' ? 'bg-green-50 text-green-600 border-green-100' :
                                                gap.gap_status === 'needs_improvement' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                    'bg-rose-50 text-rose-600 border-rose-100'
                                                }`}>
                                                {gap.gap_status.replace('_', ' ')}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-lg font-black text-hasis-text-primary">{Math.round(gap.user_score)}%</span>
                                            <span className="text-[10px] font-bold text-hasis-text-secondary ml-1">/ {gap.required_score}%</span>
                                        </div>
                                    </div>

                                    <div className="h-3 w-full bg-gray-100 rounded-full relative overflow-hidden group-hover:scale-[1.01] transition-transform">
                                        {/* Benchmark Marker */}
                                        <div
                                            className="absolute h-full w-0.5 bg-gray-400 z-10 opacity-30"
                                            style={{ left: `${gap.required_score}%` }}
                                        />
                                        {/* Progress Bar */}
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${gap.user_score}%` }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                            className={`h-full rounded-full shadow-sm ${gap.gap_status === 'achieved' ? 'bg-hasis-green' :
                                                gap.gap_status === 'needs_improvement' ? 'bg-amber-400' :
                                                    'bg-rose-500'
                                                }`}
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 flex-1">
                            <h2 className="text-sm font-bold text-hasis-text-secondary uppercase tracking-[0.2em] mb-6">Quick Stats</h2>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center border border-green-100">
                                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-black text-hasis-text-primary">{achieved_skills_count}</div>
                                        <div className="text-[10px] font-bold text-hasis-text-secondary uppercase tracking-widest">Mastered Skills</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-100">
                                        <TrendingUp className="w-6 h-6 text-amber-600" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-black text-hasis-text-primary">{partial_skills_count}</div>
                                        <div className="text-[10px] font-bold text-hasis-text-secondary uppercase tracking-widest">In Progress</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center border border-rose-100">
                                        <AlertCircle className="h-6 w-6 text-rose-600" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-black text-hasis-text-primary">{missing_skills_count}</div>
                                        <div className="text-[10px] font-bold text-hasis-text-secondary uppercase tracking-widest">Critical Gaps</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/learning-journey')}
                            className="bg-hasis-green hover:bg-hasis-green-dark text-white rounded-[32px] p-8 transition-all flex flex-col items-center justify-center text-center group h-48 shadow-lg shadow-hasis-green/20"
                        >
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <ArrowRight className="w-8 h-8 text-white" />
                            </div>
                            <span className="text-lg font-black uppercase tracking-tighter">
                                Generate Roadmap
                            </span>
                            <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest mt-1">AI-Powered Training Plan</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
