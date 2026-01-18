import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    BookOpen,
    Trophy,
    Briefcase,
    Lock,
    Unlock,
    TrendingUp,
    ArrowRight,
    CheckCircle2,
    ChevronRight,
    Brain,
    ExternalLink,
    Loader2,
    Sparkles,
    AlertCircle
} from 'lucide-react';
import recommendationService from '../services/recommendationService';

export default function Recommendations() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [roadmapData, setRoadmapData] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                const [roadmap, jobsList] = await Promise.all([
                    recommendationService.getRoadmap(),
                    recommendationService.getJobs()
                ]);
                setRoadmapData(roadmap);
                setJobs(jobsList);
                setLoading(false);
            } catch (err) {
                console.error("Recommendations Load Error:", err);
                setError("Failed to load your personalized roadmap. Please ensure you've completed the gap analysis.");
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-hasis-page-bg flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-hasis-green mx-auto mb-6" />
                    <h2 className="text-2xl font-black text-hasis-text-primary tracking-tight uppercase mb-2">Generating Your Path</h2>
                    <p className="text-hasis-text-secondary italic">"Aligning your gaps with industry growth trends..."</p>
                </div>
            </div>
        );
    }

    if (error || !roadmapData?.roadmap) {
        return (
            <div className="min-h-screen bg-hasis-page-bg flex items-center justify-center p-4">
                <div className="hasis-card border-rose-100 max-w-md w-full text-center p-10">
                    <AlertCircle className="h-16 w-16 text-rose-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-hasis-text-primary mb-2">Roadmap Pending</h2>
                    <p className="text-hasis-text-secondary mb-6">{error || "No roadmap data available. Try re-running your gap analysis."}</p>
                    <button
                        onClick={() => navigate('/skills/gap-analysis')}
                        className="hasis-button-primary w-full"
                    >
                        Go to Gap Analysis
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-hasis-page-bg py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Hero section */}
                <div className="relative mb-16 rounded-[2.5rem] bg-hasis-text-primary p-12 overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-hasis-green/20 blur-[120px] rounded-full -mr-20 -mt-20" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full -ml-20 -mb-20" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-hasis-green/10 border border-hasis-green/20 text-hasis-green text-xs font-black uppercase tracking-widest mb-6">
                                <Sparkles className="w-4 h-4" /> AI Personalized Learning Path
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight">
                                Your Intelligence-Driven <span className="text-hasis-green">Career Roadmap</span>
                            </h1>
                            <p className="text-gray-400 mt-6 text-lg max-w-xl">
                                We've analyzed {roadmapData.roadmap.length * 2} core skills to bridge your gaps. Complete this roadmap in <span className="text-white font-bold">{roadmapData.total_duration_months} months</span> to unlock top-tier jobs.
                            </p>
                        </div>
                        <div className="shrink-0">
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center">
                                <div className="text-5xl font-black text-hasis-green mb-2">{roadmapData.total_duration_months}</div>
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Est. Months to Mastery</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

                    {/* Roadmap Timeline (3 cols) */}
                    <div className="lg:col-span-3 space-y-12">
                        <div className="flex items-center gap-3 mb-4">
                            <Calendar className="w-6 h-6 text-hasis-green" />
                            <h2 className="text-2xl font-black text-hasis-text-primary tracking-tight uppercase">Month-wise Mastery</h2>
                        </div>

                        <div className="relative space-y-12 pl-8 border-l-2 border-dashed border-hasis-green/30">
                            {roadmapData.roadmap.map((phase, idx) => (
                                <motion.div
                                    key={phase.phase}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="relative"
                                >
                                    {/* Timeline dot */}
                                    <div className="absolute -left-11 top-0 w-6 h-6 rounded-full bg-white border-4 border-hasis-green flex items-center justify-center shadow-md shadow-hasis-green/20 z-10">
                                        <div className="w-1.5 h-1.5 rounded-full bg-hasis-green" />
                                    </div>

                                    <div className="mb-4">
                                        <div className="text-xs font-black text-hasis-green uppercase tracking-widest mb-1">{phase.months}</div>
                                        <h3 className="text-xl font-bold text-hasis-text-primary">Phase {phase.phase}: {phase.focus_skills.join(' & ')}</h3>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {phase.recommendations.map((rec, rIdx) => (
                                            <div key={rIdx} className="hasis-card bg-white hover:border-hasis-green/30 transition-all group p-5">
                                                <div className="flex justify-between items-start mb-4">
                                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded ${rec.type === 'course' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                                                        }`}>
                                                        {rec.type}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-hasis-text-secondary">{rec.duration}</span>
                                                </div>
                                                <h4 className="font-bold text-hasis-text-primary leading-snug group-hover:text-hasis-green transition-colors mb-3 line-clamp-2">{rec.title}</h4>
                                                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                                                    <span className="text-[10px] font-bold text-hasis-text-secondary uppercase">{rec.provider}</span>
                                                    <a
                                                        href={rec.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-hasis-green hover:underline flex items-center gap-1 text-[10px] font-black uppercase tracking-widest"
                                                    >
                                                        Access <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}

                            {/* Final Achievement */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                className="relative pt-10"
                            >
                                <div className="absolute -left-12 top-10 w-8 h-8 rounded-full bg-hasis-green flex items-center justify-center border-4 border-white shadow-xl shadow-hasis-green/30 z-10">
                                    <Trophy className="w-4 h-4 text-white" />
                                </div>
                                <div className="hasis-card bg-hasis-green text-white border-0 p-8 shadow-green-soft">
                                    <h3 className="text-2xl font-black uppercase tracking-tight mb-2 italic">Career Ready Horizon</h3>
                                    <p className="text-white/80 font-medium">Complete all phases to reach ≥ 85% role alignment and unlock prime job opportunities.</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Sidebar: AI Info & Jobs (1 col) */}
                    <div className="lg:col-span-1 space-y-10">

                        {/* AI Explanation */}
                        <div className="hasis-card border-amber-100 bg-amber-50/20 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Brain className="w-5 h-5 text-amber-500" />
                                <h3 className="font-bold text-hasis-text-primary">AI Strategy</h3>
                            </div>
                            <p className="text-sm text-hasis-text-secondary leading-relaxed font-medium italic">
                                "{roadmapData.ai_explanation}"
                            </p>
                        </div>

                        {/* Trend Alignment */}
                        <div className="hasis-card border-blue-100 bg-blue-50/20 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingUp className="w-5 h-5 text-blue-500" />
                                <h3 className="font-bold text-hasis-text-primary">Market Pulse</h3>
                            </div>
                            <p className="text-sm text-hasis-text-secondary leading-relaxed font-medium">
                                Your roadmap priorities missing skills with the highest <span className="text-blue-600 font-bold">Growth Rate (&gt;15%)</span> to ensure future-proof mastery.
                            </p>
                        </div>

                        {/* CTAs */}
                        <div className="space-y-4">
                            <button
                                onClick={() => navigate('/learning-journey')}
                                className="hasis-button-primary w-full group py-4 flex items-center justify-center gap-3 shadow-green-soft"
                            >
                                <span>Track Daily Progress</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Gated Jobs Section */}
                <div className="mt-24 pt-16 border-t border-hasis-border">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Briefcase className="w-8 h-8 text-hasis-green" />
                                <h2 className="text-3xl font-black text-hasis-text-primary tracking-tight">Unlocked Opportunities</h2>
                            </div>
                            <p className="text-hasis-text-secondary italic">Access exclusive job openings aligned with your updated skill profile</p>
                        </div>

                        {jobs.length === 0 && (
                            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600">
                                <Lock className="w-5 h-5" />
                                <span className="text-sm font-black uppercase tracking-widest">Locked: Progress Threshold Not Met</span>
                            </div>
                        )}
                    </div>

                    {jobs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <AnimatePresence>
                                {jobs.map((job, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="hasis-card border-hasis-green/20 group hover:shadow-green-soft transition-all"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center border border-hasis-border">
                                                <Briefcase className="w-6 h-6 text-hasis-text-secondary transition-colors group-hover:text-hasis-green" />
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-[10px] font-black text-hasis-green bg-hasis-green-pale px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm mb-1">
                                                    {job.match_score}% Match
                                                </span>
                                                <span className="text-[9px] font-bold text-hasis-text-secondary uppercase">{job.sector}</span>
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-hasis-text-primary group-hover:text-hasis-green transition-colors mb-1">{job.title}</h3>
                                        <p className="text-sm text-hasis-text-secondary font-bold mb-6">{job.company}</p>

                                        <p className="text-xs text-hasis-text-secondary leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100 italic mb-6">
                                            "{job.reason}"
                                        </p>

                                        <a
                                            href={job.linkedin_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full hasis-button-primary flex items-center justify-center gap-2 group/btn"
                                        >
                                            Apply via LinkedIn
                                            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                        </a>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="hasis-card bg-gray-50/50 border-dashed border-2 flex flex-col items-center justify-center text-center p-20"
                        >
                            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-xl mb-6 relative">
                                <Lock className="w-8 h-8 text-rose-400" />
                                <div className="absolute inset-0 rounded-full border-2 border-rose-100 animate-ping opacity-20" />
                            </div>
                            <h3 className="text-2xl font-black text-hasis-text-primary uppercase tracking-tight mb-4">Mastery in Progress</h3>
                            <p className="text-hasis-text-secondary max-w-lg mx-auto italic font-medium">
                                "Job opportunities unlock once your Career Readiness hits <span className="text-hasis-green font-bold">60%</span> and you've completed at least <span className="text-hasis-green font-bold">70%</span> of your roadmap focus areas."
                            </p>
                            <button
                                onClick={() => navigate('/learning-journey')}
                                className="mt-8 px-8 py-3 bg-white border border-hasis-border rounded-xl font-bold text-hasis-text-secondary hover:bg-white hover:border-hasis-green transition-all"
                            >
                                Start Learning Now
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
