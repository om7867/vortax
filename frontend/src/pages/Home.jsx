import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Brain,
    Target,
    ArrowRight,
    Zap,
    ShieldCheck,
    LineChart,
    Globe,
    Search,
    ChevronDown,
    PlayCircle
} from 'lucide-react';

const Home = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-white font-sans text-hasis-text-primary selection:bg-hasis-green/20">

            {/* Nav: Glassmorphic Precision */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'py-4 bg-white/70 backdrop-blur-2xl border-b border-hasis-green/5 shadow-sm' : 'py-8 bg-transparent'}`}>
                <div className="max-w-[1400px] mx-auto px-8 flex justify-between items-center font-bold tracking-tight">
                    <div className="flex items-center gap-3 group px-4 py-2 bg-hasis-green-pale/30 rounded-full border border-hasis-green/5 hover:bg-white hover:border-hasis-green/20 transition-all duration-500 cursor-pointer">
                        <div className="w-8 h-8 bg-hasis-text-primary rounded-lg flex items-center justify-center text-hasis-green group-hover:bg-hasis-green group-hover:text-white transition-all">
                            <Brain className="w-5 h-5" />
                        </div>
                        <span className="text-xl font-black uppercase tracking-tighter text-hasis-text-primary">PathIQ</span>
                    </div>

                    <div className="hidden lg:flex items-center gap-12 text-[11px] font-black uppercase tracking-[0.2em] text-hasis-text-secondary/60">
                        <a href="#intelligence" className="hover:text-hasis-green transition-colors">Intelligence Hub</a>
                        <a href="#ecosystem" className="hover:text-hasis-green transition-colors">Ecosystem</a>
                        <a href="#" className="hover:text-hasis-green transition-colors">Infrastructure</a>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link to="/login" className="text-[11px] font-black uppercase tracking-[0.2em] text-hasis-text-primary hover:text-hasis-green transition-colors pr-6 border-r border-hasis-border">
                            Access Portal
                        </Link>
                        <Link to="/signup" className="hasis-button-primary px-8 py-3.5 text-[10px] hidden sm:flex">
                            Initialize Identity <ArrowRight className="ml-3 w-4 h-4 opacity-50 group-hover:ml-5 transition-all" />
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero: The Intelligence Genesis */}
            <main className="relative pt-48 pb-32 overflow-hidden">
                {/* Background Architecture */}
                <div className="absolute top-0 right-0 w-[60%] h-full bg-hasis-green-pale/20 -z-10 rounded-l-[10rem] blur-3xl opacity-50 transform translate-x-20"></div>
                <div className="absolute top-1/2 left-0 w-96 h-96 bg-hasis-green/5 -z-10 rounded-full blur-3xl opacity-30 transform -translate-x-1/2"></div>

                {/* Decorative Pattern */}
                <div className="absolute top-40 right-20 w-80 h-80 border-[40px] border-hasis-green/5 rounded-[5rem] -rotate-12 -z-10 opacity-40"></div>

                <div className="max-w-[1400px] mx-auto px-8 relative">
                    <div className="max-w-4xl space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-hasis-green-pale/50 rounded-full border border-hasis-green/10">
                            <Zap className="w-4 h-4 text-hasis-green fill-hasis-green" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-hasis-green shadow-[0_0_15px_rgba(46,125,50,0.1)]">Next-Gen Career Intelligence Platform</span>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-black text-hasis-text-primary tracking-tighter leading-[0.9] uppercase">
                            Architecture for <br />
                            <span className="text-hasis-green italic pr-4">Professional</span>
                            Mastery.
                        </h1>

                        <p className="text-xl md:text-2xl font-bold text-hasis-text-secondary leading-relaxed max-w-2xl italic">
                            "PathIQ synchronizes your existing skill repository with global industry benchmarks, constructing an immutable roadmap to career leadership."
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 pt-6">
                            <Link to="/signup" className="hasis-button-primary px-12 py-5 text-sm flex items-center justify-center gap-4 group">
                                Standard Initiation <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform opacity-50" />
                            </Link>
                            <button className="px-12 py-5 bg-white border border-hasis-border rounded-2xl font-black uppercase tracking-widest text-xs text-hasis-text-secondary hover:border-hasis-green/30 hover:text-hasis-text-primary transition-all flex items-center justify-center gap-3 group">
                                <PlayCircle className="w-6 h-6 text-hasis-green group-hover:scale-110 transition-transform" />
                                Review Operations Demo
                            </button>
                        </div>
                    </div>

                    {/* Dashboard Preview: Floating Majesty */}
                    <div className="mt-24 relative animate-in fade-in slide-in-from-right-12 duration-1000 delay-300">
                        <div className="hasis-card bg-white p-2 border-hasis-green/5 shadow-2xl shadow-hasis-green/10 rounded-[3rem] overflow-hidden transform rotate-2 hover:rotate-0 transition-all duration-700 cursor-pointer group">
                            <div className="bg-gray-50 rounded-[2.5rem] overflow-hidden">
                                <img src="/hero.png" alt="Intelligence Terminal" className="w-full h-auto opacity-90 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>

                        {/* Floating Interaction Nodes */}
                        <div className="absolute -left-12 top-1/4 p-6 hasis-card bg-white border-hasis-green shadow-xl animate-bounce-slow">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-hasis-green-pale rounded-2xl flex items-center justify-center text-hasis-green mb-0">
                                    <Target className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-hasis-text-secondary uppercase tracking-widest">Readiness Vector</div>
                                    <div className="text-2xl font-black text-hasis-text-primary">0.94 <span className="text-[10px] opacity-40">Σ</span></div>
                                </div>
                            </div>
                        </div>

                        <div className="absolute -right-8 bottom-1/4 p-6 hasis-card bg-hasis-text-primary border-transparent shadow-2xl animate-fade-in-up">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-hasis-green mb-0">
                                    <LineChart className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">Growth Velocity</div>
                                    <div className="text-2xl font-black text-hasis-green">+24.8%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Features: The Architecture Sections */}
            <section id="intelligence" className="py-32 bg-gray-50/50 relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-hasis-green/10 to-transparent"></div>

                <div className="max-w-[1400px] mx-auto px-8">
                    <div className="grid lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-1 space-y-6">
                            <div className="text-xs font-black text-hasis-green uppercase tracking-[0.4em] mb-4">Core Infrastructure</div>
                            <h2 className="text-5xl font-black text-hasis-text-primary tracking-tighter uppercase leading-[0.9]">Intelligence <br />Modules.</h2>
                            <p className="text-lg font-bold text-hasis-text-secondary italic leading-relaxed">
                                "The PathIQ ecosystem is built on three primary logic pillars, designed to minimize entropy in career progression."
                            </p>
                        </div>

                        <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
                            <FeatureNode
                                icon={<Search className="w-8 h-8 text-hasis-green" />}
                                title="Node Gap Analysis"
                                desc="Identification of missing skill vertices across Healthcare, Agri-tech, and Smart Infrastructure."
                            />
                            <FeatureNode
                                icon={<Brain className="w-8 h-8 text-amber-500" />}
                                title="Sync Recommendations"
                                desc="AI-driven resource mapping that aligns your identity with high-readiness career paths."
                            />
                            <FeatureNode
                                icon={<Globe className="w-8 h-8 text-blue-500" />}
                                title="Global Standards"
                                desc="Universal compatibility reporting using decentralized competency benchmarks."
                            />
                            <FeatureNode
                                icon={<ShieldCheck className="w-8 h-8 text-hasis-green" />}
                                title="Verified Identity"
                                desc="Construct a tamper-proof professional repository that commands market value."
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA: Finalizing Synchronicity */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-hasis-text-primary -z-10"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-hasis-green rounded-full blur-[120px] opacity-10 -mr-48 -mt-48"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-hasis-green rounded-full blur-[100px] opacity-10 -ml-40 -mb-40"></div>

                <div className="max-w-4xl mx-auto text-center px-8">
                    <h2 className="text-5xl font-black text-white tracking-tighter uppercase mb-8 leading-tight">
                        Integrate With The <br />Professional Hub.
                    </h2>
                    <p className="text-xl font-bold text-white/50 italic mb-12 max-w-2xl mx-auto leading-relaxed">
                        "Your current professional state is a precursor. PathIQ is the bridge. Begin the transformation sequence now."
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                        <Link to="/signup" className="hasis-button-primary px-16 py-6 text-sm flex items-center gap-4 w-full sm:w-auto">
                            Initialize Setup <ArrowRight className="w-5 h-5 opacity-50" />
                        </Link>
                        <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Identity Hub is online (99.9% Up)</div>
                    </div>
                </div>
            </section>

            {/* Footer: Terminal Finalization */}
            <footer className="py-16 bg-white border-t border-hasis-border">
                <div className="max-w-[1400px] mx-auto px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-12 opacity-50 group transition-opacity hover:opacity-100">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-hasis-text-primary rounded-xl flex items-center justify-center text-hasis-green">
                                <Brain className="w-6 h-6" />
                            </div>
                            <span className="text-xl font-black tracking-tighter uppercase">PathIQ</span>
                        </div>

                        <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.2em] text-hasis-text-secondary">
                            <a href="#" className="hover:text-hasis-green transition-colors">Privacy Infrastructure</a>
                            <a href="#" className="hover:text-hasis-green transition-colors">Safety Protocols</a>
                            <a href="#" className="hover:text-hasis-green transition-colors">Terminal Hub</a>
                        </div>

                        <p className="text-[10px] font-black text-hasis-text-secondary uppercase tracking-[0.2em]">
                            © 2026 PathIQ Operations. Established Protocol.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const FeatureNode = ({ icon, title, desc }) => (
    <div className="hasis-card bg-white p-10 group hover:border-hasis-green/20 hover:bg-white hover:translate-y-[-8px] transition-all duration-500">
        <div className="w-16 h-16 bg-hasis-green-pale/50 rounded-2xl flex items-center justify-center mb-8 border border-hasis-green/5 group-hover:bg-hasis-green group-hover:text-white transition-all duration-500 group-hover:scale-110">
            {icon}
        </div>
        <h3 className="text-2xl font-black text-hasis-text-primary tracking-tight uppercase mb-4">{title}</h3>
        <p className="text-hasis-text-secondary font-bold italic leading-relaxed">
            {desc}
        </p>
        <div className="mt-8 pt-6 border-t border-hasis-border w-12 group-hover:w-full group-hover:border-hasis-green/20 transition-all duration-700"></div>
    </div>
);

export default Home;
