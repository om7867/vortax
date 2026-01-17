import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Loader2, CheckCircle, ChevronRight, ChevronLeft, Sprout, Building, HeartPulse } from 'lucide-react';
import { cn } from '../lib/utils'; // Assuming this exists from previous steps

const DOMAINS = [
    { id: 'Agriculture', name: 'Agriculture & AgriTech', icon: Sprout, color: 'text-green-600', bg: 'bg-green-100' },
    { id: 'Healthcare', name: 'Healthcare Technology', icon: HeartPulse, color: 'text-red-600', bg: 'bg-red-100' },
    { id: 'Smart City', name: 'Smart Cities & Urban Planning', icon: Building, color: 'text-blue-600', bg: 'bg-blue-100' },
];

const CAREER_GOALS = [
    "Agronomist", "Agricultural Data Analyst", "Precision Ag Specialist",
    "Health Informatics Specialist", "Urban Planner", "Smart City Architect"
];

export default function SignupWizard() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        full_name: '',
        username: '',
        email: '',
        password: '',
        confirm_password: '',
        target_domain: 'Agriculture',
        career_goals: []
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleGoalToggle = (goal) => {
        const goals = formData.career_goals.includes(goal)
            ? formData.career_goals.filter(g => g !== goal)
            : [...formData.career_goals, goal];
        setFormData({ ...formData, career_goals: goals });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // call signup with all fields
            await signup(
                formData.username,
                formData.email,
                formData.password,
                formData.full_name,
                formData.target_domain,
                formData.career_goals
            );
            navigate('/dashboard');
        } catch (error) {
            alert(error.response?.data?.detail || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">

            {/* Step Indicator */}
            <div className="w-full max-w-2xl mb-8">
                <div className="flex justify-between mb-2">
                    {[1, 2, 3, 4].map((s) => (
                        <div key={s} className="flex flex-col items-center">
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300",
                                step >= s ? "bg-green-600 text-white" : "bg-gray-200 text-gray-500"
                            )}>
                                {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                            </div>
                        </div>
                    ))}
                </div>
                <Progress value={(step / 4) * 100} className="h-2" />
                <p className="text-center text-sm text-gray-500 mt-2">Step {step} of 4</p>
            </div>

            <Card className="w-full max-w-4xl shadow-2xl overflow-hidden grid md:grid-cols-2">

                {/* Left Side: Form */}
                <div className="p-6 md:p-8 space-y-6 bg-white order-2 md:order-1">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold tracking-tight">Create Account</h2>
                        <p className="text-gray-500">Let's get started with your professional journey.</p>
                    </div>

                    {/* Step 1: Basic Info */}
                    {step === 1 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-2">
                                <Label htmlFor="full_name">Full Name</Label>
                                <Input id="full_name" placeholder="Sarah Johnson" value={formData.full_name} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input id="username" placeholder="sarahj" value={formData.username} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="sarah@example.com" value={formData.email} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" value={formData.password} onChange={handleChange} />
                            </div>
                        </div>
                    )}

                    {/* Step 2: Target Domain */}
                    {step === 2 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <Label>Select Your Primary Domain</Label>
                            <div className="grid gap-4">
                                {DOMAINS.map((domain) => (
                                    <div
                                        key={domain.id}
                                        onClick={() => setFormData({ ...formData, target_domain: domain.id })}
                                        className={cn(
                                            "flex items-center p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md",
                                            formData.target_domain === domain.id ? "border-green-600 bg-green-50 ring-1 ring-green-600" : "border-gray-200"
                                        )}
                                    >
                                        <div className={cn("p-2 rounded-full mr-4", domain.bg)}>
                                            <domain.icon className={cn("w-6 h-6", domain.color)} />
                                        </div>
                                        <span className="font-semibold">{domain.name}</span>
                                        {formData.target_domain === domain.id && <CheckCircle className="ml-auto w-5 h-5 text-green-600" />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Career Goals */}
                    {step === 3 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <Label>What are your career goals? (Select all that apply)</Label>
                            <div className="grid grid-cols-1 gap-2">
                                {CAREER_GOALS.map((goal) => (
                                    <div
                                        key={goal}
                                        onClick={() => handleGoalToggle(goal)}
                                        className={cn(
                                            "flex items-center p-3 border rounded-md cursor-pointer transition-colors text-sm",
                                            formData.career_goals.includes(goal) ? "bg-blue-50 border-blue-500 text-blue-700" : "hover:bg-gray-50"
                                        )}
                                    >
                                        {goal}
                                        {formData.career_goals.includes(goal) && <CheckCircle className="ml-auto w-4 h-4" />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 4: Review */}
                    {step === 4 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="bg-gray-50 p-4 rounded-lg space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Name:</span>
                                    <span className="font-medium">{formData.full_name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Email:</span>
                                    <span className="font-medium">{formData.email}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Domain:</span>
                                    <span className="font-medium text-green-600">{formData.target_domain}</span>
                                </div>
                                <div className="border-t pt-2">
                                    <span className="text-gray-500 block mb-1">Goals:</span>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.career_goals.map(g => (
                                            <span key={g} className="bg-white border px-2 py-1 rounded text-xs">{g}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-4">
                        {step > 1 ? (
                            <Button variant="ghost" onClick={prevStep}>
                                <ChevronLeft className="mr-2 h-4 w-4" /> Back
                            </Button>
                        ) : (
                            <Link to="/login"><Button variant="ghost">Login instead</Button></Link>
                        )}

                        {step < 4 ? (
                            <Button onClick={nextStep} className="bg-blue-600 hover:bg-blue-700">
                                Next Step <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        ) : (
                            <Button onClick={handleSubmit} disabled={loading} className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Account
                            </Button>
                        )}
                    </div>
                </div>

                {/* Right Side: Visual */}
                <div className="hidden md:flex bg-gradient-to-br from-blue-50 to-green-50 p-12 flex-col justify-center items-center text-center order-1 md:order-2 border-l border-white/50 backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-full h-full bg-grid-slate-200/[0.04] mask-image-b-0"></div>

                    <div className="relative z-10 w-full max-w-md transform hover:scale-105 transition-transform duration-700">
                        <img
                            src="/signup-art.png"
                            alt="Growth Journey"
                            className="w-full h-auto drop-shadow-2xl rounded-xl"
                        />
                    </div>

                    <div className="mt-8 space-y-2 z-10">
                        <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
                            Start Your Growth Journey
                        </h3>
                        <p className="text-gray-500 text-sm max-w-xs mx-auto">
                            Join thousands of professionals bridging the gap between Agriculture, Health, and Urban planning.
                        </p>
                    </div>
                </div>

            </Card>
        </div>
    );
}
