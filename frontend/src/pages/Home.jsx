import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
    Sprout,
    Briefcase,
    BarChart,
    CheckCircle,
    ArrowRight,
    Play,
    TrendingUp,
    Target,
    Lightbulb
} from 'lucide-react';

const Home = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <img src="/logo.png" alt="PathIQ Logo" className="h-12 w-auto object-contain" />
                            {/* 
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-green-500">
                                PathIQ
                            </span> 
                            */}
                        </div>

                        <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-600">
                            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
                            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How it Works</a>
                            <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
                        </div>

                        <div className="flex items-center gap-4">
                            <Link to="/login">
                                <Button variant="ghost" className="font-semibold text-gray-600">Login</Button>
                            </Link>
                            <Link to="/signup">
                                <Button className="font-semibold bg-blue-600 hover:bg-blue-700">Sign Up</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-gradient-to-bl from-blue-50 to-white opacity-50 blur-3xl"></div>
                <div className="absolute top-20 left-10 -z-10 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute top-40 right-10 -z-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center lg:text-left">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
                        {/* Left Content */}
                        <div className="space-y-8">
                            <Badge variant="secondary" className="px-3 py-1 text-blue-700 bg-blue-50 border-blue-100 mb-4 rounded-full">
                                ✨ #1 Career Intelligence Platform
                            </Badge>
                            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.15]">
                                Cultivate Your Future with <span className="text-green-600">PathIQ</span> Intelligence
                            </h1>
                            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                The holistic platform connecting skills across Agriculture, Healthcare, and Smart Cities. Track your growth, identify gaps, and get AI-powered career guidance.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link to="/signup">
                                    <Button size="lg" className="w-full sm:w-auto px-8 h-12 text-base shadow-lg shadow-green-200 bg-green-600 hover:bg-green-700">
                                        Get Started Free
                                    </Button>
                                </Link>
                                <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 h-12 text-base border-gray-200 hover:bg-gray-50 group">
                                    <Play className="mr-2 h-4 w-4 fill-current group-hover:text-green-600" /> Watch Demo
                                </Button>
                            </div>

                            <div className="flex items-center justify-center lg:justify-start gap-8 pt-4 text-sm text-gray-500 font-medium">
                                <div className="flex items-center gap-2">
                                    <UsersIcon className="h-5 w-5 text-green-500" /> 10,000+ Users
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-green-500" /> 500+ Skills Tracked
                                </div>
                            </div>
                        </div>

                        {/* Right Image */}
                        <div className="mt-16 lg:mt-0 relative group perspective-1000">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-purple-400 rounded-2xl opacity-20 blur-2xl group-hover:opacity-30 transition-opacity"></div>
                            <img
                                src="/hero.png"
                                alt="Dashboard Preview"
                                className="relative rounded-2xl shadow-2xl border border-gray-100/50 backdrop-blur-sm transform transition-transform hover:scale-[1.02] duration-500"
                            />

                            {/* Floating Cards Mockup Overlay */}
                            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-gray-100 animate-bounce-slow hidden md:block">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <Target className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Readiness Score</p>
                                        <p className="text-lg font-bold text-gray-900">85%</p>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-xl border border-gray-100 animate-bounce-slow animation-delay-1000 hidden md:block">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <TrendingUp className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Growth</p>
                                        <p className="text-lg font-bold text-gray-900">+24%</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">Why Choose PathIQ</h2>
                        <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Unlock Your Career Success
                        </p>
                        <p className="mt-4 text-lg text-gray-500">
                            AI-powered intelligence for the health, agriculture, and urban sectors.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<BarChart className="h-6 w-6 text-green-600" />}
                            title="Gap Analysis"
                            desc="Identify your skill gaps and compare with industry requirements to stay ahead."
                        />
                        <FeatureCard
                            icon={<Lightbulb className="h-6 w-6 text-yellow-500" />}
                            title="Smart Recommendations"
                            desc="Get personalized career and learning paths based on your current skills and goals."
                        />
                        <FeatureCard
                            icon={<Target className="h-6 w-6 text-blue-500" />}
                            title="Progress Tracking"
                            desc="Monitor your growth with detailed analytics and real-time readiness scores."
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-green-600">
                <div className="max-w-4xl mx-auto text-center px-4">
                    <h2 className="text-3xl font-bold text-white mb-6">Ready to grow your future?</h2>
                    <p className="text-green-100 text-lg mb-8">Join thousands of professionals mastering their future with PathIQ.</p>
                    <Link to="/signup">
                        <Button size="lg" variant="secondary" className="px-10 h-12 text-green-700 font-bold bg-white hover:bg-gray-100">
                            Get Started Now
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white py-12 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center opacity-70">
                    <div className="flex items-center gap-2 mb-4 md:mb-0">
                        <img src="/logo.png" alt="PathIQ Logo" className="h-6 w-auto object-contain" />
                        <span className="font-bold text-gray-900">PathIQ</span>
                    </div>
                    <p className="text-sm text-gray-500">© 2026 PathIQ Inc. All rights reserved.</p>
                    <div className="flex gap-6 text-sm text-gray-500">
                        <a href="#" className="hover:text-gray-900">Privacy</a>
                        <a href="#" className="hover:text-gray-900">Terms</a>
                        <a href="#" className="hover:text-gray-900">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <Card className="border border-gray-100 hover:shadow-xl transition-shadow duration-300">
        <CardContent className="p-8">
            <div className="h-12 w-12 rounded-xl bg-gray-50 flex items-center justify-center mb-6">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
            <p className="text-gray-500 leading-relaxed">
                {desc}
            </p>
        </CardContent>
    </Card>
);

const UsersIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
);

export default Home;
