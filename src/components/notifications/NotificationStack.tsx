import React from 'react';
import { JobApplicationPopup, JobApplicationPopupProps } from './JobApplicationPopup';

interface NotificationStackProps {
    notifications: JobApplicationPopupProps[];
    onClose: (id: string) => void;
    onActionComplete?: (id: string) => void;
}

export const NotificationStack = ({ notifications, onClose, onActionComplete }: NotificationStackProps) => {
    if (notifications.length === 0) return null;

    return (
        <div className="fixed top-4 inset-x-0 z-[9999] flex flex-col items-center gap-2 pointer-events-none px-4 sm:px-6">
            {notifications.map((notification) => (
                <JobApplicationPopup
                    key={notification.id}
                    {...notification}
                    onClose={onClose}
                    onActionComplete={onActionComplete}
                />
            ))}
        </div>
    );
};
