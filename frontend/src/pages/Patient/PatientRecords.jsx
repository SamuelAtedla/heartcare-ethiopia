import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    FileText,
    Calendar,
    User,
    Stethoscope,
    ClipboardList,
    Download,
    Eye,
    ChevronDown,
    ChevronUp,
    CheckCircle2,
    Clock,
    AlertCircle
} from 'lucide-react';
import apiClient, { getFileUrl } from '../../api/axiosConfig';

const PatientRecords = () => {
    const { t } = useTranslation();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedRecord, setExpandedRecord] = useState(null);

    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        try {
            const response = await apiClient.get('/appointments/my-appointment');
            // Filter or sort records as needed
            setRecords(response.data);
        } catch (error) {
            console.error('Error fetching medical records:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = (id) => {
        setExpandedRecord(expandedRecord === id ? null : id);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-700 border-green-200';
            case 'confirmed': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'pending_payment': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'pending_approval': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-red-100 border-t-red-600 rounded-full animate-spin" />
                    <p className="text-gray-500 font-medium animate-pulse">{t('loadingHistory')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="mb-10">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                    <FileText className="text-red-600" size={32} />
                    {t('medicalRecords')}
                </h1>
                <p className="text-gray-500 font-medium mt-1">{t('medicalRecordsSubTitle')}</p>
            </div>

            {records.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200 shadow-sm">
                    <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <ClipboardList className="text-gray-300" size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{t('noRecordsFound')}</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">
                        {t('noRecordsDesc')}
                    </p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {records.map((record) => (
                        <div
                            key={record.id}
                            className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden ${expandedRecord === record.id
                                ? 'shadow-xl border-red-100 ring-1 ring-red-50'
                                : 'shadow-sm border-gray-100 hover:shadow-md hover:border-red-100'
                                }`}
                        >
                            {/* Record Header - Compact View */}
                            <div
                                className="p-6 cursor-pointer flex items-center justify-between gap-4"
                                onClick={() => toggleExpand(record.id)}
                            >
                                <div className="flex items-center gap-5 flex-1 min-w-0">
                                    <div className={`p-4 rounded-2xl shrink-0 ${record.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                        }`}>
                                        <Calendar size={24} />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-lg font-bold text-gray-900 truncate">
                                                {new Date(record.scheduledAt).toLocaleDateString('en-US', {
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </h3>
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusColor(record.status)}`}>
                                                {record.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                                            <span className="flex items-center gap-1.5">
                                                <User size={14} className="text-gray-400" />
                                                Dr. {record.doctor?.fullName || 'TBD'}
                                            </span>
                                            <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                            <span className="flex items-center gap-1.5">
                                                <Clock size={14} className="text-gray-400" />
                                                {new Date(record.scheduledAt).toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                                        {expandedRecord === record.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                                    </button>
                                </div>
                            </div>

                            {/* Expanded Details */}
                            {expandedRecord === record.id && (
                                <div className="px-6 pb-8 pt-2 border-t border-gray-50">
                                    <div className="grid md:grid-cols-2 gap-8">
                                        {/* Left Column: Clinical Info */}
                                        <div className="space-y-6">
                                            <div>
                                                <h4 className="flex items-center gap-2 text-sm font-black text-gray-400 uppercase tracking-widest mb-3">
                                                    <Stethoscope size={16} />
                                                    {t('clinicalSummary')}
                                                </h4>
                                                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                                                    <p className="text-gray-800 leading-relaxed font-medium">
                                                        {record.clinicalNotes || (
                                                            <span className="text-gray-400 italic">{t('noClinicalNotes')}</span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="flex items-center gap-2 text-sm font-black text-gray-400 uppercase tracking-widest mb-3">
                                                    <AlertCircle size={16} />
                                                    {t('symptomsReported')}
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {record.symptoms ? (
                                                        record.symptoms.split(',').map((symptom, i) => (
                                                            <span key={i} className="px-3 py-1.5 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">
                                                                {symptom.trim()}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-gray-400 text-sm italic">{t('noneReported')}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Column: Labs & Attachments */}
                                        <div className="space-y-6">
                                            <div>
                                                <h4 className="flex items-center gap-2 text-sm font-black text-gray-400 uppercase tracking-widest mb-3">
                                                    <ClipboardList size={16} />
                                                    {t('labsDocs')}
                                                </h4>
                                                <div className="space-y-3">
                                                    {record.labResults && record.labResults.length > 0 ? (
                                                        record.labResults.map((lab) => (
                                                            <div key={lab.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-red-200 transition-colors group">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                                                        <FileText size={18} />
                                                                    </div>
                                                                    <div className="min-w-0">
                                                                        <p className="text-sm font-bold text-gray-900 truncate max-w-[150px]">
                                                                            {lab.fileName}
                                                                        </p>
                                                                        <p className="text-[10px] text-gray-500 uppercase font-black">
                                                                            {lab.fileType || t('document')}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <a
                                                                        href={getFileUrl(lab.filePath)}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                        title="View"
                                                                    >
                                                                        <Eye size={18} />
                                                                    </a>
                                                                    <a
                                                                        href={getFileUrl(lab.filePath)}
                                                                        download
                                                                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                                        title="Download"
                                                                    >
                                                                        <Download size={18} />
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="text-center py-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                                            <p className="text-gray-400 text-sm italic">{t('noAttachments')}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {record.status === 'completed' && (
                                                <div className="bg-green-50/50 p-5 rounded-3xl border border-green-100">
                                                    <div className="flex items-center gap-3 text-green-700 mb-2">
                                                        <CheckCircle2 size={20} />
                                                        <span className="font-bold">{t('followUp')}</span>
                                                    </div>
                                                    <p className="text-sm text-green-600/80 font-medium font-serif italic">
                                                        {t('followUpDesc')}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PatientRecords;
