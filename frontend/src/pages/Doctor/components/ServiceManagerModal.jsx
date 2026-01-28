import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Edit2, Layout, Stethoscope, Activity, ShieldCheck, Heart, ClipboardCheck, UserCheck, Save } from 'lucide-react';
import apiClient from '../../../api/axiosConfig';
import { useNotification } from '../../../context/NotificationContext';

const icons = {
    Stethoscope, Activity, ShieldCheck, Heart, ClipboardCheck, UserCheck, Layout
};

const ServiceManagerModal = ({ onClose }) => {
    const { notify } = useNotification();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingService, setEditingService] = useState(null);
    const [formData, setFormData] = useState({
        iconName: 'Stethoscope',
        titleEn: '',
        titleAm: '',
        descriptionEn: '',
        descriptionAm: '',
        featuresEn: '',
        featuresAm: ''
    });

    useEffect(() => {
        fetchServices();

        // Handle Escape key
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    const fetchServices = async () => {
        try {
            const response = await apiClient.get('/services');
            setServices(response.data);
            setLoading(false);
        } catch (error) {
            notify.error('Failed to load services');
            setLoading(false);
        }
    };

    const handleEdit = (service) => {
        setEditingService(service);
        setFormData({
            iconName: service.iconName,
            titleEn: service.titleEn,
            titleAm: service.titleAm,
            descriptionEn: service.descriptionEn,
            descriptionAm: service.descriptionAm,
            featuresEn: service.featuresEn.join(', '),
            featuresAm: service.featuresAm.join(', ')
        });
    };

    const handleCancelEdit = () => {
        setEditingService(null);
        setFormData({
            iconName: 'Stethoscope',
            titleEn: '',
            titleAm: '',
            descriptionEn: '',
            descriptionAm: '',
            featuresEn: '',
            featuresAm: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            featuresEn: formData.featuresEn.split(',').map(f => f.trim()).filter(f => f),
            featuresAm: formData.featuresAm.split(',').map(f => f.trim()).filter(f => f)
        };

        try {
            if (editingService) {
                await apiClient.put(`/services/${editingService.id}`, payload);
                notify.success('Service updated successfully');
            } else {
                await apiClient.post('/services', payload);
                notify.success('Service created successfully');
            }
            fetchServices();
            handleCancelEdit();
        } catch (error) {
            notify.error('Action failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this service?')) return;
        try {
            await apiClient.delete(`/services/${id}`);
            notify.success('Service deleted');
            fetchServices();
        } catch (error) {
            notify.error('Delete failed');
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-white w-full max-w-5xl max-h-[90vh] rounded-[40px] shadow-2xl flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-8 border-b flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900">Manage Services</h2>
                        <p className="text-gray-500 font-medium tracking-tight">Add or update clinic services</p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-white rounded-2xl transition-all text-gray-400 hover:text-red-600 shadow-sm border border-transparent hover:border-red-100">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Form Section */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            {editingService ? <Edit2 size={20} className="text-blue-600" /> : <Plus size={20} className="text-red-600" />}
                            {editingService ? 'Edit Service' : 'Add New Service'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Icon</label>
                                    <select
                                        value={formData.iconName}
                                        onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-gray-900 focus:border-red-600 focus:ring-0 transition-all outline-none"
                                    >
                                        {Object.keys(icons).map(name => (
                                            <option key={name} value={name}>{name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Title (EN)</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.titleEn}
                                        onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-gray-900 focus:border-red-600 focus:ring-0 transition-all outline-none"
                                        placeholder="e.g. Heart Surgery"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Title (AM)</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.titleAm}
                                        onChange={(e) => setFormData({ ...formData, titleAm: e.target.value })}
                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-gray-900 focus:border-red-600 focus:ring-0 transition-all outline-none"
                                        placeholder="የልብ ቀዶ ጥገና"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Description (EN)</label>
                                <textarea
                                    required
                                    rows="3"
                                    value={formData.descriptionEn}
                                    onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-gray-900 focus:border-red-600 focus:ring-0 transition-all outline-none resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Description (AM)</label>
                                <textarea
                                    required
                                    rows="3"
                                    value={formData.descriptionAm}
                                    onChange={(e) => setFormData({ ...formData, descriptionAm: e.target.value })}
                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-gray-900 focus:border-red-600 focus:ring-0 transition-all outline-none resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Features (EN, comma separated)</label>
                                    <textarea
                                        rows="2"
                                        value={formData.featuresEn}
                                        onChange={(e) => setFormData({ ...formData, featuresEn: e.target.value })}
                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-gray-900 focus:border-red-600 focus:ring-0 transition-all outline-none resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Features (AM, comma separated)</label>
                                    <textarea
                                        rows="2"
                                        value={formData.featuresAm}
                                        onChange={(e) => setFormData({ ...formData, featuresAm: e.target.value })}
                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-gray-900 focus:border-red-600 focus:ring-0 transition-all outline-none resize-none"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-red-100 hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                                >
                                    <Save size={20} />
                                    {editingService ? 'Update Service' : 'Save Service'}
                                </button>
                                {editingService && (
                                    <button
                                        type="button"
                                        onClick={handleCancelEdit}
                                        className="px-8 bg-gray-100 text-gray-600 py-4 rounded-2xl font-black hover:bg-gray-200 transition-all"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* List Section */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Layout size={20} className="text-gray-400" />
                            Current Services
                        </h3>
                        <div className="space-y-4">
                            {services.map((service) => {
                                const Icon = icons[service.iconName] || Stethoscope;
                                return (
                                    <div key={service.id} className="bg-gray-50 rounded-3xl p-5 flex items-center justify-between group border border-transparent hover:border-red-100 hover:bg-white transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-600 shadow-sm border border-gray-100">
                                                <Icon size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">{service.titleEn}</h4>
                                                <p className="text-xs text-gray-400 font-black uppercase tracking-widest">{service.titleAm}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(service)}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(service.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                            {services.length === 0 && !loading && (
                                <div className="py-10 text-center text-gray-400 italic">No services added yet.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceManagerModal;
