import React, { useState, useEffect } from 'react';
import { Search, User, Phone, Calendar, Clock, ChevronRight, FileText, ClipboardList, Loader2, History } from 'lucide-react';
import apiClient from '../../../api/axiosConfig';

const PatientArchive = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [history, setHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setSelectedPatient(null);
        setHistory([]);
        try {
            const response = await apiClient.get(`/doctor/search-patients?query=${searchQuery}`);
            setPatients(response.data);
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchHistory = async (patient) => {
        setSelectedPatient(patient);
        setLoadingHistory(true);
        try {
            const response = await apiClient.get(`/doctor/patient-records/${patient.id}`);
            setHistory(response.data);
        } catch (error) {
            console.error('History fetch failed:', error);
        } finally {
            setLoadingHistory(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4 duration-500">
            {/* Search and Results Column */}
            <div className="lg:col-span-1 space-y-6">
                <form onSubmit={handleSearch} className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name or phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:border-red-600 outline-none transition-all font-medium text-gray-700"
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-2 bottom-2 bg-gray-900 text-white px-4 rounded-xl text-xs font-bold hover:bg-black transition-colors"
                    >
                        Find
                    </button>
                </form>

                <div className="space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                    {loading ? (
                        <div className="py-12 text-center">
                            <Loader2 className="animate-spin text-red-600 mx-auto mb-2" size={32} />
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Searching Records...</p>
                        </div>
                    ) : patients.length > 0 ? (
                        patients.map(patient => (
                            <button
                                key={patient.id}
                                onClick={() => fetchHistory(patient)}
                                className={`w-full p-4 rounded-2xl border transition-all flex items-center gap-4 text-left ${selectedPatient?.id === patient.id ? 'bg-red-600 border-red-600 text-white shadow-xl scale-[1.02]' : 'bg-white border-gray-50 hover:border-red-100 group'}`}
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${selectedPatient?.id === patient.id ? 'bg-white/20' : 'bg-red-50 text-red-600'}`}>
                                    {patient.profileImage ? (
                                        <img src={`http://localhost:5000/${patient.profileImage}`} alt="" className="w-full h-full object-cover rounded-xl" />
                                    ) : (
                                        <User size={24} />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold truncate">{patient.fullName}</h4>
                                    <p className={`text-[10px] font-black uppercase tracking-widest ${selectedPatient?.id === patient.id ? 'text-white/70' : 'text-gray-400'}`}>
                                        Age: {patient.age} • {patient.phone}
                                    </p>
                                </div>
                                <ChevronRight size={18} className={selectedPatient?.id === patient.id ? 'text-white' : 'text-gray-300 group-hover:text-red-300'} />
                            </button>
                        ))
                    ) : searchQuery && !loading ? (
                        <div className="py-20 text-center bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
                            <p className="text-gray-400 font-bold italic text-sm">No patients found matching "{searchQuery}"</p>
                        </div>
                    ) : (
                        <div className="py-20 text-center bg-gray-50/50 rounded-3xl border border-gray-100">
                            <Search className="mx-auto text-gray-200 mb-4" size={48} />
                            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em]">Enter a name or phone to start</p>
                        </div>
                    )}
                </div>
            </div>

            {/* History Column */}
            <div className="lg:col-span-2">
                {!selectedPatient ? (
                    <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-[40px] p-10 text-center">
                        <History size={64} className="text-gray-200 mb-6" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Patient Records Viewer</h3>
                        <p className="text-gray-500 max-w-sm font-medium">Select a patient from the search results to view their complete medical history, symptoms, and specialist notes.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                        <div className="bg-gray-900 p-8 text-white flex justify-between items-center">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-2xl bg-white/10 p-1">
                                    {selectedPatient.profileImage ? (
                                        <img src={`http://localhost:5000/${selectedPatient.profileImage}`} alt="" className="w-full h-full object-cover rounded-xl" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white/20"><User size={40} /></div>
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black tracking-tight">{selectedPatient.fullName}</h2>
                                    <p className="text-white/50 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">Medical Archive • {selectedPatient.phone}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="block text-[10px] font-black text-white/30 uppercase tracking-widest">Total Visits</span>
                                <span className="text-3xl font-black text-red-500">{history.length}</span>
                            </div>
                        </div>

                        <div className="p-8 max-h-[65vh] overflow-y-auto custom-scrollbar">
                            {loadingHistory ? (
                                <div className="py-20 text-center">
                                    <Loader2 className="animate-spin text-red-600 mx-auto mb-4" size={48} />
                                    <p className="font-black uppercase text-xs tracking-widest text-gray-400">Retrieving Archive...</p>
                                </div>
                            ) : history.length > 0 ? (
                                <div className="space-y-8 relative">
                                    {/* Timeline Line */}
                                    <div className="absolute left-[23px] top-4 bottom-4 w-0.5 bg-gray-100" />

                                    {history.map((appt, idx) => (
                                        <div key={appt.id} className="relative pl-16">
                                            {/* Timeline Dot */}
                                            <div className="absolute left-0 top-0 w-12 h-12 bg-white rounded-2xl border-2 border-gray-100 flex items-center justify-center z-10">
                                                <Calendar size={20} className="text-gray-400" />
                                            </div>

                                            <div className="bg-gray-50/50 border border-gray-100 rounded-3xl p-6 hover:bg-white hover:border-red-100 hover:shadow-xl hover:shadow-red-50 transition-all group">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div>
                                                        <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] mb-1 block">
                                                            {new Date(appt.scheduledAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                                        </span>
                                                        <h4 className="text-lg font-extrabold text-gray-900">Cardiology Consultation</h4>
                                                    </div>
                                                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${appt.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                        {appt.status.replace('_', ' ')}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                            <ClipboardList size={14} className="text-red-500" />
                                                            Patient's Symptoms
                                                        </div>
                                                        <p className="text-sm font-medium text-gray-700 bg-white p-4 rounded-2xl border border-gray-50 italic">
                                                            "{appt.symptoms || "No specific symptoms reported."}"
                                                        </p>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                            <FileText size={14} className="text-blue-500" />
                                                            Specialist's Clinical Notes
                                                        </div>
                                                        <p className="text-sm font-medium text-gray-700 bg-white p-4 rounded-2xl border border-gray-50 leading-relaxed">
                                                            {appt.clinicalNotes || "No notes recorded for this visit."}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
                                    <p className="text-gray-400 font-bold italic">No past appointments found for this patient.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientArchive;
