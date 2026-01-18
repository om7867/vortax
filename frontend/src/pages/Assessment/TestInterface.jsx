import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
    ChevronLeft,
    ChevronRight,
    Clock,
    Flag,
    CheckCircle2,
    AlertCircle,
    Info,
    MoreVertical,
    Trophy
} from 'lucide-react';
import api from '../../services/api';
import { cn } from '../../lib/utils';

export default function TestInterface() {
    const { testId } = useParams();
    const navigate = useNavigate();
    const { state } = useLocation();
    const [questions, setQuestions] = useState(state?.questions || []);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timer, setTimer] = useState(600); // 10 mins
    const [loading, setLoading] = useState(!state?.questions);

    useEffect(() => {
        const fetchTest = async () => {
            if (questions.length > 0) return;
            try {
                setLoading(true);
                // Hit start again - it resumes active tests
                const data = await api.post('/api/v3/assessments/start', {});
                setQuestions(data.data.questions);
            } catch (err) {
                console.error("Failed to resume test:", err);
                alert("Session expired or invalid. Please start over.");
                navigate('/skills/assessment');
            } finally {
                setLoading(false);
            }
        };
        fetchTest();
    }, [testId, questions.length, navigate]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(t => (t > 0 ? t - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleOptionSelect = (optionIndex) => {
        setAnswers({ ...answers, [currentIdx]: optionIndex });
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const submissionData = {
                test_id: testId,
                answers: Object.entries(answers).map(([idx, optIdx]) => ({
                    question_id: questions[parseInt(idx)].id,
                    selected_option_index: optIdx
                }))
            };

            await api.post('/api/v3/assessments/submit', submissionData);
            navigate(`/assessment/result/${testId}`);
        } catch (err) {
            console.error("Submission Error:", err);
            alert("Failed to submit test. Please check all questions are answered and try again.");
            setLoading(false);
        }
    };

    const currentQuestion = questions[currentIdx];
    const progress = ((currentIdx + 1) / questions.length) * 100;

    if (loading) return <div className="flex items-center justify-center min-h-screen bg-hasis-page-bg">Loading...</div>;

    return (
        <div className="min-h-screen bg-hasis-page-bg flex flex-col">

            {/* Header: Progress & Timer */}
            <header className="bg-white border-b border-hasis-border px-6 lg:px-12 py-4 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-hasis-green-pale rounded-xl flex items-center justify-center">
                                <Trophy className="w-5 h-5 text-hasis-green" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-hasis-text-primary leading-tight">AgriTech Proficiency L2</h1>
                                <p className="text-xs text-hasis-text-secondary">Progress: Question {currentIdx + 1} of {questions.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors",
                            timer < 60 ? "border-red-200 bg-red-50 text-red-600 animate-pulse" : "border-hasis-border bg-gray-50 text-hasis-text-primary"
                        )}>
                            <Clock className="w-4 h-4" />
                            <span className="font-mono font-bold">{formatTime(timer)}</span>
                        </div>
                        <button
                            onClick={handleSubmit}
                            className="hasis-button-primary h-11 px-6"
                        >
                            Submit Test
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto w-full px-6 lg:px-12 py-10 grid grid-cols-1 lg:grid-cols-4 gap-10">

                {/* Left Side: Navigation Palette (Matches Screenshot 4) */}
                <div className="order-2 lg:order-1 space-y-6">
                    <div className="hasis-card bg-white p-6 h-fit">
                        <h3 className="text-sm font-bold text-hasis-text-primary uppercase tracking-wider mb-6">Question Palette</h3>
                        <div className="grid grid-cols-5 gap-3">
                            {questions.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentIdx(i)}
                                    className={cn(
                                        "w-full aspect-square rounded-lg font-bold text-sm transition-all border",
                                        currentIdx === i ? "bg-hasis-green text-white border-hasis-green shadow-md" :
                                            answers[i] ? "bg-hasis-green-pale text-hasis-green border-hasis-green/20" :
                                                "bg-gray-50 text-hasis-text-secondary border-hasis-border hover:border-hasis-green-light"
                                    )}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-hasis-border space-y-3">
                            <div className="flex items-center gap-3 text-xs font-bold text-hasis-text-secondary lowercase tracking-tight">
                                <div className="w-3 h-3 bg-hasis-green rounded-sm"></div> Answered
                            </div>
                            <div className="flex items-center gap-3 text-xs font-bold text-hasis-text-secondary lowercase tracking-tight">
                                <div className="w-3 h-3 bg-hasis-green opacity-20 rounded-sm"></div> Not Answered
                            </div>
                            <div className="flex items-center gap-3 text-xs font-bold text-hasis-text-secondary lowercase tracking-tight">
                                <div className="w-3 h-3 bg-white border border-hasis-border rounded-sm"></div> Not Visited
                            </div>
                        </div>
                    </div>

                    <div className="hasis-card bg-white p-6 bg-hasis-green-pale/30 border-dashed">
                        <div className="flex items-center gap-3 mb-3">
                            <Info className="w-4 h-4 text-hasis-green" />
                            <h4 className="text-xs font-bold text-hasis-text-primary">Instructions</h4>
                        </div>
                        <p className="text-xs text-hasis-text-secondary leading-relaxed">
                            Each question conveys 2 points. There is no negative marking for this assessment.
                        </p>
                    </div>
                </div>

                {/* Right Side: Question Card (Matches Screenshot 4) */}
                <div className="lg:col-span-3 order-1 lg:order-2 space-y-8">

                    {/* Question Content */}
                    <div className="hasis-card bg-white p-10 min-h-[400px] flex flex-col relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-hasis-green/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>

                        <div className="relative z-10 flex-1">
                            <div className="flex items-center justify-between mb-8">
                                <span className="text-xs font-black text-hasis-green tracking-widest uppercase bg-hasis-green-pale px-3 py-1 rounded-full border border-hasis-green/10">Question {currentIdx + 1}</span>
                                <button className="p-2 hover:bg-gray-50 rounded-lg text-hasis-text-secondary">
                                    <Flag className="w-4 h-4" />
                                </button>
                            </div>

                            <h2 className="text-2xl font-bold text-hasis-text-primary leading-tight mb-12">
                                {currentQuestion?.text}
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {currentQuestion?.options.map((option, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleOptionSelect(i)}
                                        className={cn(
                                            "flex items-center p-5 border rounded-2xl transition-all text-left group/opt",
                                            answers[currentIdx] === i
                                                ? "border-hasis-green bg-hasis-green-pale ring-1 ring-hasis-green"
                                                : "border-hasis-border bg-white hover:border-hasis-green-light"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm mr-4 transition-colors",
                                            answers[currentIdx] === i ? "bg-hasis-green text-white" : "bg-gray-50 text-hasis-text-secondary group-hover/opt:bg-hasis-green-pale group-hover/opt:text-hasis-green"
                                        )}>
                                            {String.fromCharCode(65 + i)}
                                        </div>
                                        <span className="font-semibold text-hasis-text-primary">{option}</span>
                                        {answers[currentIdx] === i && <CheckCircle2 className="ml-auto w-5 h-5 text-hasis-green" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="relative z-10 flex justify-between items-center mt-auto pt-10 border-t border-hasis-border border-dashed">
                            <button
                                onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
                                disabled={currentIdx === 0}
                                className="flex items-center gap-2 font-bold text-hasis-text-secondary hover:text-hasis-text-primary disabled:opacity-30 px-4 py-2"
                            >
                                <ChevronLeft className="w-5 h-5" /> Previous
                            </button>
                            <div className="flex gap-4">
                                <button className="font-bold text-amber-600 hover:text-amber-700 px-4 py-2 border border-amber-200 bg-amber-50 rounded-xl">Review Later</button>
                                <button
                                    onClick={() => setCurrentIdx(Math.min(questions.length - 1, currentIdx + 1))}
                                    className="hasis-button-primary px-8"
                                >
                                    {currentIdx === questions.length - 1 ? 'Go to Summary' : 'Next Question'}
                                    {currentIdx !== questions.length - 1 && <ChevronRight className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Progress Bar (Matches Screenshot 4) */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-end px-2">
                            <span className="text-[10px] font-black text-hasis-text-secondary uppercase tracking-[0.2em]">Overall Progress</span>
                            <span className="text-sm font-black text-hasis-green">{Math.round(progress)}%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-hasis-green transition-all duration-500 shadow-sm"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
