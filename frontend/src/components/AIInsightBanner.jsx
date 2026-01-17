import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Brain, Sprout } from 'lucide-react';

export default function AIInsightBanner({ readiness, trend_days, trend_percent }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-card w-full p-8 relative overflow-hidden mb-8"
        >
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-agri-yellow/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-agri-green/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">

                {/* Left: Text Insight */}
                <div className="flex-1 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-agri-green/10 text-agri-green font-semibold text-sm">
                        <Sparkles className="w-4 h-4" />
                        <span>AI Crop-Skill Insight</span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
                        You are <span className="text-agri-green text-6xl animate-pulse"> {readiness}% </span> ready for <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-agri-green to-agri-yellow drop-shadow-sm">
                            Agronomist Roles
                        </span>
                    </h1>

                    <p className="text-lg text-gray-600 max-w-2xl">
                        Completing <span className="font-semibold text-gray-900">2 high-impact skills</span> can boost your readiness by
                        <span className="font-bold text-agri-green"> +{trend_percent}%</span> in just <span className="font-bold text-agri-green">{trend_days} days</span>.
                    </p>
                </div>

                {/* Right: Dynamic Stats */}
                <div className="flex gap-4">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="bg-white/60 p-4 rounded-xl shadow-sm border border-white/50 text-center w-32"
                    >
                        <div className="bg-green-100 p-2 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-2">
                            <TrendingUp className="w-5 h-5 text-agri-green" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900">+{trend_percent}%</div>
                        <div className="text-xs text-gray-500 font-medium">Projected Growth</div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="bg-white/60 p-4 rounded-xl shadow-sm border border-white/50 text-center w-32"
                    >
                        <div className="bg-yellow-100 p-2 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-2">
                            <Brain className="w-5 h-5 text-agri-yellow" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900">Top 5%</div>
                        <div className="text-xs text-gray-500 font-medium">Talent Pool</div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
