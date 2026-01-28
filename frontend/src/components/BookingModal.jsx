import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Video, MessageCircle, Send, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import apiClient from '../api/axiosConfig';

import { useNotification } from '../context/NotificationContext';

const BookingModal = ({ onClose, onSuccess }) => {
    const { t } = useTranslation();
    const { notify } = useNotification();
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState('');
    const [bookingNote, setBookingNote] = useState('');
    const [communicationMode, setCommunicationMode] = useState('whatsapp');
    const [altPhone, setAltPhone] = useState(localStorage.getItem('user')?.phone || '');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchDoctors();
    }, []);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const fetchDoctors = async () => {
        try {
            const response = await apiClient.get('/public/doctors');
            setDoctors(response.data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    const fetchSlots = async (doctorId, date) => {
        if (!doctorId || !date) return;
        try {
            const response = await apiClient.get('/appointments/availability', {
                params: { doctorId, date }
            });
            setAvailableSlots(response.data.availableSlots || []);
        } catch (error) {
            console.error('Error fetching slots:', error);
            setAvailableSlots([]);
        }
    };

    const handleBook = async () => {
        if (!selectedDoctor || !selectedDate || !selectedSlot) {
            notify.warning(t('bookingAlert'));
            return;
        }

        setSubmitting(true);
        try {
            await apiClient.post('/appointments/book', {
                doctorId: selectedDoctor.id,
                scheduledAt: selectedSlot,
                symptoms: bookingNote,
                communicationMode,
                patientPhone: altPhone
            });

            onSuccess();
            notify.success(t('bookingReserved'));
            onClose();
        } catch (error) {
            console.error('Booking failed:', error);
            notify.error(error.response?.data?.error || t('bookingFailed'));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="bg-red-600 p-6 text-white text-center relative">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 p-1 hover:bg-white/20 rounded-full transition"
                    >
                        <X size={20} />
                    </button>
                    <h2 className="text-xl font-bold">{t('newAppointment')}</h2>
                    <p className="opacity-80 text-sm font-medium">{t('bookingSubTitle')}</p>
                </div>

                <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {/* Doctor Selection */}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">{t('selectSpecialist')}</label>
                        <div className="grid grid-cols-1 gap-2">
                            {doctors.map(doc => (
                                <button
                                    key={doc.id}
                                    onClick={() => {
                                        setSelectedDoctor(doc);
                                        if (selectedDate) fetchSlots(doc.id, selectedDate);
                                    }}
                                    className={`p-3 rounded-xl border-2 transition text-left flex items-center gap-3 ${selectedDoctor?.id === doc.id ? 'border-red-600 bg-red-50' : 'border-gray-100 hover:border-red-200'}`}
                                >
                                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">
                                        {doc.fullName.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div className="font-bold text-gray-900">{doc.fullName}</div>
                                            <div className="text-[10px] font-black bg-red-100 text-red-600 px-2 py-0.5 rounded-lg border border-red-200 uppercase tracking-tighter shadow-sm">
                                                {doc.professionalFee || 3000} ETB
                                            </div>
                                        </div>
                                        <div className="text-xs font-medium text-gray-500 uppercase tracking-tight">{doc.specialty || t('cardiologist')}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Date Selection */}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">{t('preferredDate')}</label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="date"
                                min={new Date().toISOString().split('T')[0]}
                                value={selectedDate}
                                onChange={(e) => {
                                    setSelectedDate(e.target.value);
                                    if (selectedDoctor) fetchSlots(selectedDoctor.id, e.target.value);
                                }}
                                className="w-full p-3 pl-12 rounded-xl border-2 border-gray-100 focus:border-red-600 outline-none text-gray-700 font-medium transition"
                            />
                        </div>
                    </div>

                    {/* Slot Selection */}
                    {selectedDate && (
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">{t('availableSlots')}</label>
                            <div className="grid grid-cols-3 gap-2">
                                {availableSlots.length > 0 ? (
                                    availableSlots.map(slot => (
                                        <button
                                            key={slot}
                                            onClick={() => setSelectedSlot(slot)}
                                            className={`p-2 rounded-lg border text-sm font-bold transition flex flex-col items-center gap-1 ${selectedSlot === slot ? 'bg-red-600 border-red-600 text-white shadow-md' : 'border-gray-100 text-gray-600 hover:border-red-200 bg-gray-50'}`}
                                        >
                                            <Clock size={14} />
                                            {new Date(slot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </button>
                                    ))
                                ) : (
                                    <div className="col-span-3 text-center p-6 bg-gray-50 rounded-2xl text-sm text-gray-500 font-medium">
                                        {t('noSlots')}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="h-px bg-gray-100 my-4" />

                    {/* Communication Mode */}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">{t('commPreference')}</label>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { id: 'whatsapp', icon: <MessageCircle size={18} />, label: 'WhatsApp' },
                                { id: 'telegram', icon: <Send size={18} />, label: 'Telegram' },
                                { id: 'zoom', icon: <Video size={18} />, label: 'Zoom' }
                            ].map(mode => (
                                <button
                                    key={mode.id}
                                    onClick={() => setCommunicationMode(mode.id)}
                                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition font-bold text-xs ${communicationMode === mode.id ? 'border-red-600 bg-red-50 text-red-600' : 'border-gray-50 bg-gray-50 text-gray-500 hover:border-red-100'}`}
                                >
                                    {mode.icon}
                                    {mode.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">{t('contactNumber')}</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="tel"
                                value={altPhone}
                                onChange={(e) => setAltPhone(e.target.value)}
                                placeholder="09..."
                                className="w-full p-3 pl-12 rounded-xl border-2 border-gray-100 focus:border-red-600 outline-none text-gray-700 font-bold transition"
                            />
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1.5 ml-1">{t('contactNumberNote', { mode: communicationMode })}</p>
                    </div>

                    {/* Reason */}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">{t('notesLabel')}</label>
                        <textarea
                            placeholder={t('notesPlaceholder')}
                            value={bookingNote}
                            onChange={(e) => setBookingNote(e.target.value)}
                            className="w-full p-4 rounded-2xl border-2 border-gray-100 h-28 focus:border-red-600 outline-none text-gray-700 font-medium transition resize-none"
                        />
                    </div>
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 text-gray-500 font-bold hover:text-gray-700 transition"
                    >
                        {t('btnBack')}
                    </button>
                    <button
                        onClick={handleBook}
                        disabled={submitting || !selectedSlot}
                        className={`flex-[2] py-4 rounded-2xl font-bold text-white shadow-xl transition-all active:scale-95 ${submitting || !selectedSlot ? 'bg-gray-300' : 'bg-red-600 hover:bg-red-700 shadow-red-200'}`}
                    >
                        {submitting ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                {t('processing')}
                            </div>
                        ) : t('btnConfirmReservation')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingModal;
