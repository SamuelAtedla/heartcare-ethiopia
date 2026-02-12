import React, { useState, useEffect } from 'react';
import { Wallet, Search, Filter, Calendar, FileText, ChevronDown, Download, CheckCircle2, AlertCircle, Clock, XCircle, Loader2, User } from 'lucide-react';
import apiClient, { getFileUrl } from '../../../api/axiosConfig';

const FinanceManager = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });

    const [professionalFee, setProfessionalFee] = useState(3000);

    useEffect(() => {
        fetchFinanceData();
        fetchDoctorProfile();
    }, [statusFilter, dateRange]);

    const fetchDoctorProfile = async () => {
        try {
            const response = await apiClient.get('/doctor/profile');
            if (response.data && response.data.professionalFee) {
                setProfessionalFee(response.data.professionalFee);
            }
        } catch (error) {
            console.error('Error fetching doctor profile:', error);
        }
    };

    const fetchFinanceData = async () => {
        setLoading(true);
        try {
            const params = {};
            if (statusFilter !== 'all') params.status = statusFilter;
            if (searchQuery) params.query = searchQuery;
            if (dateRange.start && dateRange.end) {
                params.startDate = dateRange.start;
                params.endDate = dateRange.end;
            }

            const response = await apiClient.get('/doctor/finance', { params });
            setRecords(response.data);
        } catch (error) {
            console.error('Finance fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'confirmed': return { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle2 size={14} /> };
            case 'pending_approval': return { bg: 'bg-amber-100', text: 'text-amber-700', icon: <Clock size={14} /> };
            case 'completed': return { bg: 'bg-blue-100', text: 'text-blue-700', icon: <CheckCircle2 size={14} /> };
            case 'cancelled': return { bg: 'bg-red-100', text: 'text-red-700', icon: <XCircle size={14} /> };
            default: return { bg: 'bg-gray-100', text: 'text-gray-700', icon: <AlertCircle size={14} /> };
        }
    };

    const totalRevenue = records.reduce((acc, curr) => curr.status !== 'cancelled' ? acc + professionalFee : acc, 0);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-900 rounded-[32px] p-8 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                        <Wallet size={80} />
                    </div>
                    <p className="text-white/50 font-black uppercase text-[10px] tracking-[0.2em] mb-2">Total Revenue Generated</p>
                    <div className="flex items-end gap-2">
                        <h2 className="text-4xl font-black">{totalRevenue.toLocaleString()}</h2>
                        <span className="text-red-500 font-black mb-1">ETB</span>
                    </div>
                </div>

                <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
                    <p className="text-gray-400 font-black uppercase text-[10px] tracking-[0.2em] mb-4">Successful Visits</p>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                            <CheckCircle2 size={24} />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900">{records.filter(r => r.status === 'completed' || r.status === 'confirmed').length}</h2>
                    </div>
                </div>

                <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
                    <p className="text-gray-400 font-black uppercase text-[10px] tracking-[0.2em] mb-4">Pending Approvals</p>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                            <Clock size={24} />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900">{records.filter(r => r.status === 'pending_approval').length}</h2>
                    </div>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-wrap gap-6 items-end">
                <div className="flex-1 min-w-[250px]">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Search Transactions</label>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-red-600 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Patient name or phone..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onBlur={() => fetchFinanceData()}
                            onKeyDown={(e) => e.key === 'Enter' && fetchFinanceData()}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 ring-red-100 transition-all font-medium text-sm"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Status Filter</label>
                    <div className="flex bg-gray-50 p-1 rounded-2xl">
                        {['all', 'confirmed', 'pending_approval', 'completed', 'cancelled'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === status ? 'bg-white text-red-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                {status.split('_').join(' ')}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Date Range</label>
                    <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-2xl">
                        <input
                            type="date"
                            className="bg-transparent text-[10px] font-bold outline-none px-2"
                            value={dateRange.start}
                            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                        />
                        <span className="text-gray-300 font-bold">→</span>
                        <input
                            type="date"
                            className="bg-transparent text-[10px] font-bold outline-none px-2"
                            value={dateRange.end}
                            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                        />
                    </div>
                </div>
            </div>

            {/* Records Table */}
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-left">
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Transaction / Patient</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date & Time</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Receipt</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <Loader2 size={32} className="animate-spin mx-auto text-red-600 mb-4" />
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Syncing Records...</p>
                                    </td>
                                </tr>
                            ) : records.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <p className="text-gray-400 font-bold italic">No financial records found.</p>
                                    </td>
                                </tr>
                            ) : (
                                records.map((record) => {
                                    const style = getStatusStyle(record.status);
                                    return (
                                        <tr key={record.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden">
                                                        {record.patient?.profileImage ? (
                                                            <img src={getFileUrl(record.patient.profileImage)} className="w-full h-full object-cover" alt="" />
                                                        ) : <User size={18} />}
                                                    </div>
                                                    <div>
                                                        <p className="font-extrabold text-gray-900">{record.patient?.fullName}</p>
                                                        <p className="text-[10px] font-medium text-gray-500">{record.patient?.phone}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-sm font-bold text-gray-700">
                                                {new Date(record.scheduledAt).toLocaleDateString()}
                                                <span className="block text-[10px] text-gray-400 font-medium">
                                                    {new Date(record.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${style.bg} ${style.text}`}>
                                                    {style.icon}
                                                    {record.status.split('_').join(' ')}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="font-black text-gray-900">{professionalFee}</span>
                                                <span className="text-[10px] text-gray-400 ml-1 font-black">ETB</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                {record.labResults && record.labResults.length > 0 ? (
                                                    <a
                                                        href={getFileUrl(record.labResults[0].filePath)}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="p-2 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-red-600 hover:border-red-100 transition-all flex items-center justify-center w-fit shadow-sm"
                                                    >
                                                        <Download size={16} />
                                                    </a>
                                                ) : <span className="text-gray-200"><Download size={16} /></span>}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FinanceManager;
