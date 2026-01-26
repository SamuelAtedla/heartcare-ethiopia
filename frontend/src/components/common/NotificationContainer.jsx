import React from 'react';
import { useNotification } from '../../context/NotificationContext';
import NotificationToast from './NotificationToast';

const NotificationContainer = () => {
    const { notifications, removeNotification } = useNotification();

    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
            <div className="flex flex-col gap-3 pointer-events-auto">
                {notifications.map((notification) => (
                    <NotificationToast
                        key={notification.id}
                        {...notification}
                        onClose={removeNotification}
                    />
                ))}
            </div>
        </div>
    );
};

export default NotificationContainer;
