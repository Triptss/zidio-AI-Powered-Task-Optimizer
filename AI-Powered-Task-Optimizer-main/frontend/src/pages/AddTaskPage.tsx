import React, { useState } from 'react';
import ConfirmationModal from '../components/common/ConfirmationModal'; // Import the modal
import Button from '../components/common/Button'; // Import common Button

// This could be imported from a shared constants/types file
const availableEmotions = ['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral'];

const AddTaskPage: React.FC = () => {
    const [taskDescription, setTaskDescription] = useState<string>('');
    const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
    const [isCreatingTask, setIsCreatingTask] = useState<boolean>(false);
    const [taskCreationError, setTaskCreationError] = useState<string | null>(null);
    const [taskCreationSuccess, setTaskCreationSuccess] = useState<string | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

    const handleEmotionCheckboxChange = (emotion: string) => {
        setSelectedEmotions(prev =>
            prev.includes(emotion) ? prev.filter(e => e !== emotion) : [...prev, emotion]
        );
    };

    const actualCreateTaskLogic = async () => {
        setIsCreatingTask(true);
        setTaskCreationError(null);
        setTaskCreationSuccess(null);
        setShowConfirmModal(false); // Close modal before API call

        try {
            const response = await fetch('http://localhost:8000/api/v1/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description: taskDescription, associated_emotions: selectedEmotions }),
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ detail: 'Failed to create task. Unknown server error.' }));
                throw new Error(errorData.detail || 'Failed to create task.');
            }
            setTaskCreationSuccess("Task created successfully!");
            setTaskDescription('');
            setSelectedEmotions([]);
        } catch (err) {
            setTaskCreationError(err instanceof Error ? err.message : 'An unexpected error occurred while creating the task.');
            console.error('Failed to create task:', err);
        } finally {
            setIsCreatingTask(false);
        }
    };

    const handleSubmitRequest = () => {
        if (!taskDescription.trim() || selectedEmotions.length === 0) {
            setTaskCreationError("Task description and at least one associated emotion are required.");
            setTaskCreationSuccess(null);
            return;
        }
        // Show confirmation modal instead of direct API call
        setShowConfirmModal(true);
    };


    return (
        <>
            <div className="bg-gray-800 p-6 md:p-8 rounded-lg shadow-xl w-full max-w-2xl flex flex-col items-center animate-fadeIn">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-sky-400">Create New Task</h2>
                <div className="w-full space-y-4">
                    <div>
                        <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-300 mb-1">
                            Task Description
                        </label>
                        <textarea
                            id="taskDescription"
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md placeholder-gray-400 text-white resize-none focus:ring-sky-500 focus:border-sky-500"
                            rows={3}
                            placeholder="Enter task description..."
                            value={taskDescription}
                            onChange={(e) => setTaskDescription(e.target.value)}
                        />
                    </div>

                    <div className="w-full">
                        <p className="mb-2 font-medium text-gray-300">Associate with emotions (select at least one):</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {availableEmotions.map(emotion => (
                                <label key={emotion} className="flex items-center space-x-2 p-3 bg-gray-700 rounded-md hover:bg-gray-600 cursor-pointer transition-colors">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox h-5 w-5 text-sky-500 bg-gray-600 border-gray-500 rounded focus:ring-offset-gray-800 focus:ring-sky-500"
                                        checked={selectedEmotions.includes(emotion)}
                                        onChange={() => handleEmotionCheckboxChange(emotion)}
                                    />
                                    <span className="capitalize text-gray-200">{emotion}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <Button
                        onClick={handleSubmitRequest} // Changed to show modal
                        text={isCreatingTask ? 'Processing...' : 'Add Task to System'}
                        variant="primary" // Using our common button
                        className="w-full" // Common button can take additional classes
                        disabled={isCreatingTask}
                    />

                    {taskCreationError && <p className="text-red-400 mt-3 text-center p-2 bg-red-900/30 rounded-md">{taskCreationError}</p>}
                    {taskCreationSuccess && <p className="text-green-400 mt-3 text-center p-2 bg-green-900/30 rounded-md">{taskCreationSuccess}</p>}
                </div>
            </div>

            <ConfirmationModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                title="Confirm Task Creation"
                message="Are you sure you want to add this task to the system?"
                confirmText="Yes, Create Task"
                onConfirm={actualCreateTaskLogic}
                cancelText="No, Cancel"
                confirmButtonVariant="primary"
            />
        </>
    );
};

export default AddTaskPage;
