import React, { useState, useEffect } from 'react';
import { User, Phone, Briefcase, FileText, Award, Save, Loader2, Camera, CheckCircle2 } from 'lucide-react';
import apiClient from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';

const DoctorSettings = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        fullName: user?.name || '',
        phone: user?.phone || '',
        specialty: '',
        bio: '',
        credentials: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            // Usually we'd have a bio/specialty in the user object from context if updated, 
            // but for safety we can fetch fresh or use context. 
            // Mocking the specialty/bio for now as we don't have a direct 'get current doctor profile' yet 
            // beyond the general auth user.
            const response = await apiClient.get('/public/doctors');
            const currentDoc = response.data.find(d => d.id === user?.id);
            if (currentDoc) {
                setFormData({
                    fullName: currentDoc.fullName,
                    phone: currentDoc.phone,
                    specialty: currentDoc.specialty || '',
                    bio: currentDoc.bio || '',
                    credentials: currentDoc.credentials || ''
                });
            }
        } catch (error) {
            console.error('Fetch profile failed:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);
        try {
            await apiClient.put('/doctor/profile', formData);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error('Update failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Specialist Profile</h1>
                <p className="text-gray-500 font-medium">Customize your public profile and professional credentials.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-900 rounded-[40px] p-8 shadow-xl text-center text-white sticky top-8">
                        <div className="relative w-32 h-32 mx-auto mb-6">
                            <div className="w-full h-full rounded-[40px] bg-white/10 flex items-center justify-center text-white/20 overflow-hidden border-4 border-white/10 shadow-xl">
                                {user?.profileImage ? (
                                    <img src={`http://localhost:5000/${user.profileImage}`} className="w-full h-full object-cover" alt="" />
                                ) : <User size={48} />}
                            </div>
                            <button className="absolute -right-2 -bottom-2 w-10 h-10 bg-red-600 text-white rounded-2xl flex items-center justify-center hover:bg-red-700 transition-all border-4 border-gray-900 shadow-lg">
                                <Camera size={18} />
                            </button>
                        </div>
                        <h3 className="font-black text-xl">{formData.fullName}</h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 mt-2">{formData.specialty || 'Medical Specialist'}</p>

                        <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-white/30 font-bold uppercase tracking-widest">Visibility</span>
                                <span className="text-green-500 font-black uppercase tracking-widest">Public</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Card */}
                <div className="lg:col-span-2 space-y-8">
                    <form onSubmit={handleSubmit} className="bg-white rounded-[40px] border border-gray-100 p-8 shadow-sm space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors" size={18} />
                                    <input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 ring-red-100 transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Specialty</label>
                                <div className="relative group">
                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors" size={18} />
                                    <input
                                        type="text"
                                        value={formData.specialty}
                                        onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 ring-red-100 transition-all font-medium"
                                        placeholder="e.g. Cardiologist"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Professional Bio</label>
                            <div className="relative group">
                                <FileText className="absolute left-4 top-6 text-gray-400 group-focus-within:text-red-600 transition-colors" size={18} />
                                <textarea
                                    rows="4"
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 ring-red-100 transition-all font-medium resize-none text-sm"
                                    placeholder="Tell patients about your experience..."
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Credentials & Education</label>
                            <div className="relative group">
                                <Award className="absolute left-4 top-6 text-gray-400 group-focus-within:text-red-600 transition-colors" size={18} />
                                <textarea
                                    rows="3"
                                    value={formData.credentials}
                                    onChange={(e) => setFormData({ ...formData, credentials: e.target.value })}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 ring-red-100 transition-all font-medium resize-none text-sm"
                                    placeholder="e.g. MD from Addis Ababa University..."
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex items-center gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-gray-900 text-white font-black uppercase text-xs tracking-[0.2em] py-4 rounded-2xl hover:bg-black transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                Update Specialist Profile
                            </button>
                            {success && (
                                <div className="flex items-center gap-2 text-green-600 font-bold text-sm animate-in slide-in-from-left-2">
                                    <CheckCircle2 size={18} />
                                    Successfully Updated!
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DoctorSettings;
