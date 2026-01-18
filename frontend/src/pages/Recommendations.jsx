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
    AlertCircle,
    Map,
    Search,
    GraduationCap,
    Clock
} from 'lucide-react';
import recommendationService from '../services/recommendationService';

const SkeletonCard = () => (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 animate-pulse">
        <div className="flex justify-between mb-4">
            <div className="w-20 h-4 bg-gray-100 rounded-full" />
            <div className="w-12 h-4 bg-gray-100 rounded-full" />
        </div>
        <div className="w-full h-6 bg-gray-100 rounded-lg mb-4" />
        <div className="w-3/4 h-4 bg-gray-100 rounded-lg mb-6" />
        <div className="w-full h-10 bg-gray-100 rounded-xl" />
    </div>
);

export default function Recommendations() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isGapRequired, setIsGapRequired] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await recommendationService.getDetailedRecommendations();
            setData(response);
            setLoading(false);
        } catch (err) {
            console.error("Recommendations Load Error:", err);
            if (err.response?.status === 409) {
                setIsGapRequired(true);
            } else {
                setError("Failed to load your personalized plan. Please try again later.");
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FDFCFB] py-12 px-6 lg:px-12">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12">
                        <div className="w-48 h-8 bg-gray-100 rounded-lg animate-pulse mb-2" />
                        <div className="w-64 h-4 bg-gray-100 rounded-lg animate-pulse" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
                    </div>
                </div>
            </div>
        );
    }

    if (isGapRequired) {
        return (
            <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-6">
                <div className="bg-white rounded-[40px] shadow-sm border border-rose-100 p-12 max-w-lg w-full text-center">
                    <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-8">
                        <AlertCircle className="h-10 w-10 text-rose-500" />
                    </div>
                    <h2 className="text-3xl font-black text-hasis-text-primary tracking-tight uppercase mb-4">Analysis Required</h2>
                    <p className="text-hasis-text-secondary text-lg mb-10 italic">
                        "Your talent profile is blank. Run a Skill Gap Analysis to unlock personalized learning and job matches."
                    </p>
                    <button
                        onClick={() => navigate('/skills/assessment')}
                        className="w-full bg-hasis-green hover:bg-hasis-green-dark text-white rounded-2xl py-5 flex items-center justify-center gap-3 shadow-lg shadow-hasis-green/20 transition-all font-black uppercase text-sm tracking-widest"
                    >
                        Start Assessment
                        <ArrowRight className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-full mt-4 text-xs font-bold text-hasis-text-secondary uppercase tracking-widest hover:text-hasis-text-primary transition-colors"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-6">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-rose-500 mx-auto mb-4" />
                    <p className="text-hasis-text-secondary font-bold uppercase tracking-widest text-xs mb-6">{error}</p>
                    <button onClick={fetchData} className="hasis-button-primary px-8 py-3 h-auto">Retry</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFCFB] py-12 px-6 lg:px-12">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-hasis-green/10 rounded-2xl flex items-center justify-center outline outline-1 outline-hasis-green/20">
                                <Sparkles className="w-6 h-6 text-hasis-green" />
                            </div>
                            <h1 className="text-3xl font-black text-hasis-text-primary tracking-tight uppercase">
                                Recommended Plan
                            </h1>
                        </div>
                        <p className="text-hasis-text-secondary text-lg">
                            Strategic growth path for <span className="text-hasis-green font-bold bg-hasis-green/5 px-2 py-1 rounded-lg border border-hasis-green/10 ml-1">{data.role}</span>
                        </p>
                    </div>

                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-6">
                        <div>
                            <div className="text-3xl font-black text-hasis-text-primary">{Math.round(data.overall_readiness)}%</div>
                            <div className="text-[10px] font-bold text-hasis-text-secondary uppercase tracking-widest">Readiness</div>
                        </div>
                        <div className="w-px h-10 bg-gray-100" />
                        <div>
                            <div className="text-3xl font-black text-hasis-green">{data.skills.length}</div>
                            <div className="text-[10px] font-bold text-hasis-text-secondary uppercase tracking-widest">Focus Gaps</div>
                        </div>
                    </div>
                </div>

                <div className="space-y-24">

                    {/* SECTION 1: Skill Gap Summary */}
                    <section>
                        <h2 className="text-sm font-bold text-hasis-text-secondary uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Gap prioritization
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {data.skills.map((s, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 hover:border-hasis-green/20 transition-all group"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${s.status === 'MISSING' ? 'bg-rose-50 text-rose-500 border-rose-100' : 'bg-amber-50 text-amber-500 border-amber-100'
                                            }`}>
                                            {s.status}
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-black text-hasis-text-primary">{Math.round(s.current_score)}%</div>
                                            <div className="text-[9px] font-bold text-hasis-text-secondary uppercase">Current</div>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-hasis-text-primary mb-6 group-hover:text-hasis-green transition-colors">{s.skill}</h3>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-bold text-hasis-text-secondary uppercase mb-1">
                                            <span>Target: {s.required_score}%</span>
                                            <span>Est. {s.learning_duration_months} Months</span>
                                        </div>
                                        <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100/50">
                                            <div
                                                className={`h-full rounded-full ${s.status === 'MISSING' ? 'bg-rose-400' : 'bg-amber-400'}`}
                                                style={{ width: `${s.current_score}%` }}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* SECTION 2 & 3: Courses and Certifications */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-8">
                            <h2 className="text-sm font-bold text-hasis-text-secondary uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                                <BookOpen className="w-4 h-4" />
                                Targeted courses
                            </h2>
                            <div className="space-y-6">
                                {data.skills.map((s, sIdx) => (
                                    s.courses.map((course, cIdx) => (
                                        <motion.div
                                            key={`${sIdx}-${cIdx}`}
                                            className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-8 hover:shadow-md transition-all group"
                                        >
                                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0 border border-blue-100 group-hover:scale-110 transition-transform">
                                                <GraduationCap className="w-8 h-8 text-blue-500" />
                                            </div>
                                            <div className="flex-1 text-center sm:text-left">
                                                <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">{course.platform}</span>
                                                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                                    <span className="text-[10px] font-bold uppercase text-hasis-text-secondary">For {s.skill}</span>
                                                </div>
                                                <h4 className="text-xl font-bold text-hasis-text-primary leading-tight mb-2">{course.title}</h4>
                                                <p className="text-sm text-hasis-text-secondary font-medium italic">Recommended training to bridge your {s.learning_duration_months}-month gap.</p>
                                            </div>
                                            <a
                                                href={course.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hasis-button-primary px-10 h-14 bg-blue-500 hover:bg-blue-600 shadow-blue-500/20"
                                            >
                                                Start Learning
                                            </a>
                                        </motion.div>
                                    ))
                                ))}
                            </div>
                        </div>

                        <div className="lg:col-span-4">
                            <h2 className="text-sm font-bold text-hasis-text-secondary uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                                <Trophy className="w-4 h-4" />
                                Professional Certs
                            </h2>
                            <div className="space-y-4">
                                {data.skills.map((s, idx) => (
                                    s.certifications.map((cert, cIdx) => (
                                        <div key={`cert-${idx}-${cIdx}`} className="bg-hasis-text-primary text-white rounded-3xl p-6 shadow-xl relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
                                                <Trophy className="w-16 h-16" />
                                            </div>
                                            <div className="relative z-10">
                                                <div className="text-[9px] font-black uppercase tracking-widest text-hasis-green mb-2">Recommended after Month {s.learning_duration_months}</div>
                                                <h4 className="font-bold text-lg mb-1">{cert}</h4>
                                                <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">{s.skill} Validation</p>
                                            </div>
                                        </div>
                                    ))
                                ))}
                                {data.skills.every(s => s.certifications.length === 0) && (
                                    <div className="bg-white rounded-3xl p-10 border-2 border-dashed border-gray-100 text-center">
                                        <Trophy className="w-8 h-8 text-gray-200 mx-auto mb-4" />
                                        <p className="text-xs font-bold text-hasis-text-secondary uppercase italic tracking-widest leading-loose">No specific certifications <br /> recommended yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* SECTION 4: Job Opportunities */}
                    <section className="bg-white rounded-[40px] p-12 border border-gray-100 shadow-sm overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-hasis-green/5 blur-[120px] rounded-full -mr-32 -mt-32" />
                        <div className="relative z-10">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                                <div>
                                    <h2 className="text-3xl font-black text-hasis-text-primary tracking-tight uppercase mb-2">Career Opportunities</h2>
                                    <p className="text-hasis-text-secondary italic">"You'll be job-ready for {data.role} roles in ~{Math.max(...data.skills.map(s => s.learning_duration_months))} months"</p>
                                </div>
                                <div className="bg-hasis-green text-white px-6 py-3 rounded-2xl flex items-center gap-3 shadow-lg shadow-hasis-green/20">
                                    <Search className="w-5 h-5" />
                                    <span className="text-sm font-black uppercase tracking-widest">LinkedIn Integrated</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {data.skills.map((s, sIdx) => (
                                    s.job_roles.map((job, jIdx) => (
                                        <motion.div
                                            key={`${sIdx}-${jIdx}`}
                                            className="bg-gray-50/50 rounded-[32px] p-8 border border-gray-100 hover:bg-white hover:border-hasis-green/30 transition-all group"
                                        >
                                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm border border-gray-100 group-hover:text-hasis-green transition-colors">
                                                <Briefcase className="w-6 h-6" />
                                            </div>
                                            <h4 className="text-xl font-bold text-hasis-text-primary mb-2 leading-tight">{job.title}</h4>
                                            <p className="text-xs text-hasis-text-secondary font-bold uppercase tracking-widest mb-8 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-hasis-green" />
                                                Based on {s.skill}
                                            </p>
                                            <a
                                                href={job.linkedin_search}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full bg-white border border-gray-200 text-hasis-text-primary hover:border-hasis-green hover:text-hasis-green rounded-2xl py-4 flex items-center justify-center gap-2 transition-all font-black uppercase text-[10px] tracking-widest"
                                            >
                                                Apply on LinkedIn
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        </motion.div>
                                    ))
                                ))}
                            </div>
                        </div>
                    </section>
                </div>

                <div className="mt-20 flex flex-col items-center gap-8">
                    <button
                        onClick={() => navigate('/learning-journey')}
                        className="hasis-button-primary px-16 py-6 h-auto text-lg flex items-center gap-4 group"
                    >
                        <span>Start Your Learning Journey</span>
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                    </button>
                    <div className="flex items-center gap-3 text-hasis-text-secondary font-bold text-xs uppercase tracking-widest opacity-60">
                        <Clock className="w-4 h-4" />
                        Next evaluation in 30 days
                    </div>
                </div>
            </div>
        </div>
    );
}
