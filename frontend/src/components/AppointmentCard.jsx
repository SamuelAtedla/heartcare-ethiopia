import { Clock, Phone, CheckCircle } from 'lucide-react';

const AppointmentCard = ({ patientName, caseType, time, status }) => {
  return (
    <div className="p-4 border rounded-xl bg-white shadow-sm flex justify-between items-center">
      <div>
        <h4 className="font-bold text-slate-800">{patientName}</h4>
        <p className="text-sm text-slate-500">{caseType}</p>
        
        {/* FIX: Ensure 'time' is being rendered here */}
        <div className="flex items-center gap-1 mt-2 text-red-600 font-medium text-sm">
          <Clock size={14} />
          <span>{time || "Time not set"}</span> 
        </div>
      </div>

      <div className={`px-3 py-1 rounded-full text-xs font-bold ${
        status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
      }`}>
        {status.toUpperCase()}
      </div>
    </div>
  );
};
export default AppointmentCard;