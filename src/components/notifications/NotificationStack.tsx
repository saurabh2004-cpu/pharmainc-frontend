import React from 'react';
import { JobApplicationPopup, JobApplicationPopupProps } from './JobApplicationPopup';
import { X } from 'lucide-react';

interface NotificationStackProps {
    notifications: JobApplicationPopupProps[];
    onClose: (id: string) => void;
    onCloseAll?: () => void;
    onActionComplete?: (id: string) => void;
}

export const NotificationStack = ({ notifications, onClose, onCloseAll, onActionComplete }: NotificationStackProps) => {
    if (notifications.length === 0) return null;

    // Close all notifications and trigger API call
    const handleCloseAll = () => {
        if (onCloseAll) {
            onCloseAll();
        } else {
            // Fallback: individual closing
            notifications.forEach(notification => {
                onClose(notification.id);
            });
        }
    };

    // Show up to 5 notifications in the stack
    const visibleNotifications = notifications.slice(0, 5);

    return (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] pointer-events-auto">
            {/* Stacked Notifications Container - Stairs Effect */}
            <div className="relative" style={{ width: '550px', height: '280px' }}>
                {/* Each notification card positioned absolutely to create stairs effect */}
                {visibleNotifications.map((notification, index) => {
                    // Calculate offsets for stairs effect
                    // Newest (index 0) is fully on top
                    // Each subsequent card is offset down and to the right
                    const offsetY = index * 12; // Vertical offset (step down)
                    const offsetX = index * 8;  // Horizontal offset (step right)
                    const scale = 1 - (index * 0.03); // Slight scale reduction
                    const zIndex = visibleNotifications.length - index; // Newest on top

                    return (
                        <div
                            key={notification.id}
                            className="absolute top-0 left-0 transition-all duration-300 ease-out"
                            style={{
                                transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
                                zIndex: zIndex,
                                width: '550px',
                            }}
                        >
                            <div className="animate-in slide-in-from-top-4 fade-in duration-300">
                                <JobApplicationPopup
                                    {...notification}
                                    onClose={onClose}
                                    onActionComplete={onActionComplete}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Close All Button */}
            {notifications.length > 1 && (
                <button
                    onClick={handleCloseAll}
                    className="mt-4 mx-auto block px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 text-base font-medium rounded-full shadow-lg border border-gray-200 transition-all duration-200 hover:shadow-xl hover:scale-105 flex items-center gap-2 group"
                    aria-label="Close all notifications"
                >
                    <X className="w-4 h-4 transition-transform group-hover:rotate-90 duration-200" />
                    Close All ({notifications.length})
                </button>
            )}
        </div>
    );
};
