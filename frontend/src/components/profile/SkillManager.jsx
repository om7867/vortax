import { useState, useEffect } from 'react';
import profileV2Service from '../../services/profileV2';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Search, Plus, Star, X, Check, Award } from 'lucide-react';

export default function SkillManager({ onSkillAdded }) {
    const [availableSkills, setAvailableSkills] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSkill, setSelectedSkill] = useState(null);
    const [rating, setRating] = useState(3);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                setLoading(true);
                const skills = await profileV2Service.getAvailableSkills();
                setAvailableSkills(skills);
            } catch (err) {
                console.error("Failed to fetch skills catalog", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSkills();
    }, []);

    const filteredSkills = availableSkills.filter(skill =>
        skill.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddSkill = async () => {
        if (!selectedSkill) return;
        try {
            setSubmitting(true);
            await profileV2Service.addUserSkill(selectedSkill.id, rating);
            setSelectedSkill(null);
            setSearchTerm('');
            if (onSkillAdded) onSkillAdded();
        } catch (err) {
            console.error("Failed to add skill", err);
            alert(err.response?.data?.detail || "Failed to add skill");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            {!selectedSkill ? (
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="Search skills... (e.g. Python, Soil Analysis)"
                        className="pl-10 h-12 rounded-xl"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    {searchTerm && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 max-h-64 overflow-y-auto z-50 p-2">
                            {filteredSkills.length === 0 ? (
                                <p className="p-4 text-center text-gray-400 text-sm italic">No matching skills found.</p>
                            ) : (
                                filteredSkills.map(skill => (
                                    <button
                                        key={skill.id}
                                        onClick={() => setSelectedSkill(skill)}
                                        className="w-full text-left p-3 hover:bg-blue-50 rounded-xl transition-colors flex items-center justify-between group"
                                    >
                                        <div>
                                            <div className="font-bold text-gray-900 group-hover:text-blue-700">{skill.name}</div>
                                            <div className="text-[10px] text-gray-400 uppercase font-black">{skill.domain} • {skill.category}</div>
                                        </div>
                                        <Plus className="w-4 h-4 text-gray-300 group-hover:text-blue-500" />
                                    </button>
                                ))
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <Card className="bg-blue-50 border-blue-100 rounded-2xl p-5 relative">
                    <button
                        onClick={() => setSelectedSkill(null)}
                        className="absolute top-4 right-4 text-blue-400 hover:text-blue-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-blue-500">
                            <Award className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-black text-blue-900 uppercase tracking-tight">{selectedSkill.name}</h3>
                            <p className="text-xs text-blue-700 opacity-70 font-bold">{selectedSkill.domain.toUpperCase()} • {selectedSkill.category.toUpperCase()}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest block">Proficiency Level</label>
                        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-blue-100/50">
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setRating(star)}
                                        className="transition-transform active:scale-95"
                                    >
                                        <Star
                                            className={`w-8 h-8 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`}
                                        />
                                    </button>
                                ))}
                            </div>
                            <span className="text-xl font-black text-gray-400 italic">Lv.{rating}</span>
                        </div>

                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest h-12 rounded-xl shadow-lg shadow-blue-200"
                            onClick={handleAddSkill}
                            disabled={submitting}
                        >
                            {submitting ? "Adding Skill..." : "Add to Repository"}
                        </Button>
                    </div>
                </Card>
            )}
        </div>
    );
}
