import React from 'react';
import { Clock } from 'lucide-react';

const DayScheduleCard = ({ day, dayName, onToggle, onChange }) => {
    return (
        <div className={`flex flex-col gap-4 p-5 sm:p-6 rounded-[2rem] border-2 transition-all ${day.isActive ? 'border-red-100 bg-red-50/30' : 'border-gray-50 bg-gray-50/50 grayscale opacity-60'}`}>

            {/* Header: Toggle & Day Name */}
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onToggle}
                        className={`relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none ${day.isActive ? 'bg-red-600' : 'bg-gray-300'}`}
                    >
                        <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${day.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                    <div className="flex flex-col">
                        <span className="font-black text-gray-900 leading-none">{dayName}</span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                            {day.isActive ? 'Available' : 'Unavailable'}
                        </span>
                    </div>
                </div>

                {/* Slot Duration (Moved to top right for better space usage on mobile) */}
                <div className={`flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-3 py-1 ${!day.isActive && 'opacity-50'}`}>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-tight whitespace-nowrap">Slot</span>
                    <select
                        value={day.slotDuration}
                        onChange={(e) => onChange('slotDuration', parseInt(e.target.value))}
                        disabled={!day.isActive}
                        className="bg-transparent text-xs font-bold outline-none cursor-pointer"
                    >
                        <option value={15}>15m</option>
                        <option value={20}>20m</option>
                        <option value={30}>30m</option>
                        <option value={45}>45m</option>
                        <option value={60}>60m</option>
                    </select>
                </div>
            </div>

            {/* Time Inputs */}
            <div className={`grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-3 w-full ${!day.isActive && 'pointer-events-none'}`}>
                <div className="relative">
                    <span className="absolute -top-2 left-3 bg-white px-1 text-[8px] font-bold text-gray-400 uppercase z-10">From</span>
                    <div className="relative">
                        <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="time"
                            value={day.startTime}
                            onChange={(e) => onChange('startTime', e.target.value)}
                            className="bg-white border border-gray-100 rounded-xl pl-9 pr-3 py-3 text-sm font-bold focus:ring-2 ring-red-100 outline-none w-full"
                        />
                    </div>
                </div>

                <span className="hidden sm:block text-gray-300 font-black text-[10px] uppercase">to</span>

                <div className="relative">
                    <span className="absolute -top-2 left-3 bg-white px-1 text-[8px] font-bold text-gray-400 uppercase z-10">Until</span>
                    <div className="relative">
                        <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="time"
                            value={day.endTime}
                            onChange={(e) => onChange('endTime', e.target.value)}
                            className="bg-white border border-gray-100 rounded-xl pl-9 pr-3 py-3 text-sm font-bold focus:ring-2 ring-red-100 outline-none w-full"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DayScheduleCard;
