import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const icons = {
    success: <CheckCircle className="w-6 h-6 text-green-500" />,
    error: <XCircle className="w-6 h-6 text-red-500" />,
    warning: <AlertTriangle className="w-6 h-6 text-amber-500" />,
    info: <Info className="w-6 h-6 text-blue-500" />,
};

const styles = {
    success: 'border-green-500/20 bg-green-50/90 text-green-900',
    error: 'border-red-500/20 bg-red-50/90 text-red-900',
    warning: 'border-amber-500/20 bg-amber-50/90 text-amber-900',
    info: 'border-blue-500/20 bg-blue-50/90 text-blue-900',
};

const NotificationToast = ({ id, type, message, onClose }) => {
    const [isExiting, setIsExiting] = useState(false);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            onClose(id);
        }, 300); // Matches animation duration
    };

    return (
        <div
            className={`
        relative w-full max-w-sm flex items-start gap-4 p-4 rounded-2xl border shadow-xl backdrop-blur-md transition-all duration-300 ease-in-out
        ${styles[type]}
        ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0 animate-in slide-in-from-right-full'}
      `}
            role="alert"
        >
            <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
            <div className="flex-1 pt-0.5">
                <p className="text-sm font-semibold">{message}</p>
            </div>
            <button
                onClick={handleClose}
                className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors"
            >
                <X size={16} className="opacity-50" />
            </button>
        </div>
    );
};

export default NotificationToast;
