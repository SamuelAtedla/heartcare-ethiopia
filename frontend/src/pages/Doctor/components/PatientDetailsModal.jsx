import React, { useState } from 'react';
import { X, User, Phone, Calendar, Clock, FileText, ClipboardList, Loader2, Save } from 'lucide-react';
import apiClient from '../../../api/axiosConfig';

const PatientDetailsModal = ({ appointment, onClose }) => {
    const [clinicalNotes, setClinicalNotes] = useState(appointment?.clinicalNotes || '');
    const [saving, setSaving] = useState(false);

    if (!appointment) return null;
    const { id, patient, scheduledAt, communicationMode, patientPhone, symptoms, status } = appointment;

    const handleSaveNotes = async () => {
        setSaving(true);
        try {
            await apiClient.post(`/appointments/${id}/clinical-notes`, { notes: clinicalNotes });
            alert('Clinical notes saved and appointment marked as completed.');
            onClose();
        } catch (error) {
            console.error('Save failed:', error);
            alert('Failed to save notes.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="bg-gray-900 p-8 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute right-6 top-6 p-2 hover:bg-white/10 rounded-full transition"
                    >
                        <X size={24} />
                    </button>

                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden">
                            {patient.profileImage ? (
                                <img src={`http://localhost:5000/${patient.profileImage}`} alt="Patient" className="w-full h-full object-cover" />
                            ) : (
                                <User className="text-white/40" size={48} />
                            )}
                        </div>
                        <div>
                            <span className="px-3 py-1 bg-red-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-3 inline-block">
                                Appointment Details
                            </span>
                            <h2 className="text-3xl font-extrabold tracking-tight">{patient.fullName}</h2>
                            <p className="text-white/60 font-medium mt-1 uppercase text-xs tracking-widest">Patient Age: {patient.age}</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Scheduled Time</label>
                            <div className="flex items-center gap-3 text-gray-900 font-bold">
                                <Clock className="text-red-500" size={18} />
                                {new Date(scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                        <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Contact Channel</label>
                            <div className="flex items-center gap-3 text-gray-900 font-bold capitalize text-sm">
                                <Phone className="text-red-500" size={18} />
                                {communicationMode} ({patientPhone})
                            </div>
                        </div>
                    </div>

                    {/* Patient Symptoms */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-gray-900 font-black uppercase text-xs tracking-widest">
                            <ClipboardList className="text-red-600" size={18} />
                            Symptoms (Patient's Report)
                        </div>
                        <div className="bg-red-50/50 p-5 rounded-[24px] border border-red-100">
                            <p className="text-gray-700 leading-relaxed font-medium text-sm">
                                {symptoms || "No specific symptoms provided by the patient."}
                            </p>
                        </div>
                    </div>

                    {/* Doctor's Clinical Notes */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2 text-gray-900 font-black uppercase text-xs tracking-widest">
                                <FileText className="text-blue-600" size={18} />
                                Specialist's Clinical Notes
                            </div>
                            {clinicalNotes !== appointment.clinicalNotes && (
                                <span className="text-[10px] font-bold text-amber-600 animate-pulse">Unsaved Changes</span>
                            )}
                        </div>
                        <textarea
                            value={clinicalNotes}
                            onChange={(e) => setClinicalNotes(e.target.value)}
                            placeholder="Type observation, diagnosis, and prescription here..."
                            className="w-full p-5 rounded-[24px] border-2 border-gray-100 focus:border-red-600 outline-none text-sm font-medium transition h-32 resize-none bg-gray-50"
                        />
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100">
                        <div className="text-sm font-bold text-gray-500">Current Status</div>
                        <span className="px-4 py-1.5 bg-green-100 text-green-700 rounded-xl text-xs font-black uppercase tracking-wider">
                            {status.replace('_', ' ')}
                        </span>
                    </div>
                </div>

                <div className="p-8 bg-gray-50 border-t border-gray-100 flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-4 bg-white border-2 border-gray-200 text-gray-600 font-black rounded-2xl hover:bg-gray-100 transition-all uppercase text-xs tracking-widest"
                    >
                        Close
                    </button>
                    <button
                        onClick={handleSaveNotes}
                        disabled={saving}
                        className="flex-[2] py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 uppercase text-xs tracking-widest flex items-center justify-center gap-2"
                    >
                        {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        Save Notes & Complete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PatientDetailsModal;
