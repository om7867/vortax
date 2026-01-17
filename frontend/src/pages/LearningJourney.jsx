import { useState, useEffect } from 'react';
import api from '../services/api';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { CheckCircle, Zap, BookOpen, Star, Calendar } from 'lucide-react';

export default function LearningJourney() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data fallback if API not ready
        setHistory([
            {
                id: 1,
                title: 'Completed "Deep Learning Specialization"',
                provider: "Coursera",
                date: "2 days ago",
                type: "course",
                skills: ["TensorFlow", "CNN", "Neural Networks"]
            },
            {
                id: 2,
                title: 'Added project "Medical Image Classifier"',
                description: "Python, TensorFlow, Healthcare",
                date: "1 week ago",
                type: "project",
                skills: ["Python", "TensorFlow", "Medical Imaging"]
            },
            {
                id: 3,
                title: 'Skill update: Python → Expert',
                description: "Verified by 5 projects",
                date: "1 week ago",
                type: "achievement",
                skills: []
            },
            {
                id: 4,
                title: 'Started "Medical Imaging 101"',
                description: "In Progress (60% complete)",
                date: "2 weeks ago",
                type: "started",
                skills: []
            }
        ]);
        setLoading(false);
    }, []);

    const getIcon = (type) => {
        switch (type) {
            case 'course': return <BookOpen className="h-5 w-5 text-blue-600" />;
            case 'project': return <MonitorIcon className="h-5 w-5 text-purple-600" />; // Fallback icon
            case 'achievement': return <Star className="h-5 w-5 text-yellow-600" />;
            case 'started': return <Zap className="h-5 w-5 text-gray-500" />;
            default: return <CheckCircle className="h-5 w-5 text-green-600" />;
        }
    };

    const MonitorIcon = (props) => (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="20" height="14" x="2" y="3" rx="2" />
            <line x1="8" x2="16" y1="21" y2="21" />
            <line x1="12" x2="12" y1="17" y2="21" />
        </svg>
    )

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Learning Journey</h1>
                    <p className="text-gray-500 mt-1">Track your progress over time</p>
                </div>

                <div className="relative border-l-2 border-gray-200 ml-3 space-y-8 pb-8">
                    {history.map((item) => (
                        <div key={item.id} className="relative pl-8">
                            {/* Timeline Dot */}
                            <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-blue-500 border-4 border-white shadow-sm transition-transform hover:scale-125"></div>

                            <Card className="hover:shadow-md transition-all">
                                <CardContent className="p-4 flex gap-4">
                                    <div className="p-3 bg-gray-50 rounded-lg h-fit shrink-0">
                                        {getIcon(item.type)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-gray-900">{item.title}</h3>
                                            <span className="text-xs text-gray-400 whitespace-nowrap">{item.date}</span>
                                        </div>
                                        {item.provider && <p className="text-sm text-gray-600">{item.provider} • 4 weeks • 95% grade</p>}
                                        {item.description && <p className="text-sm text-gray-500">{item.description}</p>}

                                        {item.skills.length > 0 && (
                                            <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2 flex-wrap text-xs">
                                                <span className="text-gray-400 mr-1">Skills gained:</span>
                                                {item.skills.map(skill => (
                                                    <span key={skill} className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-medium">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        {item.type === 'course' && (
                                            <div className="mt-2 text-xs text-blue-600 font-medium cursor-pointer hover:underline">
                                                View Certificate
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
