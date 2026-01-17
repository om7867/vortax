import { useState, useEffect } from 'react';
import api from '../services/api';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { BookOpen, Briefcase, ExternalLink, CheckCircle, Sparkles, TrendingUp, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Recommendations() {
    const [data, setData] = useState({ courses: [], projects: [] });
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [recRes, jobRes] = await Promise.all([
                    api.get('/skillpath/recommendations'),
                    api.get('/skillpath/jobs')
                ]);
                setData(recRes.data);
                setJobs(jobRes.data);
            } catch (error) {
                console.error("Failed to load data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-agri-bg">
                <Loader2 className="h-10 w-10 animate-spin text-agri-green" />
            </div>
        );
    }

    const filteredCourses = activeTab === 'all' || activeTab === 'courses' ? data.courses : [];
    const filteredProjects = activeTab === 'all' || activeTab === 'projects' ? data.projects : [];

    return (
        <div className="min-h-screen bg-agri-bg pb-20 p-6 md:p-12">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-6 h-6 text-agri-yellow" />
                        <h1 className="text-4xl font-bold text-gray-900">Personalized Recommendations</h1>
                    </div>
                    <p className="text-gray-600 text-lg">AI-curated learning paths based on your skill gaps and career goals</p>
                </motion.div>

                {/* Filter Tabs */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex gap-3 flex-wrap"
                >
                    {['all', 'courses', 'projects'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${activeTab === tab
                                ? 'bg-agri-green text-white shadow-lg shadow-green-900/20'
                                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </motion.div>

                {/* High Priority Section */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-3 text-orange-600 font-bold uppercase tracking-wide text-sm"
                    >
                        <span className="text-2xl animate-pulse">🔥</span>
                        <span>High Priority Recommendations</span>
                    </motion.div>

                    {/* Courses */}
                    {filteredCourses.map((course, idx) => (
                        <motion.div
                            key={course.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * idx }}
                        >
                            <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 glass-card group">
                                <div className="flex flex-col md:flex-row">
                                    <div className="w-full md:w-64 h-64 md:h-auto bg-gradient-to-br from-blue-50 to-blue-100 relative shrink-0 overflow-hidden">
                                        <img
                                            src={course.image_url}
                                            alt={course.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                                            📚 Course
                                        </div>
                                    </div>
                                    <div className="p-8 flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-agri-green transition-colors">{course.title}</h3>
                                                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                                        <span className="font-semibold">{course.provider}</span>
                                                        <span>•</span>
                                                        <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">{course.difficulty}</Badge>
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-3 mb-6">
                                                <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                                    <TrendingUp className="w-4 h-4 text-agri-green" />
                                                    Why recommended:
                                                </p>
                                                <ul className="text-sm text-gray-600 space-y-2">
                                                    <li className="flex items-start text-green-700 bg-green-50 p-3 rounded-lg">
                                                        <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                                                        <span className="font-medium">{course.why}</span>
                                                    </li>
                                                    <li className="flex items-start bg-gray-50 p-3 rounded-lg">
                                                        <CheckCircle className="w-5 h-5 mr-2 text-gray-400 flex-shrink-0 mt-0.5" />
                                                        <span>Teaches required skill: <strong>{course.skills[1]}</strong></span>
                                                    </li>
                                                </ul>
                                            </div>

                                            <div className="flex gap-2 flex-wrap">
                                                {course.skills.map(s => (
                                                    <Badge key={s} className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-0 px-3 py-1">{s}</Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mt-8 flex gap-3">
                                            <Button className="bg-agri-green hover:bg-green-800 shadow-lg hover:shadow-green-900/30 transition-all flex-1">
                                                View Course <ExternalLink className="ml-2 h-4 w-4" />
                                            </Button>
                                            <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
                                                Add to Plan
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}

                    {/* Projects */}
                    {filteredProjects.map((project, idx) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * (idx + filteredCourses.length) }}
                        >
                            <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 glass-card group relative">
                                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-purple-500 to-purple-700"></div>
                                <div className="flex flex-col md:flex-row">
                                    <div className="w-full md:w-24 flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 shrink-0 p-8 md:p-0">
                                        <Briefcase className="w-12 h-12 text-purple-600" />
                                    </div>
                                    <div className="p-8 flex-1">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-0 px-3 py-1">
                                                        💼 Project
                                                    </Badge>
                                                    <span className="text-sm text-gray-500 font-medium">{project.difficulty} • 2-3 weeks</span>
                                                </div>
                                                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">{project.title}</h3>
                                                <p className="mt-3 text-gray-600 leading-relaxed">{project.description}</p>
                                            </div>
                                        </div>

                                        <div className="mt-6 flex gap-2 flex-wrap">
                                            {project.skills.map(s => (
                                                <Badge key={s} className="border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1">
                                                    {s}
                                                </Badge>
                                            ))}
                                        </div>

                                        <div className="mt-8 flex gap-3">
                                            <Button className="bg-purple-600 hover:bg-purple-700 shadow-lg hover:shadow-purple-900/30 transition-all flex-1">
                                                🌱 Start Project
                                            </Button>
                                            <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
                                                Add to Plan
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}

                    {/* Jobs Section */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="pt-12 border-t-2 border-gray-200"
                    >
                        <div className="flex items-center gap-3 text-blue-600 font-bold uppercase tracking-wide text-sm mb-6">
                            <Briefcase className="w-5 h-5" />
                            <span>Recommended Jobs</span>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {jobs.map((job, idx) => (
                                <motion.div
                                    key={job.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.05 * idx }}
                                >
                                    <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group glass-card border-0 h-full">
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">{job.title}</h4>
                                                    <p className="text-sm text-gray-500 mt-1">{job.company} • {job.location}</p>
                                                </div>
                                                <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-0 font-bold px-3 py-1 shadow-sm">
                                                    {job.match_score}% Match
                                                </Badge>
                                            </div>
                                            <div className="flex gap-2 flex-wrap mb-6">
                                                {job.skills_required.map(s => (
                                                    <span key={s} className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full font-medium">
                                                        {s}
                                                    </span>
                                                ))}
                                            </div>
                                            <Button className="w-full bg-gray-900 text-white group-hover:bg-blue-600 transition-all shadow-lg">
                                                Apply via LinkedIn <ExternalLink className="ml-2 h-4 w-4" />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
