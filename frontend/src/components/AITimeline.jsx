import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

export default function AITimeline({ steps }) {
    // Use passed steps or default/mock if loading/empty
    const timelineSteps = steps || [
        { title: "Profile Analysis", desc: "Loading...", status: "pending" }
    ];

    return (
        <div className="glass-card p-6 h-full">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-agri-green" /> AI Learning Timeline
            </h3>

            <div className="space-y-6 relative ml-2">
                {/* Vertical Line */}
                <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-200 z-0"></div>

                {timelineSteps.map((step, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="relative z-10 flex gap-4"
                    >
                        <div className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white flex-shrink-0
                        ${step.status === 'completed' ? 'border-agri-green text-agri-green' :
                                step.status === 'active' || step.status === 'current' ? 'border-agri-yellow text-agri-yellow ring-4 ring-yellow-50' :
                                    'border-gray-300 text-gray-300'}
                    `}>
                            {step.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> :
                                step.status === 'active' || step.status === 'current' ? <div className="w-2.5 h-2.5 bg-agri-yellow rounded-full animate-pulse"></div> :
                                    <Circle className="w-4 h-4" />}
                        </div>

                        <div className="pb-2">
                            <h4 className={`text-sm font-bold ${step.status === 'pending' || step.status === 'locked' ? 'text-gray-400' : 'text-gray-900'}`}>
                                {step.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-0.5">{step.title} status: {step.status}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
