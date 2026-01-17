import { motion } from 'framer-motion';
import { Bot, Map } from 'lucide-react';

export default function AIGapExplainer({ role }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="glass-card p-6 mb-12 bg-gradient-to-br from-white to-green-50/50"
        >
            <div className="flex items-start gap-4">
                <div className="bg-agri-green p-3 rounded-xl shadow-lg shadow-green-200">
                    <Bot className="w-6 h-6 text-white" />
                </div>

                <div className="space-y-3">
                    <h3 className="text-lg font-bold text-gray-900">🧠 Why AI Recommends These Skills</h3>
                    <p className="text-gray-600 leading-relaxed">
                        Our AI analyzed <span className="font-semibold text-gray-900 border-b-2 border-agri-yellow/50">1,240+ {role || "Agronomist"} job postings</span> from last week and cross-referenced them with your current skill profile.
                        We detected a <span className="font-semibold text-red-500">critical gap</span> in <span className="italic">Data Analytics applied to Soil Health</span>—a rapidly growing requirement in top AgriTech firms like Corteva and Deere.
                    </p>

                    <div className="flex flex-wrap gap-2 mt-2">
                        <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-600 flex items-center gap-1">
                            <Map className="w-3 h-3" /> Region: India/SE Asia
                        </span>
                        <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-600">
                            📈 Trend: High Demand
                        </span>
                        <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-600">
                            🎯 Role: {role || "Agronomist"}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
