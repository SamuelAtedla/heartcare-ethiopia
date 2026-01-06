import React, { useState } from 'react';
import { User, Clock, MessageSquare } from 'lucide-react';
import PatientDetailsModal from './PatientDetailsModal';

const QueueCard = ({ appointment }) => {
    const { patient, scheduledAt, communicationMode, patientPhone } = appointment;
    const [showDetails, setShowDetails] = useState(false);

    const handleMessage = () => {
        const phone = patientPhone.replace(/^0/, '251');
        if (communicationMode === 'telegram') {
            window.open(`https://t.me/+${phone}`, '_blank');
        } else {
            // Default to WhatsApp
            window.open(`https://wa.me/${phone}`, '_blank');
        }
    };

    return (
        <>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-6 hover:shadow-xl transition-all group">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                        {patient.profileImage ? (
                            <img src={`http://localhost:5000/${patient.profileImage}`} alt="Patient" className="w-full h-full object-cover" />
                        ) : (
                            <User className="text-red-300" size={32} />
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-extrabold text-gray-900 text-lg">{patient.fullName}</h3>
                            <span className="px-2 py-0.5 bg-gray-100 text-[10px] font-black uppercase text-gray-400 rounded-md">Today</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-1">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1 ${communicationMode === 'zoom' ? 'bg-blue-50 text-blue-600' :
                                communicationMode === 'telegram' ? 'bg-sky-50 text-sky-600' : 'bg-green-50 text-green-600'
                                }`}>
                                <MessageSquare size={10} />
                                {communicationMode || 'WhatsApp'}
                            </span>
                            <p className="text-xs text-gray-400 font-bold flex items-center gap-1">
                                <Clock size={12} />
                                {new Date(scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                    <button
                        onClick={handleMessage}
                        className="flex-1 sm:flex-none justify-center bg-red-50 text-red-600 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-red-600 hover:text-white transition-all shadow-sm"
                    >
                        Message
                    </button>
                    <button
                        onClick={() => setShowDetails(true)}
                        className="flex-1 sm:flex-none justify-center bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-black transition-all shadow-lg"
                    >
                        View Case
                    </button>
                </div>
            </div>

            {showDetails && (
                <PatientDetailsModal
                    appointment={appointment}
                    onClose={() => setShowDetails(false)}
                />
            )}
        </>
    );
};

export default QueueCard;
