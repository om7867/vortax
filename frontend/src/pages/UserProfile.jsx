import { useState, useEffect } from 'react';
import api from '../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs'; // Need to create Tabs or use standard
import { User, Award, FileText, Briefcase, MapPin, Calendar, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function UserProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/profile/unified');
                setProfile(response.data);
            } catch (error) {
                console.error("Failed to load profile", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading profile...</div>;
    if (!profile) return <div className="p-8 text-center text-red-500">Failed to load profile.</div>;

    const { user, stats, skills, certifications, achievements } = profile;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* Header Card */}
                <Card className="border-0 shadow-md bg-white overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                    <div className="px-8 pb-8">
                        <div className="relative flex justify-between items-end -mt-12 mb-6">
                            <div className="flex items-end gap-6">
                                <div className="w-24 h-24 bg-white rounded-full p-1 shadow-lg">
                                    <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-3xl font-bold">
                                        {user.full_name?.charAt(0) || user.username.charAt(0)}
                                    </div>
                                </div>
                                <div className="mb-1">
                                    <h1 className="text-2xl font-bold text-gray-900">{user.full_name || user.username}</h1>
                                    <p className="text-gray-500 flex items-center gap-2">
                                        <Briefcase className="w-4 h-4" /> {user.target_domain} Enthusiast
                                        <span className="mx-1">•</span>
                                        <MapPin className="w-4 h-4" /> Global
                                    </p>
                                </div>
                            </div>
                            <Button>Edit Profile</Button>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-4 gap-4 border-t pt-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">{stats.total_skills}</div>
                                <div className="text-xs text-gray-500 uppercase tracking-wide">Skills</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">{stats.verified_skills}</div>
                                <div className="text-xs text-gray-500 uppercase tracking-wide">Verified</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">{stats.certifications}</div>
                                <div className="text-xs text-gray-500 uppercase tracking-wide">Certifications</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">{stats.achievements}</div>
                                <div className="text-xs text-gray-500 uppercase tracking-wide">Badges</div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Main Content Tabs */}
                {/* Since we don't have a Tabs component yet, we'll just stack sections for now or simple visibility toggle */}
                {/* Actually, user requested "All this in the pages". Stacking is better for "Standard Profile" look */}

                <div className="grid md:grid-cols-3 gap-6">

                    {/* Left Column: Skills */}
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Award className="w-5 h-5 text-blue-600" /> Skills & Expertise
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {skills.map((skill) => (
                                        <Badge
                                            key={skill.name}
                                            className={`
                                                px-3 py-1 text-sm border-2
                                                ${skill.verified ? 'border-green-100 bg-green-50 text-green-700 hover:bg-green-100' : 'border-gray-100 bg-gray-50 text-gray-700 hover:bg-gray-100'}
                                            `}
                                        >
                                            {skill.verified && <CheckCircle className="w-3 h-3 mr-1 inline" />}
                                            {skill.name} <span className="ml-1 opacity-60">• Lvl {skill.level}</span>
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-purple-600" /> Certifications
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {certifications.length === 0 && <p className="text-gray-500 italic">No certifications yet.</p>}
                                    {certifications.map((cert) => (
                                        <div key={cert.id} className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg border border-gray-100">
                                            <div className="bg-white p-2 rounded-md shadow-sm border">
                                                <Award className="w-8 h-8 text-yellow-500" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{cert.title}</h4>
                                                <p className="text-sm text-gray-600">{cert.issuer}</p>
                                                <p className="text-xs text-gray-400 mt-1">Issued: {cert.date}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Achievements & Badges */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Award className="w-5 h-5 text-yellow-500" /> Achievements
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 gap-4">
                                    {achievements.map((ach) => (
                                        <div key={ach.id} className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-100 rounded-lg">
                                            <div className="bg-white p-2 rounded-full shadow-sm text-2xl">
                                                {/* Simple icon mapping */}
                                                {ach.icon === 'rocket' ? '🚀' : ach.icon === 'medal' ? '🏅' : '🏆'}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-800">{ach.title}</div>
                                                <div className="text-xs text-gray-500">{ach.description}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </div>

            </div>
        </div>
    );
}
