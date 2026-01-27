import React, { useState, useEffect } from 'react';
import { User, Phone, Briefcase, FileText, Award, Save, Loader2, Camera, CheckCircle2 } from 'lucide-react';
import apiClient, { getFileUrl } from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';

const DoctorSettings = () => {
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        phone: user?.phone || '',
        specialty: user?.specialty || '',
        bio: user?.bio || '',
        credentials: user?.credentials || '',
        professionalFee: user?.professionalFee || 3000
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await apiClient.get('/doctor/profile');
            const currentDoc = response.data;
            if (currentDoc) {
                setFormData({
                    fullName: currentDoc.fullName || user?.fullName || '',
                    phone: currentDoc.phone || user?.phone || '',
                    specialty: currentDoc.specialty || '',
                    bio: currentDoc.bio || '',
                    credentials: currentDoc.credentials || '',
                    professionalFee: currentDoc.professionalFee || 3000
                });
            }
        } catch (error) {
            console.error('Fetch profile failed:', error);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                // Append everything in formData to allow clearing fields with empty strings
                if (formData[key] !== undefined && formData[key] !== null) {
                    data.append(key, formData[key]);
                }
            });

            if (selectedFile) {
                data.append('profileImage', selectedFile);
            }

            const response = await apiClient.put('/doctor/profile', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Update Auth Context with EVERYTHING
            updateUser({
                ...formData,
                profileImage: response.data.profileImage || user.profileImage
            });

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error('Update failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const currentImage = previewUrl || (user?.profileImage ? getFileUrl(user.profileImage) : null);

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
                                {currentImage ? (
                                    <img src={currentImage} className="w-full h-full object-cover" alt="" />
                                ) : <User size={48} />}
                            </div>
                            <label className="absolute -right-2 -bottom-2 w-10 h-10 bg-red-600 text-white rounded-2xl flex items-center justify-center hover:bg-red-700 transition-all border-4 border-gray-900 shadow-lg cursor-pointer">
                                <Camera size={18} />
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            </label>
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
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors" size={18} />
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Professional Fee (per session)</label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold group-focus-within:text-red-600 transition-colors">ETB</span>
                                    <input
                                        type="number"
                                        value={formData.professionalFee}
                                        onChange={(e) => setFormData({ ...formData, professionalFee: e.target.value })}
                                        className="w-full pl-14 pr-4 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 ring-red-100 transition-all font-medium"
                                        placeholder="3000"
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
