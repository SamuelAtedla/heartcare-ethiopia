import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { PlayCircle, Clock, FileText } from 'lucide-react';

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // Fetch appointments for the logged-in specialist
    api.get('/doctor/appointments').then(res => setAppointments(res.data));
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Consultation Queue</h1>
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
          ● Specialist Online
        </div>
      </header>

      <div className="grid gap-4">
        {appointments.map((appt) => (
          <div key={appt.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="p-3 bg-blue-50 rounded-full">
                <Clock className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{appt.patient_name}</h3>
                <p className="text-sm text-slate-500">{appt.scheduled_time} • {appt.phone}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                appt.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {appt.status.toUpperCase()}
              </span>
              
              {appt.status === 'confirmed' && (
                <button className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
                  <PlayCircle size={18} /> Start Session
                </button>
              )}
              <button className="p-2 text-slate-400 hover:text-slate-600">
                <FileText size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}