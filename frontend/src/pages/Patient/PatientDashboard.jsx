import React, { useState, useEffect } from 'react';
import { Plus, Upload, CheckCircle, Clock, FileText, AlertCircle } from 'lucide-react';
import apiClient from '../../api/axiosConfig';

const PatientDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    // Fetch History
    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const response = await apiClient.get('/appointment/my-appointment');
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
            endpoint = `/appointment/${appointmentId}/upload-receipt`;
        } else {
            // Lab Results (can be multiple, but simplifying to single for this UI action)
            formData.append('labResults', file);
            endpoint = `/appointment/${appointmentId}/upload-results`;
        }

        try {
            await apiClient.post(endpoint, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert(`${type === 'receipt' ? 'Receipt' : 'Lab Result'} uploaded successfully!`);
            fetchHistory(); // Refresh to show updated status
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading your records...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Care Timeline</h1>
                    <p className="text-gray-500">Track your appointments and health records</p>
                </div>
                <button className="bg-red-600 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-red-100 hover:bg-red-700 transition">
                    <Plus size={20} />
                    <span className="hidden sm:inline">Book Appointment</span>
                </button>
            </div>

            {appointments.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
                    <p className="text-gray-500 font-medium">No appointments found.</p>
                    <p className="text-sm text-gray-400 mt-1">Book your first consultation to get started.</p>
                </div>
            ) : (
                <div className="space-y-6 relative border-l-2 border-gray-200 ml-4 pl-8 pb-4">
                    {appointments.map((apt) => (
                        <div key={apt.id} className="relative">
                            {/* Timeline Dot */}
                            <div className={`absolute -left-[41px] top-4 w-5 h-5 rounded-full border-4 border-white ${apt.status === 'confirmed' || apt.status === 'completed' ? 'bg-green-500' :
                                    apt.status === 'pending_approval' ? 'bg-blue-500' : 'bg-amber-500'
                                }`} />

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="font-bold text-gray-900 text-lg">
                                                {apt.clinicalNotes || 'Consultation'}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                    apt.status === 'pending_approval' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-amber-100 text-amber-700'
                                                }`}>
                                                {apt.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <div className="text-gray-500 text-sm flex items-center gap-4">
                                            <span className="flex items-center gap-1">
                                                <Clock size={14} /> {new Date(apt.scheduledAt).toLocaleDateString()}
                                            </span>
                                            {apt.doctor && <span>with {apt.doctor.fullName}</span>}
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        {/* Pending Payment -> Upload Receipt */}
                                        {apt.status === 'pending_payment' && (
                                            <label className="cursor-pointer text-amber-600 font-bold text-sm bg-amber-50 px-4 py-2 rounded-lg hover:bg-amber-100 transition flex items-center gap-2">
                                                {uploading ? 'Uploading...' : <><Upload size={16} /> Upload Receipt</>}
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*,.pdf"
                                                    onChange={(e) => handleFileUpload(e, apt.id, 'receipt')}
                                                />
                                            </label>
                                        )}

                                        {/* Confirmed -> Upload Lab Results */}
                                        {apt.status === 'confirmed' && (
                                            <label className="cursor-pointer text-blue-600 font-bold text-sm bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition flex items-center gap-2">
                                                {uploading ? 'Uploading...' : <><FileText size={16} /> Upload Labs</>}
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
