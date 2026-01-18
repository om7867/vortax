import { useState, useEffect } from 'react';
import profileV2Service from '../services/profileV2';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import {
    User,
    Award,
    FileText,
    Briefcase,
    MapPin,
    Calendar,
    CheckCircle,
    AlertCircle,
    PlusCircle,
    ExternalLink,
    BookOpen,
    Trophy
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Dialog } from '../components/ui/dialog';
import ProfileForm from '../components/profile/ProfileForm';
import SkillManager from '../components/profile/SkillManager';
import CertificationForm from '../components/profile/CertificationForm';

export default function UserProfile() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal states
    const [activeModal, setActiveModal] = useState(null); // 'profile', 'skill', 'certification'

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const fullProfile = await profileV2Service.getFullProfile();
            setData(fullProfile);
            setError(null);
        } catch (err) {
            console.error("Failed to load profile", err);
            if (err.response && err.response.status === 404) {
                setError("NO_PROFILE");
            } else {
                setError("Could not load your profile. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleSuccess = () => {
        setActiveModal(null);
        fetchProfile();
    };

    if (loading) return (
        <div className="min-h-screen bg-hasis-page-bg flex items-center justify-center font-bold">
            <div className="text-center animate-pulse">
                <div className="w-16 h-16 bg-hasis-green-pale rounded-2xl flex items-center justify-center mx-auto mb-4 border border-hasis-green/10">
                    <User className="w-8 h-8 text-hasis-green" />
                </div>
                <p className="text-hasis-text-secondary font-black tracking-widest uppercase text-xs">Syncing Identity Hub...</p>
            </div>
        </div>
    );

    if (error === "NO_PROFILE") {
        return (
            <div className="min-h-screen bg-hasis-page-bg flex items-center justify-center p-6 text-center">
                <div className="max-w-md w-full p-12 rounded-[3rem] shadow-2xl bg-white border border-hasis-border relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-hasis-green-pale rounded-full -mr-16 -mt-16 blur-3xl opacity-50"></div>
                    <div className="w-24 h-24 bg-hasis-green-pale rounded-[2rem] flex items-center justify-center mx-auto mb-8 animate-bounce border border-hasis-green/10">
                        <User className="w-12 h-12 text-hasis-green" />
                    </div>
                    <h2 className="text-4xl font-black mb-4 text-hasis-text-primary tracking-tighter">Identity Required</h2>
                    <p className="text-hasis-text-secondary mb-10 leading-relaxed font-bold italic">
                        "Your skills are waiting for a home. Initialize your PathIQ identity to unlock the intelligence engine."
                    </p>
                    <button className="hasis-button-primary w-full py-5 text-sm" onClick={() => setActiveModal('profile')}>
                        Initialize Professional Profile
                    </button>

                    <Dialog
                        isOpen={activeModal === 'profile'}
                        onClose={() => setActiveModal(null)}
                        title="Create Professional Identity"
                    >
                        <ProfileForm onSuccess={handleSuccess} />
                    </Dialog>
                </div>
            </div>
        );
    }

    if (error) return (
        <div className="min-h-screen bg-hasis-page-bg flex items-center justify-center p-6 font-bold">
            <div className="hasis-card bg-white max-w-md w-full text-center p-12 border-red-100">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-red-900 mb-4 tracking-tight uppercase">System Error</h3>
                <p className="text-red-700 mb-8 italic">"{error}"</p>
                <button className="px-8 py-3 border border-red-200 rounded-xl text-red-600 hover:bg-red-50 transition-all font-black uppercase text-xs tracking-widest" onClick={fetchProfile}>
                    Retry Sync
                </button>
            </div>
        </div>
    );

    const { profile, skills, certifications, completion } = data;

    return (
        <div className="min-h-screen bg-hasis-page-bg p-6 md:p-10">
            {/* Modals */}
            <Dialog
                isOpen={activeModal === 'profile'}
                onClose={() => setActiveModal(null)}
                title="Refine Professional Identity"
            >
                <ProfileForm initialData={profile} onSuccess={handleSuccess} />
            </Dialog>

            <Dialog
                isOpen={activeModal === 'skill'}
                onClose={() => setActiveModal(null)}
                title="Expand Skill Repository"
            >
                <SkillManager onSkillAdded={handleSuccess} />
            </Dialog>

            <Dialog
                isOpen={activeModal === 'certification'}
                onClose={() => setActiveModal(null)}
                title="Record Verified Credentials"
            >
                <CertificationForm onSuccess={handleSuccess} />
            </Dialog>

            <div className="max-w-6xl mx-auto space-y-10">

                {/* Header Card */}
                <div className="hasis-card bg-white p-0 overflow-hidden">
                    <div className="h-48 bg-gradient-to-r from-hasis-green-pale via-hasis-green/20 to-hasis-green-pale relative">
                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                    </div>
                    <div className="px-10 pb-12">
                        <div className="relative flex flex-col md:flex-row justify-between items-center md:items-end -mt-20 mb-10 gap-8">
                            <div className="flex flex-col md:flex-row items-center md:items-end gap-8 text-center md:text-left">
                                <div className="w-44 h-44 bg-white rounded-[2.5rem] p-2 shadow-2xl relative border border-hasis-border/50">
                                    <div className="w-full h-full bg-gradient-to-br from-hasis-green-pale to-white rounded-[2rem] flex items-center justify-center text-hasis-green text-6xl font-black border border-hasis-green/5">
                                        {profile.full_name?.charAt(0) || "U"}
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 bg-hasis-green text-white p-2.5 rounded-2xl shadow-lg border-4 border-white">
                                        <CheckCircle className="w-6 h-6" />
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <h1 className="text-4xl font-black text-hasis-text-primary tracking-tighter">{profile.full_name}</h1>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4 text-hasis-text-secondary font-bold">
                                        <span className="flex items-center gap-2 bg-hasis-green-pale text-hasis-green px-4 py-1.5 rounded-full text-xs uppercase tracking-widest border border-hasis-green/5">
                                            <Briefcase className="w-4 h-4" /> {profile.target_role}
                                        </span>
                                        <span className="flex items-center gap-2 bg-gray-50 text-hasis-text-secondary px-4 py-1.5 rounded-full text-xs uppercase tracking-widest border border-hasis-border">
                                            <BookOpen className="w-4 h-4" /> {profile.education_level}
                                        </span>
                                        <span className="flex items-center gap-2 bg-gray-50 text-hasis-text-secondary px-4 py-1.5 rounded-full text-xs uppercase tracking-widest border border-hasis-border">
                                            <MapPin className="w-4 h-4" /> {profile.location}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button className="px-8 py-3 border border-hasis-border rounded-xl font-bold text-hasis-text-secondary hover:bg-gray-50 transition-all shadow-sm">
                                    Share Profile
                                </button>
                                <button className="hasis-button-primary px-8" onClick={() => setActiveModal('profile')}>
                                    Edit Identity
                                </button>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-hasis-border">
                            <div className="bg-gray-50/50 p-8 rounded-3xl text-center border border-hasis-border group hover:bg-white hover:shadow-xl transition-all duration-500">
                                <div className="text-4xl font-black text-hasis-text-primary mb-2 tracking-tighter">{skills.length}</div>
                                <div className="text-[10px] font-black text-hasis-text-secondary uppercase tracking-[0.2em]">Total Skills</div>
                            </div>
                            <div className="bg-hasis-green-pale/30 p-8 rounded-3xl text-center border border-hasis-green/5 group hover:bg-hasis-green-pale hover:shadow-xl transition-all duration-500">
                                <div className="text-4xl font-black text-hasis-green mb-2 tracking-tighter">
                                    {skills.filter(s => s.verified).length}
                                </div>
                                <div className="text-[10px] font-black text-hasis-green uppercase tracking-[0.2em]">Verified</div>
                            </div>
                            <div className="bg-gray-50/50 p-8 rounded-3xl text-center border border-hasis-border group hover:bg-white hover:shadow-xl transition-all duration-500">
                                <div className="text-4xl font-black text-hasis-text-primary mb-2 tracking-tighter">{certifications.length}</div>
                                <div className="text-[10px] font-black text-hasis-text-secondary uppercase tracking-[0.2em]">Certificates</div>
                            </div>
                            <div className="bg-amber-50/30 p-8 rounded-3xl text-center border border-amber-100/50 group hover:bg-amber-50 hover:shadow-xl transition-all duration-500">
                                <div className="text-4xl font-black text-amber-600 mb-2 tracking-tighter">{completion.profile_score}%</div>
                                <div className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em]">Profile Match</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-10">
                    {/* Left/Middle Column */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Completion Warning */}
                        {completion.profile_score < 100 && (
                            <div className="bg-amber-50 border border-amber-100 rounded-[2.5rem] overflow-hidden p-8 flex items-start gap-6 relative shadow-sm">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-100 rounded-full -mr-12 -mt-12 blur-2xl opacity-50"></div>
                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-amber-100 shrink-0">
                                    <Trophy className="w-8 h-8 text-amber-500" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="font-black text-amber-900 text-xl tracking-tight uppercase">Enhance Hub Strategy</h3>
                                        <span className="text-amber-700 font-black bg-white px-4 py-1 rounded-full text-xs border border-amber-100 shadow-sm">
                                            {completion.profile_score}% Complete
                                        </span>
                                    </div>
                                    <div className="h-2 w-full bg-amber-100/50 rounded-full overflow-hidden mb-6">
                                        <div className="h-full bg-amber-500 transition-all duration-1000" style={{ width: `${completion.profile_score}%` }}></div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {completion.missing_sections.map(sec => (
                                            <span key={sec} className="bg-white/80 border border-amber-200 text-amber-700 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg">
                                                + {sec}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Skills Section */}
                        <div className="hasis-card bg-white p-10">
                            <div className="flex flex-row items-center justify-between mb-10">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-hasis-green-pale rounded-2xl border border-hasis-green/5">
                                        <Award className="w-8 h-8 text-hasis-green" />
                                    </div>
                                    <h2 className="text-2xl font-black text-hasis-text-primary tracking-tighter">Skill Repository</h2>
                                </div>
                                <button className="px-6 py-3 border border-hasis-border rounded-xl font-bold text-hasis-text-secondary hover:bg-gray-50 flex items-center gap-2 transition-all shadow-sm" onClick={() => setActiveModal('skill')}>
                                    <PlusCircle className="w-4 h-4" /> Add Asset
                                </button>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-6">
                                {skills.length === 0 && (
                                    <div className="col-span-2 text-center py-16 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-hasis-border">
                                        <p className="text-hasis-text-secondary font-bold italic">"No skills indexed yet. Showcase your expertise to the engine."</p>
                                    </div>
                                )}
                                {skills.map((skill) => (
                                    <div key={skill.id} className="p-6 border border-hasis-border rounded-2xl hover:border-hasis-green/20 transition-all duration-300 flex justify-between items-center bg-white group hover:shadow-xl hover:shadow-hasis-green/5">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <h4 className="font-black text-hasis-text-primary group-hover:text-hasis-green transition-colors uppercase tracking-tight">{skill.skill_name}</h4>
                                                {skill.verified && (
                                                    <span className="bg-hasis-green text-white text-[8px] px-2 py-0.5 rounded-md font-black uppercase tracking-widest">
                                                        Verified
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3 text-[9px] text-hasis-text-secondary font-black uppercase tracking-[0.2em]">
                                                <span>{skill.skill_domain}</span>
                                                <span className="text-gray-300">•</span>
                                                <span>{skill.skill_category}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <div className="flex items-center gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <div key={i} className={`w-2 h-4 rounded-[3px] transition-all duration-500 ${i < skill.self_rating ? 'bg-hasis-green shadow-[0_0_8px_rgba(46,125,50,0.3)]' : 'bg-gray-100'}`} />
                                                ))}
                                            </div>
                                            <span className="text-[9px] text-hasis-text-secondary font-black uppercase tracking-widest">Mastery {skill.self_rating}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Certifications Section */}
                        <div className="hasis-card bg-white p-10">
                            <div className="flex flex-row items-center justify-between mb-10">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-hasis-green-pale rounded-2xl border border-hasis-green/5">
                                        <FileText className="w-8 h-8 text-hasis-green" />
                                    </div>
                                    <h2 className="text-2xl font-black text-hasis-text-primary tracking-tighter">Credentials Hub</h2>
                                </div>
                                <button className="px-6 py-3 border border-hasis-border rounded-xl font-bold text-hasis-text-secondary hover:bg-gray-50 flex items-center gap-2 transition-all shadow-sm" onClick={() => setActiveModal('certification')}>
                                    <PlusCircle className="w-4 h-4" /> Add Certificate
                                </button>
                            </div>
                            <div className="space-y-6">
                                {certifications.length === 0 && (
                                    <div className="text-center py-16 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-hasis-border">
                                        <p className="text-hasis-text-secondary font-bold italic">"No verified credentials yet. Time to validate your mastery."</p>
                                    </div>
                                )}
                                {certifications.map((cert) => (
                                    <div key={cert.id} className="flex flex-col lg:flex-row gap-8 p-8 bg-white border border-hasis-border rounded-[2.5rem] hover:shadow-2xl hover:shadow-hasis-green/5 transition-all duration-500 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 h-1.5 w-32 bg-hasis-green/20"></div>
                                        <div className="w-20 h-20 bg-gray-50 rounded-[1.5rem] flex items-center justify-center text-hasis-green flex-shrink-0 group-hover:bg-hasis-green group-hover:text-white transition-all duration-500 border border-hasis-border/50">
                                            <Award className="w-10 h-10" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                <div>
                                                    <h4 className="text-xl font-black text-hasis-text-primary group-hover:text-hasis-green transition-colors uppercase tracking-tight">{cert.name}</h4>
                                                    <p className="font-bold text-hasis-text-secondary flex items-center gap-2 mt-2">
                                                        {cert.issuing_organization}
                                                        <span className="text-gray-300">•</span>
                                                        <span className="text-[10px] text-hasis-green font-black uppercase tracking-widest">{cert.domain}</span>
                                                    </p>
                                                </div>
                                                {cert.verification_url && (
                                                    <a
                                                        href={cert.verification_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 text-[10px] font-black text-hasis-green bg-hasis-green-pale hover:bg-hasis-green hover:text-white px-6 py-3 rounded-xl transition-all border border-hasis-green/10 shadow-sm uppercase tracking-widest"
                                                    >
                                                        Verify Credential <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                )}
                                            </div>
                                            <div className="mt-8 flex flex-wrap gap-8 text-[9px] text-hasis-text-secondary font-black uppercase tracking-[0.2em]">
                                                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-hasis-border">
                                                    <Calendar className="w-3.5 h-3.5 text-hasis-green/60" />
                                                    Issued: {new Date(cert.issue_date).toLocaleDateString()}
                                                </div>
                                                {cert.expiry_date && (
                                                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-hasis-border">
                                                        <Calendar className="w-3.5 h-3.5 text-hasis-green/60" />
                                                        Expires: {new Date(cert.expiry_date).toLocaleDateString()}
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-hasis-border">
                                                    <AlertCircle className="w-3.5 h-3.5 text-hasis-green/60" />
                                                    ID: {cert.credential_id || "UNREGISTERED"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sidebar */}
                    <div className="space-y-10">
                        {/* Career Goals */}
                        <div className="hasis-card bg-white p-10">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-hasis-green-pale rounded-2xl border border-hasis-green/5">
                                    <Target className="w-8 h-8 text-hasis-green" />
                                </div>
                                <h2 className="text-2xl font-black text-hasis-text-primary tracking-tighter uppercase tracking-tight">Hub Strategy</h2>
                            </div>
                            <div className="space-y-8">
                                <div className="bg-gray-50/50 p-6 rounded-2xl border border-hasis-border group hover:bg-white transition-all duration-300">
                                    <label className="text-[10px] font-black text-hasis-green uppercase tracking-[0.2em] mb-2 block">Primary Mission</label>
                                    <p className="font-bold text-hasis-text-primary italic">"{profile.career_goals || 'Mission Pending Deployment'}"</p>
                                </div>
                                <div className="bg-gray-50/50 p-6 rounded-2xl border border-hasis-border group hover:bg-white transition-all duration-300">
                                    <label className="text-[10px] font-black text-hasis-green uppercase tracking-[0.2em] mb-2 block">Target Domain</label>
                                    <p className="font-bold text-hasis-text-primary uppercase tracking-tight">{profile.target_domain}</p>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-hasis-text-secondary uppercase tracking-[0.2em] block ml-1">Learning Preferences</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['Visual', 'Practical', 'Interactive'].map(p => (
                                            <div key={p} className="bg-white border border-hasis-border px-4 py-3 rounded-xl flex items-center gap-3 group hover:border-hasis-green/20 transition-all cursor-default text-[10px] font-black text-hasis-text-secondary uppercase tracking-widest">
                                                <div className="w-2 h-2 rounded-full bg-hasis-green/20 group-hover:bg-hasis-green transition-colors"></div>
                                                <span>{p}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="hasis-card bg-hasis-text-primary p-1 text-white overflow-hidden shadow-2xl">
                            <div className="bg-hasis-text-primary p-10 relative">
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-hasis-green blur-3xl opacity-20"></div>
                                <h3 className="text-xl font-black mb-6 tracking-tight uppercase">System Settings</h3>
                                <div className="space-y-4">
                                    <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all group">
                                        <span className="flex items-center gap-4 text-sm font-bold opacity-80 group-hover:opacity-100 uppercase tracking-widest">
                                            <Mail className="w-5 h-5" /> Notification Hub
                                        </span>
                                        <div className="w-10 h-6 bg-hasis-green/20 rounded-full relative">
                                            <div className="absolute right-1 top-1 w-4 h-4 bg-hasis-green rounded-full"></div>
                                        </div>
                                    </button>
                                    <button className="w-full flex items-center gap-4 p-4 text-sm font-bold text-white/60 hover:text-white hover:bg-white/5 rounded-2xl transition-all uppercase tracking-widest">
                                        <Lock className="w-5 h-5" /> Privacy Shield
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
