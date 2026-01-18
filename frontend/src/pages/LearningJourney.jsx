import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Route,
    CheckCircle,
    Zap,
    BookOpen,
    Star,
    Calendar,
    Loader2,
    Plus,
    ArrowRight,
    TrendingUp,
    Clock,
    Award,
    ExternalLink,
    Map,
    Flag,
    Code,
    GraduationCap
} from 'lucide-react';
import recommendationService from '../services/recommendationService';

export default function LearningJourney() {
    const [progress, setProgress] = useState([]);
    const [roadmap, setRoadmap] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [logHours, setLogHours] = useState({ skill_id: '', hours: 1 });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [progressData, roadmapData] = await Promise.all([
                recommendationService.getProgressSummary(),
                recommendationService.getMLRoadmap()
            ]);
            setProgress(progressData);
            setRoadmap(roadmapData);
            setLoading(false);
        } catch (error) {
            console.error("Failed to load journey data", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleGenerateRoadmap = async () => {
        try {
            setGenerating(true);
            const newRoadmap = await recommendationService.generateMLRoadmap();
            setRoadmap(newRoadmap);
            setGenerating(false);
        } catch (error) {
            console.error("Failed to generate roadmap", error);
            setGenerating(false);
        }
    };

    const handleUpdateProgress = async (e) => {
        e.preventDefault();
        if (!logHours.skill_id) return;

        try {
            setUpdating(true);
            await recommendationService.updateProgress(logHours.skill_id, parseFloat(logHours.hours));
            const freshProgress = await recommendationService.getProgressSummary();
            setProgress(freshProgress);
            setUpdating(false);
            setLogHours({ ...logHours, hours: 1 });
        } catch (err) {
            console.error("Update failed", err);
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#FDFCFB]">
                <div className="text-center">
                    <Loader2 className="h-10 w-10 animate-spin text-hasis-green mx-auto mb-6" />
                    <p className="text-hasis-text-secondary font-black tracking-widest uppercase text-[10px]">Assembling Your Learning Path...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFCFB] py-12 px-6 lg:px-12">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-12 h-12 bg-hasis-green/10 rounded-2xl flex items-center justify-center outline outline-1 outline-hasis-green/20">
                                <Route className="w-6 h-6 text-hasis-green" />
                            </div>
                            <h1 className="text-3xl font-black text-hasis-text-primary tracking-tight uppercase">
                                Learning Journey
                            </h1>
                        </div>
                        <p className="text-hasis-text-secondary text-lg">
                            Track your milestones and master the skills required for your target role.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* LEFT: Progress Tracker */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 flex flex-col h-fit">
                            <h2 className="text-sm font-bold text-hasis-text-secondary uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" />
                                Growth tracker
                            </h2>

                            <form onSubmit={handleUpdateProgress} className="space-y-6 mb-8">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-hasis-text-secondary mb-2">Skill Focus</label>
                                    <select
                                        value={logHours.skill_id}
                                        onChange={(e) => setLogHours({ ...logHours, skill_id: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-hasis-text-primary focus:outline-none focus:ring-2 focus:ring-hasis-green/20 focus:border-hasis-green transition-all font-bold text-sm"
                                        required
                                    >
                                        <option value="" disabled>Select skill...</option>
                                        {progress.map(p => (
                                            <option key={p.skill_id} value={p.skill_id}>{p.skill_name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-hasis-text-secondary mb-2">Effort (Hours)</label>
                                    <input
                                        type="number"
                                        step="0.5"
                                        min="0.5"
                                        value={logHours.hours}
                                        onChange={(e) => setLogHours({ ...logHours, hours: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-hasis-text-primary focus:outline-none focus:ring-2 focus:ring-hasis-green/20 focus:border-hasis-green transition-all font-bold text-sm"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={updating}
                                    className="w-full bg-hasis-green hover:bg-hasis-green-dark text-white rounded-2xl py-4 flex items-center justify-center gap-3 shadow-lg shadow-hasis-green/20 transition-all font-black uppercase text-xs tracking-widest"
                                >
                                    {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                        <>
                                            <span>Update Effort</span>
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="space-y-6">
                                {progress.map((p, idx) => (
                                    <div key={p.skill_id}>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-bold text-hasis-text-primary">{p.skill_name}</span>
                                            <span className="text-xs font-black text-hasis-green">{Math.round(p.progress_percentage)}%</span>
                                        </div>
                                        <div className="h-2 bg-gray-50 rounded-full overflow-hidden border border-gray-100/50">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${p.progress_percentage}%` }}
                                                className="h-full bg-hasis-green rounded-full"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-hasis-text-primary text-white rounded-[32px] p-8 shadow-xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                    <Star className="w-5 h-5 text-hasis-green" />
                                </div>
                                <h3 className="font-black uppercase tracking-tight text-lg italic">Your milestones</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mastered Skills</span>
                                    <span className="text-xl font-black">{progress.filter(p => p.progress_percentage >= 100).length}</span>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Hours Logged</span>
                                    <span className="text-xl font-black">{progress.reduce((acc, curr) => acc + curr.completed_hours, 0)}h</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: AI Roadmap Timeline */}
                    <div className="lg:col-span-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-sm font-bold text-hasis-text-secondary uppercase tracking-[0.2em] flex items-center gap-2">
                                <Map className="w-4 h-4" />
                                AI Personalized Roadmap
                            </h2>
                            <button
                                onClick={handleGenerateRoadmap}
                                disabled={generating}
                                className="text-[10px] font-black uppercase tracking-widest text-hasis-green bg-hasis-green/10 px-4 py-2 rounded-xl hover:bg-hasis-green/20 transition-all flex items-center gap-2 outline outline-1 outline-hasis-green/20"
                            >
                                {generating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                                Refresh Roadmap
                            </button>
                        </div>

                        {roadmap.length === 0 ? (
                            <div className="bg-white rounded-[32px] border-2 border-dashed border-gray-100 p-20 text-center">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <BookOpen className="w-8 h-8 text-gray-300" />
                                </div>
                                <h3 className="text-xl font-bold text-hasis-text-primary mb-2">No Roadmap Generated Yet</h3>
                                <p className="text-hasis-text-secondary text-sm mb-8 italic">Trigger the AI engine to build your custom path based on assessment gaps.</p>
                                <button
                                    onClick={handleGenerateRoadmap}
                                    className="hasis-button-primary px-10 py-4 h-auto"
                                >
                                    Generate My Roadmap
                                </button>
                            </div>
                        ) : (
                            <div className="relative pl-8 sm:pl-16">
                                {/* Timeline Line */}
                                <div className="absolute left-[39px] sm:left-[71px] top-6 bottom-6 w-0.5 bg-gray-100" />

                                <div className="space-y-12">
                                    {/* Group by month */}
                                    {Array.from(new Set(roadmap.map(item => item.month))).sort((a, b) => a - b).map(month => (
                                        <div key={`month-${month}`} className="relative">
                                            {/* Month Marker */}
                                            <div className="absolute -left-[39px] sm:-left-[71px] flex items-center justify-center">
                                                <div className="w-[18px] h-[18px] bg-[#FDFCFB] rounded-full flex items-center justify-center">
                                                    <div className="w-4 h-4 bg-hasis-green rounded-full shadow-lg shadow-hasis-green/40 border-4 border-white" />
                                                </div>
                                            </div>

                                            <div className="mb-6">
                                                <h3 className="text-xl font-black text-hasis-text-primary uppercase tracking-tight italic">
                                                    Month {month} <span className="text-hasis-green not-italic">—</span> Phase {month}
                                                </h3>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                {roadmap.filter(item => item.month === month).map((step, idx) => (
                                                    <motion.div
                                                        key={step.id}
                                                        initial={{ opacity: 0, x: 20 }}
                                                        whileInView={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: idx * 0.1 }}
                                                        className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group relative overflow-hidden"
                                                    >
                                                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                                                            {step.resource_type === 'COURSE' && <BookOpen className="w-16 h-16" />}
                                                            {step.resource_type === 'PROJECT' && <Code className="w-16 h-16" />}
                                                            {step.resource_type === 'CERTIFICATION' && <Award className="w-16 h-16" />}
                                                        </div>

                                                        <div className="flex items-center gap-3 mb-4">
                                                            {step.resource_type === 'COURSE' && <BookOpen className="w-5 h-5 text-blue-500" />}
                                                            {step.resource_type === 'PROJECT' && <Code className="w-5 h-5 text-amber-500" />}
                                                            {step.resource_type === 'CERTIFICATION' && <Award className="w-5 h-5 text-hasis-green" />}
                                                            <span className="text-[10px] font-bold text-hasis-text-secondary uppercase tracking-widest">{step.resource_type}</span>
                                                        </div>

                                                        <h4 className="font-bold text-hasis-text-primary leading-tight mb-4 min-h-[40px]">
                                                            {step.action}
                                                        </h4>

                                                        <a
                                                            href={step.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-hasis-green group-hover:gap-3 transition-all"
                                                        >
                                                            Resource Link <ExternalLink className="w-3 h-3" />
                                                        </a>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Graduation Item */}
                                    <div className="relative">
                                        <div className="absolute -left-[39px] sm:-left-[71px] flex items-center justify-center">
                                            <div className="w-[18px] h-[18px] bg-[#FDFCFB] rounded-full flex items-center justify-center">
                                                <div className="w-4 h-4 bg-hasis-text-primary rounded-full shadow-lg border-4 border-white" />
                                            </div>
                                        </div>
                                        <div className="bg-hasis-green text-white rounded-[32px] p-10 flex flex-col md:flex-row items-center gap-8 shadow-xl shadow-hasis-green/30">
                                            <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center shrink-0">
                                                <GraduationCap className="w-10 h-10 text-white" />
                                            </div>
                                            <div className="text-center md:text-left">
                                                <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Goal: Job Readiness</h3>
                                                <p className="text-white/80 font-bold">Complete all milestones to unlock direct job matching and industry placement.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
