import { useState } from 'react';
import profileV2Service from '../../services/profileV2';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Calendar, Link as LinkIcon, Building2, Briefcase } from 'lucide-react';

export default function CertificationForm({ onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        issuing_organization: '',
        credential_id: '',
        issue_date: '',
        expiry_date: '',
        verification_url: '',
        domain: 'common'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await profileV2Service.addCertification(formData);
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error("Failed to add certification", err);
            alert(err.response?.data?.detail || "Failed to add certification");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-gray-400">Certification Name</Label>
                <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4 z-10" />
                    <select
                        name="name"
                        className="w-full h-11 rounded-xl border border-gray-200 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Certificate...</option>
                        <option value="AWS Cloud Practitioner">AWS Cloud Practitioner</option>
                        <option value="Azure Fundamentals">Azure Fundamentals</option>
                        <option value="Google Data Engineer">Google Data Engineer</option>
                        <option value="CompTIA Security+">CompTIA Security+</option>
                        <option value="PMP Professional">PMP Professional</option>
                        <option value="Scrum Master (CSM)">Scrum Master (CSM)</option>
                        <option value="Google Analytics IQ">Google Analytics IQ</option>
                        <option value="CCNA Network Assoc">CCNA Network Assoc</option>
                        <option value="CFA Level 1">CFA Level 1</option>
                        <option value="Data Science Cert">Data Science Professional</option>
                        <option value="other">Other / Specialized</option>
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-gray-400">Issuing Organization</Label>
                <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4 z-10" />
                    <select
                        name="issuing_organization"
                        className="w-full h-11 rounded-xl border border-gray-200 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        value={formData.issuing_organization}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Issuer...</option>
                        <option value="Amazon (AWS)">Amazon Web Services (AWS)</option>
                        <option value="Microsoft">Microsoft Corp</option>
                        <option value="Google">Google / Alphabet</option>
                        <option value="PMI Institute">PMI (Project Management)</option>
                        <option value="CompTIA">CompTIA</option>
                        <option value="Scrum Alliance">Scrum Alliance</option>
                        <option value="Cisco Systems">Cisco Systems</option>
                        <option value="Coursera/edX">Coursera / edX</option>
                        <option value="University/Coll">University / College</option>
                        <option value="other">Other Organization</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black tracking-widest text-gray-400">Issue Date</Label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                        <Input
                            name="issue_date"
                            type="date"
                            className="pl-10 rounded-xl h-11"
                            required
                            value={formData.issue_date}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black tracking-widest text-gray-400">Expiry (Optional)</Label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                        <Input
                            name="expiry_date"
                            type="date"
                            className="pl-10 rounded-xl h-11"
                            value={formData.expiry_date}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-gray-400">Verification URL (Optional)</Label>
                <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                    <Input
                        name="verification_url"
                        placeholder="https://..."
                        className="pl-10 rounded-xl h-11"
                        value={formData.verification_url}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-gray-400">Relevant Domain</Label>
                <select
                    name="domain"
                    className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    value={formData.domain}
                    onChange={handleChange}
                >
                    <option value="common">Common / General</option>
                    <option value="technology">Technology & IT</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="agriculture">Agriculture</option>
                    <option value="urban">Urban Planning</option>
                    <option value="finance">Finance & Economics</option>
                    <option value="education">Education</option>
                </select>
            </div>

            <Button
                type="submit"
                className="w-full h-12 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black uppercase tracking-widest shadow-lg shadow-purple-200 mt-4"
                disabled={loading}
            >
                {loading ? "Adding Record..." : "Confirm Certification"}
            </Button>
        </form>
    );
}
