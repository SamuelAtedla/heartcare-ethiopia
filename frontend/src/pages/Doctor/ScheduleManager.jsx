import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import apiClient from '../../api/axiosConfig';
import DayScheduleCard from './components/DayScheduleCard';

const DAYS = [
    { id: 0, name: 'Sunday' },
    { id: 1, name: 'Monday' },
    { id: 2, name: 'Tuesday' },
    { id: 3, name: 'Wednesday' },
    { id: 4, name: 'Thursday' },
    { id: 5, name: 'Friday' },
    { id: 6, name: 'Saturday' },
];

const ScheduleManager = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [availabilities, setAvailabilities] = useState(
        DAYS.map(day => {
            const isWeekDay = day.id >= 1 && day.id <= 5;
            const isSaturday = day.id === 6;
            return {
                dayOfWeek: day.id,
                startTime: '08:30',
                endTime: isSaturday ? '12:30' : '17:30',
                slotDuration: 30,
                isActive: isWeekDay || isSaturday
            };
        })
    );

    const applyToAllActive = () => {
        // Use Monday's settings (id 1) as the template if it's active, otherwise use the first active day
        const template = availabilities.find(a => a.dayOfWeek === 1 && a.isActive) || availabilities.find(a => a.isActive);
        if (!template) return;

        const newAvailabilities = availabilities.map(av => {
            if (av.isActive) {
                return {
                    ...av,
                    startTime: template.startTime,
                    endTime: template.endTime,
                    slotDuration: template.slotDuration
                };
            }
            return av;
        });
        setAvailabilities(newAvailabilities);
    };

    useEffect(() => {
        fetchAvailability();
    }, []);

    const fetchAvailability = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/availability');
            if (response.data && response.data.length > 0) {
                const newAvailabilities = [...availabilities];
                response.data.forEach(item => {
                    const index = newAvailabilities.findIndex(a => a.dayOfWeek === item.dayOfWeek);
                    if (index !== -1) {
                        newAvailabilities[index] = {
                            ...item,
                            startTime: item.startTime.substring(0, 5),
                            endTime: item.endTime.substring(0, 5)
                        };
                    }
                });
                setAvailabilities(newAvailabilities);
            }
        } catch (err) {
            console.error('Fetch availability failed:', err);
            setError('Failed to load schedule settings.');
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = (dayIndex) => {
        const newAvailabilities = [...availabilities];
        newAvailabilities[dayIndex].isActive = !newAvailabilities[dayIndex].isActive;
        setAvailabilities(newAvailabilities);
    };

    const handleChange = (dayIndex, field, value) => {
        const newAvailabilities = [...availabilities];
        newAvailabilities[dayIndex][field] = value;
        setAvailabilities(newAvailabilities);
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError(null);
            await apiClient.post('/availability/bulk', { availabilities });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error('Save availability failed:', err);
            setError('Failed to save schedule settings.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12 px-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Schedule Manager</h1>
                    <p className="text-gray-500 font-medium text-sm">Define your working hours for each day of the week.</p>
                </div>
                <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                    <button
                        onClick={applyToAllActive}
                        className="flex-1 sm:flex-none bg-white text-gray-900 border-2 border-gray-100 font-bold text-xs uppercase tracking-widest px-6 py-4 rounded-2xl hover:border-red-600 hover:text-red-600 transition-all shadow-sm active:scale-95"
                    >
                        Sync Active Days
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 sm:flex-none bg-gray-900 text-white font-black uppercase text-xs tracking-[0.2em] px-8 py-4 rounded-2xl hover:bg-black transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-2 disabled:bg-gray-400 active:scale-95"
                    >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Save Schedule
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-5 rounded-[2rem] flex items-center gap-3 border border-red-100">
                    <AlertCircle size={20} />
                    <span className="font-bold text-sm">{error}</span>
                </div>
            )}

            {success && (
                <div className="bg-green-50 text-green-600 p-5 rounded-[2rem] flex items-center gap-3 border border-green-100">
                    <CheckCircle2 size={20} />
                    <span className="font-bold text-sm">Schedule updated successfully!</span>
                </div>
            )}

            <div className="bg-white rounded-[40px] border border-gray-100 p-4 sm:p-8 shadow-sm space-y-4">
                <div className="grid grid-cols-1 gap-4">
                    {availabilities.map((day, index) => (
                        <DayScheduleCard
                            key={day.dayOfWeek}
                            day={day}
                            dayName={DAYS[index].name}
                            onToggle={() => handleToggle(index)}
                            onChange={(field, value) => handleChange(index, field, value)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ScheduleManager;
