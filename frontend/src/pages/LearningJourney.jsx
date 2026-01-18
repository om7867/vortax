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
    Award
} from 'lucide-react';
import recommendationService from '../services/recommendationService';

export default function LearningJourney() {
    const [progress, setProgress] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [logHours, setLogHours] = useState({ skill_id: '', hours: 1 });

    const fetchProgress = async () => {
        try {
            setLoading(true);
            const data = await recommendationService.getProgressSummary();
            setProgress(data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to load progress", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProgress();
    }, []);

    const handleUpdateProgress = async (e) => {
        e.preventDefault();
        if (!logHours.skill_id) return;

        try {
            setUpdating(true);
            await recommendationService.updateProgress(logHours.skill_id, parseFloat(logHours.hours));
            await fetchProgress(); // Refresh data
            setUpdating(false);
            setLogHours({ ...logHours, hours: 1 });
        } catch (err) {
            console.error("Update failed", err);
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-hasis-page-bg font-bold">
                <div className="text-center">
                    <Loader2 className="h-10 w-10 animate-spin text-hasis-green mx-auto mb-6" />
                    <p className="text-hasis-text-secondary font-black tracking-widest uppercase text-xs">Syncing Progress Logic...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-hasis-page-bg py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black text-hasis-text-primary tracking-tight uppercase flex items-center gap-3">
                            <Route className="w-10 h-10 text-hasis-green" />
                            Daily Progress Tracking
                        </h1>
                        <p className="text-hasis-text-secondary text-lg italic">
                            Track your incremental mastery and unlock your career roadmap
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Log Hours Section */}
                    <div className="lg:col-span-1">
                        <div className="hasis-card bg-hasis-text-primary text-white border-0 p-8 shadow-2xl sticky top-24">
                            <h2 className="text-2xl font-black uppercase tracking-tight mb-6 flex items-center gap-3 italic">
                                <Plus className="w-6 h-6 text-hasis-green" />
                                Daily Check-in
                            </h2>
                            <form onSubmit={handleUpdateProgress} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Select Skill Focus</label>
                                    <select
                                        value={logHours.skill_id}
                                        onChange={(e) => setLogHours({ ...logHours, skill_id: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-hasis-green transition-all"
                                        required
                                    >
                                        <option value="" disabled className="text-black">Choose a skill...</option>
                                        {progress.map(p => (
                                            <option key={p.skill_id} value={p.skill_id} className="text-black">{p.skill_name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Duration (Hours)</label>
                                    <input
                                        type="number"
                                        step="0.5"
                                        min="0.5"
                                        value={logHours.hours}
                                        onChange={(e) => setLogHours({ ...logHours, hours: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-hasis-green transition-all"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={updating}
                                    className="w-full hasis-button-primary py-4 flex items-center justify-center gap-3"
                                >
                                    {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                        <>
                                            <span>Update Progress</span>
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </form>
                            <div className="mt-8 pt-6 border-t border-white/5">
                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <Clock className="w-4 h-4 text-hasis-green" />
                                    <span>Every study hour increases your <span className="text-white font-bold">Readiness Score</span></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Progress Detail Section */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black text-hasis-text-primary uppercase tracking-tight flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-hasis-green" />
                                Current Mastery
                            </h2>
                        </div>

                        {progress.length === 0 ? (
                            <div className="hasis-card bg-gray-50/50 border-dashed border-2 p-20 text-center">
                                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="font-bold text-hasis-text-primary mb-1">No Active Learning Path</h3>
                                <p className="text-hasis-text-secondary text-sm italic">Start a phase in your roadmap to track progress here.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <AnimatePresence>
                                    {progress.map((p, idx) => (
                                        <motion.div
                                            key={p.skill_id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="hasis-card hover:border-hasis-green/20 transition-all p-8"
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-hasis-green-pale flex items-center justify-center border border-hasis-green/5">
                                                        <Award className="w-6 h-6 text-hasis-green" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-bold text-hasis-text-primary uppercase tracking-tight">{p.skill_name}</h3>
                                                        <div className="text-[10px] font-black text-hasis-text-secondary uppercase tracking-widest flex items-center gap-2">
                                                            <Calendar className="w-3 h-3" /> Last Active: {new Date(p.last_updated).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-3xl font-black text-hasis-green">{Math.round(p.progress_percentage)}%</div>
                                                    <div className="text-[9px] font-black text-hasis-text-secondary uppercase tracking-tighter">Mastery Level</div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${p.progress_percentage}%` }}
                                                        className="h-full bg-hasis-green rounded-full shadow-lg shadow-hasis-green/20"
                                                    />
                                                </div>
                                                <div className="flex justify-between text-[10px] font-bold text-hasis-text-secondary uppercase">
                                                    <span>{p.completed_hours} / {p.planned_hours} Hours Logged</span>
                                                    <span>Phase Target Met: {p.progress_percentage >= 100 ? 'YES' : 'NO'}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}

                        {/* Summary Widget */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">
                            <div className="p-6 rounded-3xl bg-white border border-hasis-border flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-hasis-green-pale flex items-center justify-center">
                                    <Star className="w-6 h-6 text-hasis-green" />
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-hasis-text-primary">
                                        {progress.reduce((acc, curr) => acc + (curr.progress_percentage >= 100 ? 1 : 0), 0)}
                                    </div>
                                    <div className="text-xs font-bold text-hasis-text-secondary uppercase">Skills Mastered</div>
                                </div>
                            </div>
                            <div className="p-6 rounded-3xl bg-white border border-hasis-border flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-blue-500" />
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-hasis-text-primary">
                                        {progress.reduce((acc, curr) => acc + curr.completed_hours, 0)}
                                    </div>
                                    <div className="text-xs font-bold text-hasis-text-secondary uppercase">Total Learning Hours</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
