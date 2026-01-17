import { motion } from 'framer-motion';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { ArrowUpRight, Zap } from 'lucide-react';

export default function ReadinessSection({ radarData, impactData }) {
    // impactData format: { total_boost: 43, skills: [...] }
    const impactCards = impactData?.skills?.map(skill => ({
        name: skill.name,
        impact: skill.impact,
        time: 7 // Mock time or fetch if available
    })) || [];

    const totalBoost = impactData?.total_boost || 0;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Left: Radar Chart */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="glass-card p-6 min-h-[400px]"
            >
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="w-2 h-8 bg-agri-green rounded-full"></span>
                    Skill Proficiency Radar
                </h3>

                <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                            <PolarGrid stroke="#e5e7eb" />
                            <PolarAngleAxis dataKey="skill" tick={{ fill: '#4b5563', fontSize: 12, fontWeight: 600 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                            <Radar
                                name="Required"
                                dataKey="required"
                                stroke="#F9A825"
                                strokeWidth={2}
                                fill="#F9A825"
                                fillOpacity={0.1}
                            />
                            <Radar
                                name="You"
                                dataKey="current"
                                stroke="#1B5E20"
                                strokeWidth={3}
                                fill="#1B5E20"
                                fillOpacity={0.6}
                            />
                            <Legend />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* Right: Skill Impact Cards */}
            <div className="flex flex-col justify-center space-y-4">
                <div className="mb-2">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">High-Impact Skill Gaps</h3>
                    <p className="text-sm text-gray-500">⚡ AI predicts completing these will boost readiness by <span className="font-bold text-agri-green">{totalBoost}%</span>.</p>
                </div>

                {impactCards.map((card, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between group cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-orange-50 text-orange-600 group-hover:bg-agri-green/10 group-hover:text-agri-green transition-colors">
                                <Zap className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">{card.name}</h4>
                                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                    <span className="bg-gray-100 px-2 py-0.5 rounded">Missing</span>
                                    <span>⏱️ {card.time} days</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-right">
                            <span className="block text-lg font-bold text-agri-green">+{card.impact}%</span>
                            <span className="text-xs text-gray-400">Readiness</span>
                        </div>
                    </motion.div>
                ))}

                <button className="w-full mt-2 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                    View All Skill Gaps <ArrowUpRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
