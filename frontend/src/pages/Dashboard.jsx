import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import AIInsightBanner from '../components/AIInsightBanner';
import ReadinessSection from '../components/ReadinessSection';
import AIGapExplainer from '../components/AIGapExplainer';
import AITimeline from '../components/AITimeline';
import { Loader2, BookOpen, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
    const { user } = useAuth();
    const [insight, setInsight] = useState(null);
    const [impactData, setImpactData] = useState(null);
    const [radarData, setRadarData] = useState(null);
    const [timeline, setTimeline] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all data in parallel
                const [resInsight, resImpact, resRadar, resTimeline, resRecs] = await Promise.all([
                    api.get('/dashboard/ai-insight'),
                    api.get('/skillpath/high-impact-skills'),
                    api.get('/skillpath/gap-analysis'),
                    api.get('/skillpath/timeline'),
                    api.get('/skillpath/recommendations/smart')
                ]);

                setInsight(resInsight.data);
                setImpactData(resImpact.data);

                // Transform gap-analysis data for Radar Chart (Standard Recharts format)
                const rData = resRadar.data;
                if (rData.required && rData.user) {
                    const skills = Object.keys(rData.required);
                    const chartData = skills.map(skill => ({
                        skill: skill,
                        required: rData.required[skill],
                        current: rData.user[skill],
                        fullMark: 10
                    }));
                    setRadarData(chartData);
                } else {
                    setRadarData([]);
                }

                setTimeline(resTimeline.data.steps);
                setRecommendations(resRecs.data.recommendations);

            } catch (error) {
                console.error("Dashboard fetch error:", error);
                // If 401, api.js interceptor handles it. 
                // However, putting a fallback here prevents full crash if just one API fails.
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-agri-bg">
                <Loader2 className="h-10 w-10 animate-spin text-agri-green" />
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-20 p-6 md:p-12 max-w-7xl mx-auto">

            {/* 1. AI Hero Section */}
            {insight && (
                <AIInsightBanner
                    readiness={insight.readiness}
                    trend_days={insight.time_estimate_days}
                    trend_percent={insight.projected_growth}
                    role={insight.role}
                    talent_pool={insight.talent_pool_rank}
                />
            )}

            {/* 2. Gap Explainer (Natural Language) */}
            <AIGapExplainer role={insight?.role} />

            {/* 3. Core Readiness Analysis (Radar + Impact Cards) */}
            <ReadinessSection
                radarData={radarData || []}
                impactData={impactData}
            />

            {/* 4. Bottom Grid: Timeline + Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Timeline (1/3 width) */}
                <div className="lg:col-span-1">
                    <AITimeline steps={timeline} />
                </div>

                {/* Recommendations (2/3 width) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 glass-card p-6"
                >
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-agri-yellow" />
                        Smart Recommendations
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500 font-normal">Agri-Focused</span>
                    </h3>

                    <div className="grid gap-4">
                        {recommendations.map((rec, idx) => (
                            <div key={idx} className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-white/60 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex sm:flex-row flex-col gap-5 group cursor-pointer relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-agri-green to-agri-yellow opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner ${rec.type === 'project' ? 'bg-green-50 text-agri-green' : 'bg-blue-50 text-blue-600'}`}>
                                    {rec.type === 'project' ? <Briefcase className="w-8 h-8" /> : <BookOpen className="w-8 h-8" />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-xl group-hover:text-agri-green transition-colors">{rec.title}</h4>
                                            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                                {rec.type === 'project' ?
                                                    <><span>Fixes <strong className="text-gray-700">{rec.reason}</strong> gap</span></> :
                                                    <><span>Provider: {rec.provider}</span></>
                                                }
                                            </p>
                                        </div>
                                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full shadow-sm">+{rec.impact}% Impact</span>
                                    </div>

                                    <div className="mt-5 flex items-center gap-4">
                                        <button className="px-5 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl shadow-lg hover:bg-agri-green hover:shadow-green-900/20 transition-all flex items-center gap-2">
                                            {rec.type === 'project' ? '🌱 Start Project' : '📖 Start Course'}
                                        </button>
                                        <span className="text-xs text-gray-400 font-medium">Est. {rec.duration_days} days</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
