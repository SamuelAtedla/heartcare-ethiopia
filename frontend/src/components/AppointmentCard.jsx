import { Clock, Phone, CheckCircle } from 'lucide-react';

export const AppointmentCard = ({ name, time, status, phone, onAction, actionLabel }) => (
  <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="bg-red-50 p-3 rounded-full hidden xs:block">
          <Clock className="text-red-600 w-5 h-5" />
          <span>{time || "Time not set"}</span>
        </div>
        <div>
          <h4 className="font-bold text-slate-900 leading-tight">{name}</h4>
          <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
            <Phone size={14} /> {phone}
          </p>
        </div>
      </div>
      
      <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-3 sm:pt-0">
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider
          ${status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
          {status}
        </span>
        <Button size="sm" onClick={onAction} variant={status === 'confirmed' ? 'primary' : 'outline'}>
          {actionLabel}
        </Button>
      </div>
    </div>
  </div>
);