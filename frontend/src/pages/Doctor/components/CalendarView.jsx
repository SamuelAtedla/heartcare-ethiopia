import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import moment from 'moment';

const CalendarView = ({ appointments, onDateSelect, selectedDate }) => {
    const [currentMonth, setCurrentMonth] = useState(moment());

    const daysInMonth = useMemo(() => {
        const startOfMonth = moment(currentMonth).startOf('month');
        const endOfMonth = moment(currentMonth).endOf('month');
        const days = [];

        // Add empty padding for the start of the week
        const firstDayOfWeek = startOfMonth.day();
        for (let i = 0; i < firstDayOfWeek; i++) {
            days.push(null);
        }

        // Add actual days
        for (let i = 1; i <= endOfMonth.date(); i++) {
            days.push(moment(startOfMonth).date(i));
        }

        return days;
    }, [currentMonth]);

    const appointmentCounts = useMemo(() => {
        const counts = {};
        appointments.forEach(appt => {
            const dateStr = moment(appt.scheduledAt).format('YYYY-MM-DD');
            counts[dateStr] = (counts[dateStr] || 0) + 1;
        });
        return counts;
    }, [appointments]);

    const nextMonth = () => setCurrentMonth(moment(currentMonth).add(1, 'month'));
    const prevMonth = () => setCurrentMonth(moment(currentMonth).subtract(1, 'month'));

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8 animate-in fade-in duration-500">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
                        <CalendarIcon size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                            {currentMonth.format('MMMM YYYY')}
                        </h2>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Appointment Schedule</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={prevMonth}
                        className="p-3 hover:bg-gray-50 rounded-xl transition-all text-gray-400 hover:text-red-600 border border-transparent hover:border-red-100"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={nextMonth}
                        className="p-3 hover:bg-gray-50 rounded-xl transition-all text-gray-400 hover:text-red-600 border border-transparent hover:border-red-100"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
                {weekDays.map(day => (
                    <div key={day} className="text-center py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        {day}
                    </div>
                ))}

                {daysInMonth.map((day, idx) => {
                    if (!day) return <div key={`empty-${idx}`} className="h-24" />;

                    const dateStr = day.format('YYYY-MM-DD');
                    const count = appointmentCounts[dateStr] || 0;
                    const isSelected = selectedDate && moment(selectedDate).isSame(day, 'day');
                    const isToday = day.isSame(moment(), 'day');

                    return (
                        <button
                            key={dateStr}
                            onClick={() => onDateSelect(day.toDate())}
                            className={`h-24 rounded-3xl p-3 flex flex-col items-center justify-between transition-all border-2 relative group
                                ${isSelected ? 'bg-gray-900 border-gray-900 text-white shadow-xl scale-105 z-10' :
                                    isToday ? 'bg-red-50 border-red-100 text-red-600' : 'bg-gray-50 border-transparent hover:border-gray-200 text-gray-700'}`}
                        >
                            <span className={`text-sm font-black ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                                {day.date()}
                            </span>

                            {count > 0 && (
                                <div className={`flex flex-col items-center gap-1 ${isSelected ? 'animate-bounce' : ''}`}>
                                    <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-red-400' : 'bg-red-500'}`} />
                                    <span className={`text-[10px] font-black ${isSelected ? 'text-white/60' : 'text-gray-400'}`}>
                                        {count} {count === 1 ? 'visit' : 'visits'}
                                    </span>
                                </div>
                            )}

                            {isToday && !isSelected && (
                                <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-600 rounded-full" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarView;
