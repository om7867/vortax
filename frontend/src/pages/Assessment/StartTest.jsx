import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import assessmentService from '../../services/assessmentService';
import { Brain, Clock, HelpCircle, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

const StartTest = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleStart = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await assessmentService.startAssessment();
            // Navigate with test data in state
            navigate(`/assessment/test/${data.id}`, {
                state: { questions: data.questions }
            });
        } catch (err) {
            console.error("Assessment Error:", err);
            if (err.response && err.response.status === 403) {
                const detail = err.response.data.detail;
                if (detail && typeof detail === 'object' && detail.code === 'roadmap_required') {
                    setError({
                        type: 'roadmap',
                        message: detail.message,
                        domain: detail.target_domain,
                        roadmap: detail.roadmap
                    });
                } else {
                    setError({ type: 'text', message: typeof detail === 'string' ? detail : "Access Denied" });
                }
            } else {
                setError({ type: 'text', message: "System failure during test generation. Please re-sync." });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-hasis-page-bg flex items-center justify-center p-6">
            <div className={`${error && error.type === 'roadmap' ? 'max-w-3xl' : 'max-w-xl'} w-full`}>
                <div className="hasis-card bg-white p-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-hasis-green-pale rounded-full -mr-16 -mt-16 blur-3xl opacity-50"></div>

                    <div className="flex flex-col items-center text-center mb-10">
                        <div className="w-20 h-20 bg-hasis-green-pale rounded-[1.5rem] flex items-center justify-center text-hasis-green mb-6 border border-hasis-green/5">
                            <Brain className="w-10 h-10" />
                        </div>
                        <h1 className="text-4xl font-black text-hasis-text-primary tracking-tighter mb-4 uppercase">AI Intelligence Engine</h1>
                        <p className="text-hasis-text-secondary font-bold italic leading-relaxed">
                            "Subject your professional profile to the intelligence hub. Validate mastery across global domain standards."
                        </p>
                    </div>

                    {error && error.type === 'roadmap' ? (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="p-8 bg-amber-50 rounded-[2rem] border border-amber-100 flex items-start gap-4">
                                <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-black text-amber-900 text-lg tracking-tight uppercase mb-2">Roadmap Required</h3>
                                    <p className="text-amber-800 font-medium mb-6 leading-relaxed">{error.message}</p>
                                    <p className="text-amber-700 text-xs font-black uppercase tracking-widest mb-4">Strategic Steps for {error.domain}:</p>

                                    <div className="grid sm:grid-cols-2 gap-3">
                                        {error.roadmap.map((skill, idx) => (
                                            <div key={idx} className="bg-white/80 p-3 rounded-xl border border-amber-200 flex items-center gap-3">
                                                <span className="w-6 h-6 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-[10px] font-black">{idx + 1}</span>
                                                <span className="text-sm font-bold text-amber-900">{skill}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button
                                className="w-full py-5 bg-hasis-text-primary text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-hasis-text-primary/10 hover:bg-gray-800 transition-all flex items-center justify-center gap-3"
                                onClick={() => navigate('/profile')}
                            >
                                Update Skill Repository <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-6 bg-gray-50 rounded-2xl border border-hasis-border text-center group hover:bg-white hover:border-hasis-green/20 transition-all">
                                    <Clock className="w-6 h-6 text-hasis-text-secondary mx-auto mb-3 group-hover:text-hasis-green" />
                                    <div className="text-xs font-black text-hasis-text-secondary uppercase tracking-widest mb-1">Duration</div>
                                    <div className="text-xl font-black text-hasis-text-primary">20 Mins</div>
                                </div>
                                <div className="p-6 bg-gray-50 rounded-2xl border border-hasis-border text-center group hover:bg-white hover:border-hasis-green/20 transition-all">
                                    <HelpCircle className="w-6 h-6 text-hasis-text-secondary mx-auto mb-3 group-hover:text-hasis-green" />
                                    <div className="text-xs font-black text-hasis-text-secondary uppercase tracking-widest mb-1">Items</div>
                                    <div className="text-xl font-black text-hasis-text-primary">25 Logic Nodes</div>
                                </div>
                            </div>

                            <div className="p-4 bg-hasis-green-pale/30 rounded-xl border border-hasis-green/5 flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-hasis-green" />
                                <p className="text-[10px] font-black text-hasis-green uppercase tracking-[0.2em]">Requirement: Verified Identity + Repository Assets</p>
                            </div>

                            {error && error.type === 'text' && (
                                <div className="p-4 bg-red-50 text-red-700 border border-red-100 rounded-xl text-xs font-bold italic text-center">
                                    "System Error: {error.message}"
                                </div>
                            )}

                            <button
                                onClick={handleStart}
                                disabled={loading}
                                className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl transition-all flex items-center justify-center gap-3 ${loading
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'hasis-button-primary shadow-hasis-green/20'
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Generating Assessment...
                                    </>
                                ) : (
                                    <>
                                        Initialize Test Interface <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StartTest;
