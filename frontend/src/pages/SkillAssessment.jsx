import { useState, useEffect } from 'react';
import api from '../services/api';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import profileV2Service from '../services/profileV2';

export default function SkillAssessment() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [skillId, setSkillId] = useState(1); // Default to Soil Health (id: 1) for demo
    const [assessment, setAssessment] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);

    const [eligibility, setEligibility] = useState({ eligible: true, reason: null });

    useEffect(() => {
        const checkAccess = async () => {
            try {
                const status = await profileV2Service.checkEligibility();
                setEligibility(status);
                if (status.eligible) {
                    fetchAssessment(1); // Auto-load Soil Health if eligible
                }
            } catch (err) {
                console.error("Eligibility check failed", err);
            }
        };
        checkAccess();
    }, []);

    const fetchAssessment = async (id) => {
        setLoading(true);
        try {
            const response = await api.get(`/skillpath/assessment/${id}`);
            setAssessment(response.data);
            setSkillId(id);
        } catch (error) {
            console.error("Failed to load assessment", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (value) => {
        setAnswers({ ...answers, [currentQuestion]: value });
    };

    const submitAssessment = async () => {
        setLoading(true);
        // Calculate trivial score locally for demo logic (backend expects simple calculation or full payload)
        // In real app, send just answers and let backend grade.
        // Here we grade locally to send the "score" param as the backend expects for this MVC.
        let correct = 0;
        assessment.question_bank.forEach((q, idx) => {
            if (answers[idx] === q.answer) correct++;
        });
        const score = (correct / assessment.question_bank.length) * 100;

        try {
            const response = await api.post('/skillpath/assessment/submit', {
                skill_id: skillId,
                score: score
            });
            setResult({ ...response.data, score });
        } catch (error) {
            console.error("Submission failed", error);
        } finally {
            setLoading(false);
        }
    };

    if (!eligibility.eligible) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center">
                <Card className="max-w-md w-full p-10 border-0 shadow-2xl bg-white rounded-[40px]">
                    <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="w-10 h-10 text-amber-500" />
                    </div>
                    <CardTitle className="text-2xl font-black mb-4">Elite Access Restricted</CardTitle>
                    <p className="text-gray-500 mb-8 leading-relaxed font-semibold">
                        {eligibility.reason || "Complete your profile to at least 70% to unlock Skill Assessments."}
                    </p>
                    <Button
                        asChild
                        className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 font-black uppercase tracking-widest"
                    >
                        <Link to="/profile">Complete Profile Now</Link>
                    </Button>
                </Card>
            </div>
        );
    }

    if (loading && !assessment) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
        );
    }

    if (result) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <Card className="max-w-md w-full text-center p-8">
                    <div className="mb-4 flex justify-center">
                        {result.status === 'passed' ? (
                            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="h-8 w-8 text-green-600" />
                            </div>
                        ) : (
                            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
                                <AlertCircle className="h-8 w-8 text-red-600" />
                            </div>
                        )}
                    </div>
                    <h2 className="text-2xl font-bold mb-2">
                        {result.status === 'passed' ? 'Skill Verified!' : 'Assessment Failed'}
                    </h2>
                    <p className="text-gray-500 mb-6">{result.message} You scored {result.score.toFixed(0)}%.</p>
                    <Link to="/dashboard">
                        <Button className="w-full">Return to Dashboard</Button>
                    </Link>
                </Card>
            </div>
        );
    }

    if (!assessment) return <div>No assessment found.</div>;

    const question = assessment.question_bank[currentQuestion];

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex justify-center">
            <Card className="w-full max-w-2xl bg-white shadow-lg h-fit">
                <CardHeader className="border-b bg-gray-50/50 rounded-t-xl">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-xl font-bold text-gray-800">{assessment.title}</CardTitle>
                        <Badge variant="outline">Question {currentQuestion + 1} / {assessment.question_bank.length}</Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-6 md:p-8">
                    <h3 className="text-lg font-medium mb-6 text-gray-900 leading-relaxed">
                        {question.question}
                    </h3>

                    <RadioGroup onValueChange={handleAnswer} value={answers[currentQuestion]}>
                        <div className="space-y-3">
                            {question.options.map((option, idx) => (
                                <div key={idx} className={`
                                    flex items-center space-x-3 border p-4 rounded-lg cursor-pointer transition-all
                                    ${answers[currentQuestion] === option ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:bg-gray-50'}
                                `}>
                                    <RadioGroupItem value={option} id={`opt-${idx}`} />
                                    <Label htmlFor={`opt-${idx}`} className="flex-1 cursor-pointer font-medium text-gray-700">{option}</Label>
                                </div>
                            ))}
                        </div>
                    </RadioGroup>
                </CardContent>
                <CardFooter className="flex justify-between p-6 border-t bg-gray-50/50 rounded-b-xl">
                    <Button
                        variant="ghost"
                        onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                        disabled={currentQuestion === 0}
                    >
                        Previous
                    </Button>

                    {currentQuestion < assessment.question_bank.length - 1 ? (
                        <Button
                            onClick={() => setCurrentQuestion(currentQuestion + 1)}
                            disabled={!answers[currentQuestion]}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            Next Question
                        </Button>
                    ) : (
                        <Button
                            onClick={submitAssessment}
                            disabled={!answers[currentQuestion] || loading}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Submit Assessment
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
