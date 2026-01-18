import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
    Loader2,
    CheckCircle2,
    ChevronRight,
    ChevronLeft,
    Sprout,
    Database,
    Cloud,
    Microscope,
    Cpu,
    Tractor,
    Plus,
    X,
    UserCircle
} from 'lucide-react';
import { cn } from '../lib/utils';

const DOMAINS = [
    { id: 'AgriTech Innovation', icon: Database, color: 'text-green-600', bg: 'bg-green-50' },
    { id: 'Crop Management', icon: Sprout, color: 'text-green-600', bg: 'bg-green-50' },
    { id: 'Agri Research', icon: Microscope, color: 'text-green-600', bg: 'bg-green-50' },
    { id: 'Data Science', icon: Database, color: 'text-green-600', bg: 'bg-green-50' },
    { id: 'Sustainability', icon: Cloud, color: 'text-green-600', bg: 'bg-green-50' },
    { id: 'Farm Operations', icon: Tractor, color: 'text-green-600', bg: 'bg-green-50' },
];

const EXPERIENCE_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

export default function SignupWizard() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const { signup, login } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        full_name: '',
        email: '',
        password: '',
        confirmPassword: '',
        education_level: '',
        domains: ['AgriTech Innovation'],
        experience_level: 'Beginner',
        skills: [],
        newSkill: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const toggleDomain = (domainId) => {
        const domains = formData.domains.includes(domainId)
            ? formData.domains.filter(d => d !== domainId)
            : [...formData.domains, domainId];
        setFormData({ ...formData, domains });
    };

    const addSkill = () => {
        if (formData.newSkill && !formData.skills.includes(formData.newSkill)) {
            setFormData({
                ...formData,
                skills: [...formData.skills, formData.newSkill],
                newSkill: ''
            });
        }
    };

    const removeSkill = (skillToRemove) => {
        setFormData({
            ...formData,
            skills: formData.skills.filter(s => s !== skillToRemove)
        });
    };

    const nextStep = () => setStep(s => Math.min(s + 1, 4));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    const handleSubmit = async () => {
        if (!formData.username || !formData.email || !formData.password) {
            setStep(1);
            return;
        }
        setLoading(true);
        try {
            await signup(
                formData.username,
                formData.email,
                formData.password,
                formData.full_name,
                formData.domains[0], // Backend expects single string for target_domain
                formData.skills
            );
            navigate('/dashboard');
        } catch (error) {
            console.error("Signup error:", error);
            alert(error.response?.data?.detail || "Signup failed. Please check your details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-hasis-page-bg flex flex-col items-center p-4 lg:p-12">

            {/* Top Toolbar */}
            <div className="w-full max-w-7xl flex justify-between items-center mb-12">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-hasis-green rounded-xl flex items-center justify-center text-white">
                        <UserCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-hasis-text-primary">User Profile Setup</h1>
                        <p className="text-sm text-hasis-text-secondary">Personalize your HASIS experience</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <button className="w-10 h-10 bg-white border border-hasis-border rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
                        <X className="w-5 h-5 text-hasis-text-secondary" />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                            {[1, 2, 3, 4].map(s => (
                                <div key={s} className={`w-2 h-2 rounded-full ${step >= s ? 'bg-hasis-green' : 'bg-gray-200'}`} />
                            ))}
                        </div>
                        <span className="text-xs font-bold text-hasis-text-secondary">Step {step} of 4</span>
                    </div>
                </div>
            </div>

            {/* Step 1: Account Info */}
            {step === 1 && (
                <div className="w-full max-w-2xl bg-white hasis-card p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold text-hasis-text-primary">Create Your Account</h2>
                        <p className="text-hasis-text-secondary">Start your journey with HASIS Intelligence</p>
                    </div>
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input id="username" placeholder="johndoe" value={formData.username} onChange={handleChange} className="hasis-input" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} className="hasis-input" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} className="hasis-input" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input id="confirmPassword" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} className="hasis-input" />
                            </div>
                        </div>
                    </div>
                    <Button onClick={nextStep} className="w-full hasis-button-primary h-14 text-lg">
                        Continue to Profile <ChevronRight className="ml-2 w-5 h-5" />
                    </Button>
                    <p className="text-center text-sm text-hasis-text-secondary">
                        Already have an account? <Link to="/login" className="text-hasis-green font-bold hover:underline">Sign In</Link>
                    </p>
                </div>
            )}

            {/* Step 2: Personal Info */}
            {step === 2 && (
                <div className="w-full max-w-2xl bg-white hasis-card p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold text-hasis-text-primary">Professional Profile</h2>
                        <p className="text-hasis-text-secondary">Tell us about your background</p>
                    </div>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="full_name">Full Name</Label>
                            <Input id="full_name" placeholder="John Doe" value={formData.full_name} onChange={handleChange} className="hasis-input" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="education_level">Highest Education</Label>
                            <Input id="education_level" placeholder="B.Sc. in Agriculture" value={formData.education_level} onChange={handleChange} className="hasis-input" />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="outline" onClick={prevStep} className="flex-1 h-14 border-hasis-border">Back</Button>
                        <Button onClick={nextStep} className="flex-[2] hasis-button-primary h-14">Continue to Skills</Button>
                    </div>
                </div>
            )}

            {/* Step 3: Skills & Domains (The original layout) */}
            {step === 3 && (
                <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Left Section: Form */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="hasis-card bg-white p-8">
                            <div className="space-y-4 mb-8">
                                <Label className="text-sm font-bold text-hasis-text-primary uppercase tracking-wider">Domain Interest</Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {DOMAINS.map((domain) => (
                                        <button
                                            key={domain.id}
                                            onClick={() => toggleDomain(domain.id)}
                                            className={cn(
                                                "flex items-center p-4 border rounded-xl transition-all h-16 text-left",
                                                formData.domains.includes(domain.id)
                                                    ? "border-hasis-green bg-hasis-green-pale ring-1 ring-hasis-green"
                                                    : "border-hasis-border bg-white hover:border-hasis-green-light"
                                            )}
                                        >
                                            <div className={cn("p-2 rounded-lg mr-4", domain.bg)}>
                                                <domain.icon className={cn("w-5 h-5", domain.color)} />
                                            </div>
                                            <span className="font-semibold text-hasis-text-primary">{domain.id}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label className="text-sm font-bold text-hasis-text-primary uppercase tracking-wider">Experience Level</Label>
                                <div className="grid grid-cols-3 gap-4">
                                    {EXPERIENCE_LEVELS.map((level) => (
                                        <button
                                            key={level}
                                            onClick={() => setFormData({ ...formData, experience_level: level })}
                                            className={cn(
                                                "h-14 rounded-xl font-bold transition-all border",
                                                formData.experience_level === level
                                                    ? "bg-hasis-green text-white border-hasis-green shadow-lg shadow-hasis-green/20"
                                                    : "bg-white text-hasis-text-secondary border-hasis-border hover:border-hasis-green-light"
                                            )}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Button variant="outline" onClick={prevStep} className="flex-1 h-14 border-hasis-border font-bold">Back</Button>
                            <Button onClick={nextStep} className="flex-[2] hasis-button-primary h-14 text-lg">Continue to Review</Button>
                        </div>
                    </div>

                    {/* Right Section: Skills */}
                    <div className="space-y-6">
                        <div className="hasis-card bg-white p-8 h-full flex flex-col">
                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-hasis-text-primary">Self-Declared Skills</h2>
                                <p className="text-sm text-hasis-text-secondary mt-1">Add skills you currently possess.</p>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold text-hasis-text-primary">Add Your Skills</Label>
                                    <div className="relative">
                                        <Input
                                            id="newSkill"
                                            placeholder="Type a skill..."
                                            value={formData.newSkill}
                                            onChange={handleChange}
                                            className="hasis-input pr-12"
                                            onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                                        />
                                        <button onClick={addSkill} className="absolute right-2 top-2 p-2 hover:bg-gray-100 rounded-lg text-hasis-text-secondary">
                                            <Plus className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="space-y-2 overflow-y-auto max-h-[250px] pr-2">
                                        {formData.skills.map((skill) => (
                                            <div key={skill} className="flex items-center justify-between p-3 bg-hasis-green-pale border border-hasis-green/10 rounded-xl">
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-hasis-green" />
                                                    <span className="text-sm font-semibold text-hasis-text-primary">{skill}</span>
                                                </div>
                                                <button onClick={() => removeSkill(skill)} className="text-hasis-text-secondary hover:text-red-500">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
                <div className="w-full max-w-2xl bg-white hasis-card p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="text-center space-y-2">
                        <CheckCircle2 className="w-16 h-16 text-hasis-green mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-hasis-text-primary">Ready to Launch?</h2>
                        <p className="text-hasis-text-secondary">Confirm your details and start your journey</p>
                    </div>

                    <div className="bg-hasis-page-bg rounded-2xl p-6 space-y-4 border border-hasis-border">
                        <div className="flex justify-between items-center border-b border-hasis-border pb-3">
                            <span className="text-hasis-text-secondary font-medium">Account</span>
                            <span className="font-bold text-hasis-text-primary">{formData.username}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-hasis-border pb-3">
                            <span className="text-hasis-text-secondary font-medium">Target Domains</span>
                            <span className="font-bold text-hasis-text-primary">{formData.domains.length} selected</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-hasis-text-secondary font-medium">Experience</span>
                            <span className="font-bold text-hasis-text-primary">{formData.experience_level}</span>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button variant="outline" onClick={prevStep} className="flex-1 h-14 border-hasis-border font-bold">Review Steps</Button>
                        <Button onClick={handleSubmit} disabled={loading} className="flex-[2] hasis-button-primary h-14 text-lg">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : 'Complete Setup'}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

