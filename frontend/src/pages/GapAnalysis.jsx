import { useState, useEffect } from 'react';
import api from '../services/api';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

export default function GapAnalysis() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/skillpath/gap-analysis');
                setData(response.data);
            } catch (error) {
                console.error("Failed to load gap analysis", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading analysis...</div>;
    if (!data) return <div className="p-8 text-center text-red-500">Failed to load data.</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6 space-y-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Skill Gap Analysis</h1>
                        <p className="text-gray-500 mt-1">
                            Target Career: <span className="font-semibold text-blue-600">{data.career_target}</span>
                        </p>
                    </div>
                    <Link to="/recommendations">
                        <Button className="bg-green-600 hover:bg-green-700">
                            View Study Plan <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 gap-8">

                    {/* Radar Chart Card */}
                    <Card className="shadow-lg h-[500px]">
                        <CardHeader>
                            <CardTitle>Skill Radar</CardTitle>
                        </CardHeader>
                        <CardContent className="h-full pb-12">
                            <ResponsiveContainer width="100%" height="90%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.radar_data}>
                                    <PolarGrid />
                                    <PolarAngleAxis dataKey="skill" />
                                    <PolarRadiusAxis angle={30} domain={[0, 10]} />
                                    <Radar name="My Skills" dataKey="current" stroke="#2563eb" fill="#2563eb" fillOpacity={0.6} />
                                    <Radar name="Required" dataKey="required" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} />
                                    <Legend />
                                </RadarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Insights Panel */}
                    <div className="space-y-6">
                        {/* Overall Readiness */}
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Role Readiness Score</h3>
                                <div className="flex items-end gap-2 mb-2">
                                    <span className="text-4xl font-bold text-blue-600">{Math.round(data.overall_readiness)}%</span>
                                    <span className="text-gray-400 mb-1">Match for {data.career_target}</span>
                                </div>
                                <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-1000 ${data.overall_readiness > 70 ? 'bg-green-500' :
                                                data.overall_readiness > 40 ? 'bg-yellow-500' : 'bg-red-500'
                                            }`}
                                        style={{ width: `${data.overall_readiness}%` }}
                                    ></div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Skill Gap Bar Chart (Red/Green) */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Skill Gaps (Green=Achieved, Red=Missing)</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {data.radar_data.map((item) => (
                                    <div key={item.skill}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium">{item.skill}</span>
                                            <span className="text-gray-500">{item.current}/{item.required}</span>
                                        </div>
                                        <div className="flex h-3 rounded-full overflow-hidden bg-gray-100">
                                            {/* Green Bar (Current Level) */}
                                            <div
                                                className="bg-green-500"
                                                style={{ width: `${(item.current / 10) * 100}%` }}
                                            />
                                            {/* Red Bar (Gap) */}
                                            {item.required > item.current && (
                                                <div
                                                    className="bg-red-500 opacity-80"
                                                    style={{ width: `${((item.required - item.current) / 10) * 100}%` }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Career Roadmap */}
                        <Card className="bg-blue-50 border-blue-100">
                            <CardHeader>
                                <CardTitle className="text-blue-800 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5" /> Career Roadmap
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4 relative pl-4 border-l-2 border-blue-200">
                                    {data.critical_missing.length > 0 ? (
                                        <>
                                            <div className="relative">
                                                <span className="absolute -left-[21px] top-1 w-3 h-3 bg-blue-500 rounded-full"></span>
                                                <h4 className="font-bold text-gray-800 text-sm">Step 1: Foundation</h4>
                                                <p className="text-sm text-gray-600">Learn <span className="font-semibold text-red-600">{data.critical_missing[0]}</span> to close critical gap.</p>
                                            </div>
                                            <div className="relative">
                                                <span className="absolute -left-[21px] top-1 w-3 h-3 bg-blue-300 rounded-full"></span>
                                                <h4 className="font-bold text-gray-800 text-sm">Step 2: Apply Skills</h4>
                                                <p className="text-sm text-gray-600">Complete a project using {data.critical_missing[0]}.</p>
                                            </div>
                                            <div className="relative">
                                                <span className="absolute -left-[21px] top-1 w-3 h-3 bg-blue-200 rounded-full"></span>
                                                <h4 className="font-bold text-gray-800 text-sm">Step 3: Certification</h4>
                                                <p className="text-sm text-gray-600">Earn a certificate to boost your score.</p>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-green-600 font-medium">You are ready! Apply for jobs now.</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </div>
        </div>
    );
}
