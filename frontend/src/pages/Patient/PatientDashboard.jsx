import React, { useState, useEffect } from 'react';
import { Plus, Upload, FileText, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import apiClient from '../../api/axiosConfig';
import BookingModal from '../../components/BookingModal';
import { useNotification } from '../../context/NotificationContext';

const PatientDashboard = () => {
    const { t } = useTranslation();
    const { notify } = useNotification();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showBooking, setShowBooking] = useState(false);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const response = await apiClient.get('/appointments/my-appointment');
            setAppointments(response.data);
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e, appointmentId, type) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();

        let endpoint = '';
        if (type === 'receipt') {
            formData.append('receipt', file);
            endpoint = `/appointments/${appointmentId}/upload-receipt`;
        } else {
            formData.append('labResults', file);
            endpoint = `/appointments/${appointmentId}/upload-results`;
        }

        try {
            await apiClient.post(endpoint, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            notify.success(`${type === 'receipt' ? 'Receipt' : 'Lab Result'} uploaded successfully!`);
            fetchHistory();
        } catch (error) {
            console.error('Upload failed:', error);
            notify.error('Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-red-100 border-t-red-600 rounded-full animate-spin" />
                <p className="text-gray-500 font-medium animate-pulse">{t('syncingRecords')}</p>
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{t('patientDashTitle')}</h1>
                    <p className="text-gray-500 font-medium">{t('patientDashSubTitle')}</p>
                </div>
                <button
                    onClick={() => setShowBooking(true)}
                    className="bg-red-600 text-white px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2.5 shadow-xl shadow-red-100 hover:bg-red-700 hover:shadow-red-200 transition-all active:scale-95"
                >
                    <Plus size={20} />
                    <span>{t('btnBookConsultation')}</span>
                </button>
            </div>

            {/* Booking Modal Injection */}
            {showBooking && (
                <BookingModal
                    onClose={() => setShowBooking(false)}
                    onSuccess={() => {
                        setShowBooking(false);
                        fetchHistory();
                    }}
                />
            )}

            {appointments.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-dashed border-2 border-gray-200">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
                        <Plus className="text-gray-300" size={32} />
                    </div>
                    <p className="text-gray-500 font-bold text-lg">{t('noAppointments')}</p>
                    <p className="text-sm text-gray-400 mt-2 max-w-xs mx-auto">{t('noAppointmentsDesc')}</p>
                </div>
            ) : (
                <div className="space-y-8 relative border-l-2 border-gray-100 ml-6 pl-10 pb-4">
                    {appointments.map((apt) => (
                        <div key={apt.id} className="relative group">
                            {/* Timeline Node */}
                            <div className={`absolute -left-[51px] top-4 w-6 h-6 rounded-full border-4 border-white shadow-sm z-10 transition-transform group-hover:scale-110 ${apt.status === 'confirmed' || apt.status === 'completed' ? 'bg-green-500' :
                                apt.status === 'pending_approval' ? 'bg-blue-500' : 'bg-amber-500'
                                }`} />

                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-red-100 transition-all duration-300">
                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-3 mb-3">
                                            <span className="font-extrabold text-gray-900 text-xl tracking-tight">
                                                {apt.clinicalNotes || t('consultation')}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                apt.status === 'pending_approval' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-amber-100 text-amber-700'
                                                }`}>
                                                {apt.status.replace('_', ' ')}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm">
                                            <div className="flex items-center gap-2 text-gray-500 font-medium">
                                                <Clock size={16} className="text-red-500" />
                                                {new Date(apt.scheduledAt).toLocaleDateString('en-US', {
                                                    weekday: 'short',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                            {apt.doctor && (
                                                <div className="flex items-center gap-2 text-gray-900 font-bold">
                                                    <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center text-[10px] text-red-600">
                                                        {apt.doctor.fullName.charAt(0)}
                                                    </div>
                                                    Dr. {apt.doctor.fullName}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        {apt.status === 'pending_payment' && (
                                            <label className="cursor-pointer group/btn flex items-center gap-2.5 bg-amber-600 text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-amber-100 hover:bg-amber-700 transition-all">
                                                {uploading ? (
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                ) : <Upload size={18} />}
                                                <span>{uploading ? t('uploading') : t('uploadReceipt')}</span>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*,.pdf"
                                                    onChange={(e) => handleFileUpload(e, apt.id, 'receipt')}
                                                />
                                            </label>
                                        )}

                                        {(apt.status === 'confirmed' || apt.status === 'completed') && (
                                            <label className="cursor-pointer flex items-center gap-2.5 bg-blue-600 text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
                                                <FileText size={18} />
                                                <span>{t('uploadLabs')}</span>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*,.pdf"
                                                    onChange={(e) => handleFileUpload(e, apt.id, 'results')}
                                                />
                                            </label>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PatientDashboard;
