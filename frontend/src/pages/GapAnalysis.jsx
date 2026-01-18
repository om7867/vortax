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
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import gapAnalysisService from '../services/gapAnalysisService';

export default function GapAnalysis() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // First evaluate to get fresh data
                await gapAnalysisService.evaluateGapAnalysis();
                const summary = await gapAnalysisService.getSummary();
                setData(summary);

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
            <div className="min-h-screen bg-hasis-page-bg flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-hasis-green mx-auto mb-6" />
                    <h2 className="text-2xl font-black text-hasis-text-primary tracking-tight uppercase mb-2">Analyzing Your Profile</h2>
                    <p className="text-hasis-text-secondary italic">"Synchronizing skill benchmarks with industry standards..."</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-hasis-page-bg flex items-center justify-center p-4">
                <div className="hasis-card border-rose-100 max-w-md w-full text-center">
                    <AlertCircle className="h-16 w-16 text-rose-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-hasis-text-primary mb-2">Analysis Blocked</h2>
                    <p className="text-hasis-text-secondary mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="hasis-button-primary w-full"
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
        needs_improvement_skills_count,
        missing_skills_count,
        skill_gaps
    } = data;

    const chartData = [
        { name: 'Achieved', value: achieved_skills_count, color: '#2E7D32' },
        { name: 'Needs Improvement', value: needs_improvement_skills_count, color: '#FBC02D' },
        { name: 'Missing', value: missing_skills_count, color: '#D32F2F' }
    ].filter(item => item.value > 0);

    return (
        <div className="min-h-screen bg-hasis-page-bg py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-10 text-center sm:text-left">
                    <h1 className="text-4xl font-black text-hasis-text-primary tracking-tight uppercase flex items-center justify-center sm:justify-start gap-4">
                        <Target className="w-10 h-10 text-hasis-green" />
                        Skill Gap Analysis
                    </h1>
                    <p className="text-hasis-text-secondary mt-2 text-lg">
                        Career readiness breakdown for <span className="text-hasis-green font-bold">{role_name}</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* 1. Overall Career Readiness */}
                    <div className="lg:col-span-1 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="hasis-card relative overflow-hidden flex flex-col items-center justify-center text-center p-8 h-full"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <Trophy className="w-32 h-32" />
                            </div>

                            <h2 className="text-xl font-bold text-hasis-text-primary mb-6">Overall Career Readiness</h2>

                            <div className="relative w-full h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={chartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-4xl font-black text-hasis-text-primary">
                                        {Math.round(readiness_percentage)}%
                                    </span>
                                    <span className="text-xs uppercase tracking-widest text-hasis-text-secondary font-bold">Ready</span>
                                </div>
                            </div>

                            <div className="mt-8 space-y-3 w-full">
                                <p className="text-sm text-hasis-text-secondary leading-relaxed">
                                    Your current readiness for the <span className="text-hasis-green font-bold">{role_name}</span> role is calculated based on skill priority and assessment performance.
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* 2. Skill Gap Breakdown */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-xl font-bold text-hasis-text-primary flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-hasis-green" />
                                Skill Breakdown
                            </h2>
                            <div className="flex gap-4 text-xs font-bold uppercase tracking-tighter">
                                <span className="flex items-center gap-1 text-hasis-green"><div className="w-2 h-2 rounded-full bg-hasis-green" /> Achieved</span>
                                <span className="flex items-center gap-1 text-yellow-600"><div className="w-2 h-2 rounded-full bg-yellow-400" /> Improvement</span>
                                <span className="flex items-center gap-1 text-rose-600"><div className="w-2 h-2 rounded-full bg-rose-500" /> Missing</span>
                            </div>
                        </div>

                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                            <AnimatePresence>
                                {skill_gaps.map((gap, index) => (
                                    <motion.div
                                        key={gap.skill_id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hasis-card hover:border-hasis-green/30 transition-all group"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="font-bold text-hasis-text-primary group-hover:text-hasis-green transition-colors">{gap.skill_name}</h3>
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${gap.gap_status === 'achieved' ? 'bg-hasis-green-pale text-hasis-green' :
                                                        gap.gap_status === 'needs_improvement' ? 'bg-yellow-50 text-yellow-700' :
                                                            'bg-rose-50 text-rose-700'
                                                        }`}>
                                                        {gap.gap_status.replace('_', ' ')}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${gap.user_score}%` }}
                                                        className={`h-full rounded-full ${gap.gap_status === 'achieved' ? 'bg-hasis-green' :
                                                            gap.gap_status === 'needs_improvement' ? 'bg-yellow-400' :
                                                                'bg-rose-500'
                                                            }`}
                                                    />
                                                </div>
                                                <div className="flex justify-between mt-1 text-[10px] font-bold text-hasis-text-secondary uppercase">
                                                    <span>Score: {Math.round(gap.user_score)}%</span>
                                                    <span>Req: {gap.required_score}%</span>
                                                </div>
                                            </div>
                                            <div className="text-right flex items-center sm:block">
                                                <div className={`text-xl font-black ${gap.gap_percentage <= 0 ? 'text-hasis-green' : 'text-rose-600'}`}>
                                                    {gap.gap_percentage <= 0 ? (
                                                        <div className="flex items-center gap-1">
                                                            <CheckCircle2 className="w-4 h-4" />
                                                            <span>100%</span>
                                                        </div>
                                                    ) : (
                                                        <span>-{Math.round(gap.gap_percentage)}%</span>
                                                    )}
                                                </div>
                                                <div className="text-[10px] text-hasis-text-secondary uppercase font-bold">Gap Percentage</div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* 3. Status Summary & CTA */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="p-4 rounded-2xl bg-white border border-hasis-border flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-hasis-green-pale flex items-center justify-center">
                            <Search className="w-6 h-6 text-hasis-green" />
                        </div>
                        <div>
                            <div className="text-2xl font-black text-hasis-text-primary">{skill_gaps.length}</div>
                            <div className="text-xs font-bold text-hasis-text-secondary uppercase">Total Skills</div>
                        </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-hasis-border flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6 text-hasis-green" />
                        </div>
                        <div>
                            <div className="text-2xl font-black text-hasis-green">{achieved_skills_count}</div>
                            <div className="text-xs font-bold text-hasis-text-secondary uppercase">Achieved</div>
                        </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-hasis-border flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-black text-yellow-600">{needs_improvement_skills_count}</div>
                            <div className="text-xs font-bold text-hasis-text-secondary uppercase">Improvement</div>
                        </div>
                    </div>
                    <div className="md:col-span-1 flex items-center">
                        <button
                            onClick={() => navigate('/recommendations')}
                            className="hasis-button-primary w-full group py-4 flex items-center justify-center gap-3 shadow-green-soft"
                        >
                            <span>Generate Personalized Roadmap</span>
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
