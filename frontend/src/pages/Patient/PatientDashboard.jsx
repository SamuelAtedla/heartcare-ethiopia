import React, { useState } from 'react';
import { Plus, Upload, CheckCircle, Clock } from 'lucide-react';

const PatientDashboard = () => {
    // Mock Data
    const appointments = [
        { id: 1, date: '2024-03-10', doctor: 'Dr. Samuel', status: 'Pending Payment', type: 'Hypertension' },
        { id: 2, date: '2024-02-15', doctor: 'Dr. Bekele', status: 'Verified', type: 'Check-up' },
    ];

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

            <div className="space-y-6 relative border-l-2 border-gray-200 ml-4 pl-8 pb-4">
                {appointments.map((apt) => (
                    <div key={apt.id} className="relative">
                        {/* Timeline Dot */}
                        <div className={`absolute -left-[41px] top-4 w-5 h-5 rounded-full border-4 border-white ${apt.status === 'Verified' ? 'bg-green-500' : 'bg-amber-500'
                            }`} />

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="font-bold text-gray-900 text-lg">{apt.type}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${apt.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                            {apt.status}
                                        </span>
                                    </div>
                                    <div className="text-gray-500 text-sm flex items-center gap-4">
                                        <span className="flex items-center gap-1"><Clock size={14} /> {apt.date}</span>
                                        <span>with {apt.doctor}</span>
                                    </div>
                                </div>

                                {apt.status === 'Verified' ? (
                                    <button className="text-red-600 font-bold text-sm bg-red-50 px-4 py-2 rounded-lg hover:bg-red-100 transition flex items-center gap-2">
                                        <Upload size={16} /> Upload Results
                                    </button>
                                ) : (
                                    <button className="text-gray-400 font-bold text-sm bg-gray-50 px-4 py-2 rounded-lg cursor-not-allowed flex items-center gap-2">
                                        Pending Verification
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PatientDashboard;
