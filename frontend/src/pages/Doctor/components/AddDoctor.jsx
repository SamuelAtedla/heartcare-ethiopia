import React, { useState } from 'react';
import { X, UserPlus, Loader2, Save } from 'lucide-react';
import apiClient from '../../../api/axiosConfig';
import { useNotification } from '../../../context/NotificationContext';

const AddDoctor = ({ onClose, onSuccess }) => {
    const { notify } = useNotification();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        password: '',
        specialty: '',
        bio: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Basic validation
            if (!formData.fullName || !formData.phone || !formData.password || !formData.specialty) {
                notify.error('Please fill in all required fields.');
                setLoading(false);
                return;
            }

            await apiClient.post('/admin/doctors', formData);

            notify.success('Doctor registered successfully!');
            onSuccess();
        } catch (error) {
            console.error(error);
            const message = error.response?.data?.error || 'Failed to register doctor.';
            notify.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 sticky top-0 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                            <UserPlus size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Register New Doctor</h2>
                            <p className="text-gray-500 font-medium text-sm">Add a new specialist to the platform</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Full Name *</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl px-4 py-3 font-medium transition-all outline-none"
                                placeholder="Dr. Alemu Kebede"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Phone Number *</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl px-4 py-3 font-medium transition-all outline-none"
                                placeholder="0911234567"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Email (Optional)</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl px-4 py-3 font-medium transition-all outline-none"
                                placeholder="doctor@example.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Password *</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl px-4 py-3 font-medium transition-all outline-none"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Specialty *</label>
                        <input
                            type="text"
                            name="specialty"
                            value={formData.specialty}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl px-4 py-3 font-medium transition-all outline-none"
                            placeholder="e.g. Cardiologist, Pediatrician"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Bio / Qualifications</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows={4}
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-xl px-4 py-3 font-medium transition-all outline-none resize-none"
                            placeholder="Brief description of experience and credentials..."
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            <span>Register Doctor</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddDoctor;
