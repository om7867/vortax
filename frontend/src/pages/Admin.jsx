import { useState, useEffect } from 'react';
import api from '../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Loader2, Users, Briefcase, GraduationCap, Activity, Shield, Plus, Lock } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

export default function Admin() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Form states
    const [skillName, setSkillName] = useState('');

    const fetchAnalytics = async () => {
        try {
            const response = await api.get('/admin/analytics');
            setData(response.data);
        } catch (err) {
            setError('Failed to load admin analytics. Are you an admin?');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const handleCreateSkill = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/skills', { name: skillName, category: "Technology" });
            setSkillName('');
            fetchAnalytics();
        } catch (err) {
            alert(err.response?.data?.detail || "Failed to create skill");
        }
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-gray-50/50">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
        </div>
    );

    if (error) return (
        <div className="h-screen flex items-center justify-center bg-gray-50">
            <Card className="p-8 text-center max-w-md border-red-100 shadow-xl">
                <Lock className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900">Access Denied</h3>
                <p className="text-gray-500 mt-2">{error}</p>
                <Button className="mt-6" onClick={() => window.location.href = '/'}>Go Home</Button>
            </Card>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50/50 pb-12">
            {/* Admin Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 text-white pb-24 pt-12 px-4 sm:px-6 lg:px-8 shadow-lg">
                <div className="max-w-7xl mx-auto flex items-center gap-4">
                    <div className="bg-white/10 p-3 rounded-xl backdrop-blur-md">
                        <Shield className="w-8 h-8 text-indigo-300" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Admin Command Center</h1>
                        <p className="text-indigo-200 mt-1">System overview, metrics, and content management.</p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 space-y-8">

                {/* Stats Grid */}
                <div className="grid gap-6 md:grid-cols-4">
                    <AdminStatCard icon={<Users className="w-5 h-5 text-blue-600" />} label="Total Users" value={data.metrics?.users} />
                    <AdminStatCard icon={<GraduationCap className="w-5 h-5 text-purple-600" />} label="Skills Tracked" value={data.metrics?.skills} />
                    <AdminStatCard icon={<Briefcase className="w-5 h-5 text-green-600" />} label="Active Careers" value={data.metrics?.careers} />
                    <AdminStatCard icon={<Activity className="w-5 h-5 text-orange-600" />} label="Total Recommendations" value={data.metrics?.recommendations} />
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">

                    {/* Management Section */}
                    <Card className="col-span-4 border-none shadow-md overflow-hidden">
                        <CardHeader className="bg-white border-b border-gray-100">
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-indigo-600" /> Content Management
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">

                            {/* Skill Creation */}
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                        <GraduationCap className="w-4 h-4 text-purple-600" /> Add New Skill
                                    </h3>
                                    <span className="text-xs font-medium px-2 py-0.5 bg-purple-100 text-purple-600 rounded">Tech Category</span>
                                </div>
                                <form onSubmit={handleCreateSkill} className="flex gap-4 items-end">
                                    <div className="flex-1 space-y-1.5">
                                        <Label className="text-xs uppercase text-gray-500 font-bold tracking-wider">Skill Name</Label>
                                        <Input
                                            value={skillName}
                                            onChange={(e) => setSkillName(e.target.value)}
                                            placeholder="e.g., Python, Crop Rotation, urban Planning"
                                            required
                                            className="bg-white border-gray-200 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100">
                                        <Plus className="w-4 h-4 mr-1" /> Add Skill
                                    </Button>
                                </form>
                            </div>

                            {/* Career Placeholder */}
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 opacity-60 relative">
                                <div className="absolute inset-0 flex items-center justify-center z-10">
                                    <span className="bg-white px-3 py-1 rounded-full shadow-sm text-xs font-bold text-gray-500 border border-gray-200">COMING SOON</span>
                                </div>
                                <div className="flex items-center justify-between mb-4 filter blur-[1px]">
                                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                        <Briefcase className="w-4 h-4 text-green-600" /> Add New Career
                                    </h3>
                                </div>
                                <div className="flex gap-4 items-end filter blur-[1px]">
                                    <div className="flex-1 space-y-1.5">
                                        <Label className="text-xs uppercase text-gray-500 font-bold tracking-wider">Career Title</Label>
                                        <Input disabled placeholder="e.g. Agronomist" />
                                    </div>
                                    <Button disabled>Add Career</Button>
                                </div>
                            </div>

                        </CardContent>
                    </Card>

                    {/* Audit Log */}
                    <Card className="col-span-3 border-none shadow-md flex flex-col h-full">
                        <CardHeader className="bg-white border-b border-gray-100">
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="w-5 h-5 text-orange-600" /> Live Audit Log
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 flex-1 bg-white">
                            <div className="divide-y divide-gray-50 max-h-[500px] overflow-y-auto">
                                {data.recent_activity.map((log, i) => (
                                    <div key={i} className="flex items-start p-4 hover:bg-gray-50 transition-colors">
                                        <div className={`mt-1 h-2 w-2 rounded-full ${i === 0 ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                                        <div className="ml-4 flex-1">
                                            <p className="text-sm font-semibold text-gray-900">{log.action}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{log.user}</span>
                                                <span className="text-xs text-gray-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                            </div>
                                            {log.details && (
                                                <code className="block mt-2 text-[10px] bg-indigo-50 text-indigo-700 p-1.5 rounded w-fit max-w-[200px] truncate">
                                                    {JSON.stringify(log.details)}
                                                </code>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

const AdminStatCard = ({ icon, label, value }) => (
    <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
        <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-gray-50 rounded-xl">
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <div className="text-2xl font-bold text-gray-900">{value}</div>
            </div>
        </CardContent>
    </Card>
)
