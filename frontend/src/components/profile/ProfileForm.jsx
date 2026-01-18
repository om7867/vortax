import { useState } from 'react';
import profileV2Service from '../../services/profileV2';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { User, BookOpen, Target, MapPin, Briefcase } from 'lucide-react';

export default function ProfileForm({ initialData = {}, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        full_name: initialData.full_name || '',
        education_level: initialData.education_level || 'bachelor',
        field_of_study: initialData.field_of_study || '',
        domain_interest: initialData.domain_interest || 'common',
        target_role: initialData.target_role || '',
        experience_level: initialData.experience_level || 'beginner',
        years_of_experience: initialData.years_of_experience || 0,
        location: initialData.location || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'years_of_experience' ? parseInt(value) || 0 : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await profileV2Service.updateProfile(formData);
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error("Failed to save profile", err);
            alert(err.response?.data?.detail || "Failed to save profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-gray-400">Full Name</Label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                    <Input
                        name="full_name"
                        placeholder="e.g. John Doe"
                        className="pl-10 rounded-xl h-11"
                        required
                        value={formData.full_name}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black tracking-widest text-gray-400">Education Level</Label>
                    <select
                        name="education_level"
                        className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        value={formData.education_level}
                        onChange={handleChange}
                    >
                        <option value="secondary">High School / Secondary</option>
                        <option value="diploma">Diploma</option>
                        <option value="associate">Associate's Degree</option>
                        <option value="bachelor">Bachelor's Degree</option>
                        <option value="master">Master's Degree</option>
                        <option value="phd">Doctorate / PhD</option>
                        <option value="post_grad">Post-Graduate Research</option>
                        <option value="specialized">Specialized Certification</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black tracking-widest text-gray-400">Years of Experience</Label>
                    <Input
                        name="years_of_experience"
                        type="number"
                        min="0"
                        max="50"
                        className="rounded-xl h-11"
                        required
                        value={formData.years_of_experience}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-gray-400">Field of Study</Label>
                <div className="relative">
                    <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4 z-10" />
                    <select
                        name="field_of_study"
                        className="w-full h-11 rounded-xl border border-gray-200 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        value={formData.field_of_study}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Field of Study...</option>
                        <option value="it">Computer Science & IT</option>
                        <option value="data_science">Data Science & Analytics</option>
                        <option value="healthcare">Healthcare & Medicine</option>
                        <option value="agriculture">Agriculture & Life Sciences</option>
                        <option value="urban">Urban Planning & Architecture</option>
                        <option value="finance">Finance & Economics</option>
                        <option value="management">Business Management</option>
                        <option value="engineering">Engineering (General)</option>
                        <option value="other">Other / Specialized</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black tracking-widest text-gray-400">Domain Interest</Label>
                    <select
                        name="domain_interest"
                        className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        value={formData.domain_interest}
                        onChange={handleChange}
                    >
                        <option value="common">Common / General</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="agriculture">Agriculture</option>
                        <option value="urban">Urban Planning</option>
                        <option value="technology">Technology & IT</option>
                        <option value="finance">Finance & Business</option>
                        <option value="education">Education & Research</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black tracking-widest text-gray-400">Expertise Level</Label>
                    <select
                        name="experience_level"
                        className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        value={formData.experience_level}
                        onChange={handleChange}
                    >
                        <option value="entry">Entry Level</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="expert">Expert / Lead</option>
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-gray-400">Target Role</Label>
                <div className="relative">
                    <Target className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4 z-10" />
                    <select
                        name="target_role"
                        className="w-full h-11 rounded-xl border border-gray-200 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        value={formData.target_role}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Your Career Goal...</option>
                        <option value="data_scientist">Data Scientist</option>
                        <option value="health_analyst">Health Data Analyst</option>
                        <option value="agronomist">Professional Agronomist</option>
                        <option value="farm_manager">Modern Farm Manager</option>
                        <option value="software_engineer">Full Stack Developer</option>
                        <option value="urban_planner">Smart City Planner</option>
                        <option value="ml_engineer">ML/AI Engineer</option>
                        <option value="research_scientist">Research Scientist</option>
                        <option value="student">Aspiring Trainee</option>
                        <option value="other">Other Potential Role</option>
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-gray-400">Location Base</Label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4 z-10" />
                    <select
                        name="location"
                        className="w-full h-11 rounded-xl border border-gray-200 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        value={formData.location}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Primary Location...</option>
                        <option value="remote">Fully Remote (Global)</option>
                        <option value="new_york_usa">New York, USA</option>
                        <option value="san_francisco_usa">San Francisco, USA</option>
                        <option value="london_uk">London, UK</option>
                        <option value="mumbai_india">Mumbai, India</option>
                        <option value="bangalore_india">Bangalore, India</option>
                        <option value="tokyo_japan">Tokyo, Japan</option>
                        <option value="singapore">Singapore</option>
                        <option value="dubai_uae">Dubai, UAE</option>
                        <option value="other">Other Location</option>
                    </select>
                </div>
            </div>

            <Button
                type="submit"
                className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest shadow-lg shadow-blue-200 mt-4"
                disabled={loading}
            >
                {loading ? "Saving Profile..." : "Update PathIQ Profile"}
            </Button>
        </form>
    );
}
