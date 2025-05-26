import React from 'react';
import Button from './Button'; // Import the common Button component

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    confirmText: string;
    onConfirm: () => void;
    cancelText?: string; // Optional, defaults to "Cancel"
    confirmButtonVariant?: 'primary' | 'secondary' | 'danger' | 'outline';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    title,
    message,
    confirmText,
    onConfirm,
    cancelText = "Cancel",
    confirmButtonVariant = 'primary',
}) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-[1000] grid place-items-center overflow-auto bg-opacity-75 backdrop-blur-sm animate-fadeIn"
            onClick={onClose}
        >
            <div
                className="bg-gray-800 p-6 rounded-lg shadow-xl w-11/12 max-w-md border border-gray-700 transform transition-all duration-300 ease-out scale-95 group-hover:scale-100" // Added some animation classes
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal content
            >
                <h3 className="text-2xl font-semibold text-sky-400 mb-4">{title}</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">{message}</p>
                <div className="flex items-center justify-end gap-x-4">
                    <Button
                        onClick={onClose}
                        text={cancelText}
                        variant="secondary" // Or "outline" for a less prominent cancel
                        className="px-4 py-2"
                    />
                    <Button
                        onClick={onConfirm}
                        text={confirmText}
                        variant={confirmButtonVariant}
                        className="px-4 py-2"
                    />
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
