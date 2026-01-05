import React, { useState, useEffect } from 'react';
import { Plus, Upload, CheckCircle, Clock, FileText, AlertCircle } from 'lucide-react';
import apiClient from '../../api/axiosConfig';

const PatientDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    // Booking States
    const [showBooking, setShowBooking] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState('');
    const [bookingNote, setBookingNote] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Fetch History & Doctors
    useEffect(() => {
        fetchHistory();
        fetchDoctors();
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

    const handleBookAppointment = async () => {
        if (!selectedDoctor || !selectedDate || !selectedSlot) {
            alert('Please select doctor, date and time slot.');
            return;
        }

        setSubmitting(true);
        try {
            await apiClient.post('/appointments/book', {
                doctorId: selectedDoctor.id,
                scheduledAt: selectedSlot,
                clinicalNotes: bookingNote
            });

            setShowBooking(false);
            // Reset form
            setSelectedDoctor(null);
            setSelectedDate('');
            setSelectedSlot('');
            setBookingNote('');

            fetchHistory(); // Refresh timeline
            alert('Appointment reserved! Please upload your payment receipt to confirm.');
        } catch (error) {
            console.error('Booking failed:', error);
            alert(error.response?.data?.error || 'Booking failed. Please try again.');
        } finally {
            setSubmitting(false);
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
            // Lab Results (can be multiple, but simplifying to single for this UI action)
            formData.append('labResults', file);
            endpoint = `/appointments/${appointmentId}/upload-results`;
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
                <button
                    onClick={() => setShowBooking(true)}
                    className="bg-red-600 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-red-100 hover:bg-red-700 transition"
                >
                    <Plus size={20} />
                    <span className="hidden sm:inline">Book Appointment</span>
                </button>
            </div>

            {/* Booking Modal */}
            {showBooking && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="bg-red-600 p-6 text-white text-center">
                            <h2 className="text-xl font-bold">New Appointment</h2>
                            <p className="opacity-80 text-sm">Select a doctor and available slot</p>
                        </div>

                        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                            {/* Doctor Selection */}
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Select Specialist</label>
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
                                            <div>
                                                <div className="font-bold text-gray-900">{doc.fullName}</div>
                                                <div className="text-xs text-gray-500">{doc.specialty || 'Cardiologist'}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Date Selection */}
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Preferred Date</label>
                                <input
                                    type="date"
                                    min={new Date().toISOString().split('T')[0]}
                                    value={selectedDate}
                                    onChange={(e) => {
                                        setSelectedDate(e.target.value);
                                        if (selectedDoctor) fetchSlots(selectedDoctor.id, e.target.value);
                                    }}
                                    className="w-full p-3 rounded-xl border-2 border-gray-100 focus:border-red-600 outline-none text-gray-700"
                                />
                            </div>

                            {/* Slot Selection */}
                            {selectedDate && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Available Slots</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {availableSlots.length > 0 ? (
                                            availableSlots.map(slot => (
                                                <button
                                                    key={slot}
                                                    onClick={() => setSelectedSlot(slot)}
                                                    className={`p-2 rounded-lg border text-sm font-medium transition ${selectedSlot === slot ? 'bg-red-600 border-red-600 text-white' : 'border-gray-200 hover:border-red-300'}`}
                                                >
                                                    {new Date(slot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </button>
                                            ))
                                        ) : (
                                            <div className="col-span-3 text-center p-4 bg-gray-50 rounded-xl text-xs text-gray-500 italic">
                                                No slots available for this selective date/doctor.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Reason */}
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Reason for Visit</label>
                                <textarea
                                    placeholder="Heart palpitations, routine checkup..."
                                    value={bookingNote}
                                    onChange={(e) => setBookingNote(e.target.value)}
                                    className="w-full p-3 rounded-xl border-2 border-gray-100 h-24 focus:border-red-600 outline-none text-gray-700"
                                />
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 flex gap-3">
                            <button
                                onClick={() => setShowBooking(false)}
                                className="flex-1 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleBookAppointment}
                                disabled={submitting || !selectedSlot}
                                className={`flex-[2] py-3 rounded-xl font-bold text-white shadow-lg shadow-red-200 transition ${submitting || !selectedSlot ? 'bg-gray-300' : 'bg-red-600 hover:bg-red-700'}`}
                            >
                                {submitting ? 'Booking...' : 'Confirm Reservation'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
