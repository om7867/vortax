import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import assessmentService from '../../services/assessmentService';
import { Trophy, Target, Award, Calendar, ChevronRight, Loader2, AlertCircle } from 'lucide-react';

const TestResult = () => {
    const { testId } = useParams();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const data = await assessmentService.getResult(testId);
                setResult(data);
            } catch (error) {
                console.error("Error fetching results:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchResult();
    }, [testId]);

    if (loading) return (
        <div className="min-h-screen bg-hasis-page-bg flex items-center justify-center font-bold">
            <div className="text-center animate-pulse">
                <div className="w-16 h-16 bg-hasis-green-pale rounded-2xl flex items-center justify-center mx-auto mb-4 border border-hasis-green/10">
                    <Trophy className="w-8 h-8 text-hasis-green" />
                </div>
                <p className="text-hasis-text-secondary font-black tracking-widest uppercase text-xs">Finalizing Logic Report...</p>
            </div>
        </div>
    );

    if (!result) return (
        <div className="min-h-screen bg-hasis-page-bg flex items-center justify-center p-6 text-center">
            <div className="hasis-card bg-white max-w-md w-full p-12 border-red-100">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-red-900 mb-4 tracking-tight uppercase">Data Loss</h3>
                <p className="text-red-700 mb-8 italic">"The requested intelligence report could not be retrieved from the hub."</p>
                <Link to="/skills/dashboard" className="px-8 py-3 bg-red-50 text-red-600 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-red-100 transition-all">
                    Return to Dashboard
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-hasis-page-bg p-6 md:p-12">
            <div className="max-w-4xl mx-auto space-y-10">

                {/* Result Hero Card */}
                <div className="hasis-card bg-white p-0 overflow-hidden">
                    <div className="bg-hasis-text-primary p-12 text-center relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-hasis-green blur-3xl opacity-20 -mr-32 -mt-32"></div>
                        <div className="relative z-10">
                            <div className="inline-flex p-4 bg-white/5 rounded-3xl border border-white/10 mb-8">
                                <Trophy className="w-12 h-12 text-hasis-green" />
                            </div>
                            <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-4">Competency Validated</h1>
                            <p className="text-white/60 font-bold italic text-lg max-w-2xl mx-auto mb-8">
                                "Assessment session {testId.slice(0, 8)} finalized. Skill compatibility scores successfully synchronized with PathIQ Identity Hub."
                            </p>
                            <div className="flex items-center justify-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">
                                <Calendar className="w-4 h-4" /> Validated on {new Date(result.submitted_at).toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    <div className="px-12 py-10">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-3 h-3 bg-hasis-green rounded-full shadow-[0_0_12px_rgba(46,125,50,0.5)]"></div>
                                    <h3 className="text-xl font-black text-hasis-text-primary uppercase tracking-tight">Intelligence Quotient</h3>
                                </div>
                                <p className="text-hasis-text-secondary font-medium leading-relaxed">
                                    Your aggregate performance across all assessed logic nodes indicates a significant alignment with target domain requirements.
                                </p>
                            </div>
                            <div className="shrink-0">
                                <div className="w-40 h-40 bg-gray-50 rounded-[2.5rem] border-8 border-hasis-green-pale flex flex-col items-center justify-center shadow-inner">
                                    <span className="text-5xl font-black text-hasis-text-primary tracking-tighter">{result.total_score}</span>
                                    <span className="text-[10px] font-black text-hasis-text-secondary uppercase tracking-[0.2em] mt-1">Logic Pts</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Skill Breakdown */}
                <div className="hasis-card bg-white p-10">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="p-3 bg-hasis-green-pale rounded-2xl border border-hasis-green/5">
                            <Target className="w-8 h-8 text-hasis-green" />
                        </div>
                        <h2 className="text-2xl font-black text-hasis-text-primary tracking-tighter uppercase tracking-tight">Node Compatibility breakdown</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {result.skill_results.map((skill) => (
                            <div key={skill.skill_id} className="p-6 bg-gray-50 border border-hasis-border rounded-2xl group hover:bg-white hover:border-hasis-green/20 transition-all duration-300">
                                <div className="flex justify-between items-start mb-6">
                                    <h4 className="font-black text-hasis-text-primary uppercase tracking-tight group-hover:text-hasis-green transition-colors">{skill.skill_name}</h4>
                                    <span className={`text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest border border-current ${skill.confidence_level === 'high' ? 'text-hasis-green bg-hasis-green-pale' :
                                        skill.confidence_level === 'medium' ? 'text-amber-600 bg-amber-50' : 'text-red-600 bg-red-50'
                                        }`}>
                                        {skill.confidence_level} Reliability
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    <div className="h-2 w-full bg-white rounded-full overflow-hidden border border-hasis-border">
                                        <div
                                            className={`h-full transition-all duration-1000 ${skill.score_percentage > 70 ? 'bg-hasis-green' :
                                                skill.score_percentage > 40 ? 'bg-amber-500' : 'bg-red-500'
                                                }`}
                                            style={{ width: `${skill.score_percentage}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-black text-hasis-text-secondary uppercase tracking-widest">
                                        <span>Compatibility</span>
                                        <span className="text-hasis-text-primary">{skill.score_percentage}%</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Final Action */}
                <div className="flex justify-center pt-6">
                    <Link
                        to="/skills/gap-analysis"
                        className="hasis-button-primary px-12 py-5 text-sm flex items-center gap-4"
                    >
                        Review Architectural Gaps <ChevronRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TestResult;
