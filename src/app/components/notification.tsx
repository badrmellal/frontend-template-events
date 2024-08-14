import React, { useEffect } from 'react';
import { XMarkIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

type NotificationProps = {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
};

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3500);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div
            className={`fixed top-3 right-3 w-full max-w-[90%] sm:max-w-sm p-3 sm:p-4 rounded-lg shadow-lg flex items-start space-x-2 sm:space-x-3 ${
                 'bg-white border border-gray-200'
            }`}
       
        >
            {type === 'success' ? (
                <CheckCircleIcon className="w-5 sm:w-6 h-5 sm:h-6 text-green-400" />
            ) : (
                <ExclamationCircleIcon className="w-5 sm:w-6 h-5 sm:h-6 text-red-400" />
            )}
            <div className="flex-grow">
                <span className="block font-medium text-gray-800 text-sm sm:text-base">
                    {type === 'success' ? 'Success!' : 'Error!'}
                </span>
                <span className="block text-gray-500 text-xs sm:text-sm">
                    {message}
                </span>
            </div>
            <XMarkIcon
                className="w-5 sm:w-6 h-5 sm:h-6 text-gray-400 cursor-pointer hover:text-gray-600"
                onClick={onClose}
            />
        </div>
    );
};

export default Notification;
