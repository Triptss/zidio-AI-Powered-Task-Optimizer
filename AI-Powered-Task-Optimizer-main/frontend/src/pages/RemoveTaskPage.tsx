import React, { useState, useEffect } from 'react';
import ConfirmationModal from '../components/common/ConfirmationModal'; // Import the modal
import Button from '../components/common/Button'; // Import common Button

// TODO: Import Task interface if moved to a shared types file
interface Task {
    id: string;
    description: string;
    associated_emotions: string[];
    created_at: string;
}

const RemoveTaskPage: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [deleteStatus, setDeleteStatus] = useState<{ [key: string]: string | null }>({});

    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [taskToDeleteId, setTaskToDeleteId] = useState<string | null>(null);
    const [taskToDeleteDescription, setTaskToDeleteDescription] = useState<string>('');


    const fetchTasks = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:8000/api/v1/tasks');
            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }
            const data: Task[] = await response.json();
            setTasks(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const actualDeleteTaskLogic = async () => {
        if (!taskToDeleteId) return;

        setDeleteStatus(prev => ({ ...prev, [taskToDeleteId]: 'Deleting...' }));
        setShowDeleteModal(false); // Close modal before API call

        try {
            const response = await fetch(`http://localhost:8000/api/v1/tasks/${taskToDeleteId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.detail || `Failed to delete task (status: ${response.status})`);
            }
            setDeleteStatus(prev => ({ ...prev, [taskToDeleteId]: 'Deleted successfully!' }));
            fetchTasks();
            const deletedTaskId = taskToDeleteId; // Capture the ID at the time of deletion
            setTimeout(() => {
                setDeleteStatus(prev => ({ ...prev, [deletedTaskId!]: null }));
                // Only nullify taskToDeleteId if it hasn't been changed by a new delete request
                setTaskToDeleteId(currentId => currentId === deletedTaskId ? null : currentId);
            }, 3000);
        } catch (err) {
            const failedTaskId = taskToDeleteId; // Capture the ID
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during deletion.';
            setDeleteStatus(prev => ({ ...prev, [failedTaskId!]: errorMessage }));
            console.error(`Failed to delete task ${failedTaskId}:`, err);
            setTimeout(() => {
                setDeleteStatus(prev => ({ ...prev, [failedTaskId!]: null }));
                // Only nullify taskToDeleteId if it hasn't been changed by a new delete request
                setTaskToDeleteId(currentId => currentId === failedTaskId ? null : currentId);
            }, 5000);
        }
    };

    const requestDeleteTask = (task: Task) => {
        setTaskToDeleteId(task.id);
        setTaskToDeleteDescription(task.description);
        setShowDeleteModal(true);
    };

    return (
        <>
            <div className="bg-gray-800 p-6 md:p-8 rounded-lg shadow-xl w-full max-w-3xl flex flex-col items-center animate-fadeIn">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-sky-400">Manage Tasks</h2>

                {isLoading && <p className="text-yellow-400">Loading tasks...</p>}
                {error && <p className="text-red-400 p-3 bg-red-900/30 rounded-md">Error loading tasks: {error}</p>}

                {!isLoading && !error && tasks.length === 0 && (
                    <p className="text-gray-400">No tasks found. Add some tasks via the "Add Task" page!</p>
                )}

                {!isLoading && !error && tasks.length > 0 && (
                    <div className="w-full space-y-3">
                        {tasks.map(task => (
                            <div key={task.id} className="bg-gray-700 p-4 rounded-md flex flex-col sm:flex-row justify-between sm:items-center shadow">
                                <div className="mb-2 sm:mb-0">
                                    <p className="text-lg font-semibold text-gray-100">{task.description}</p>
                                    <p className="text-xs text-gray-400">
                                        Emotions: {task.associated_emotions.join(', ') || 'None'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Created: {new Date(task.created_at).toLocaleString()}
                                    </p>
                                </div>
                                <Button
                                    onClick={() => requestDeleteTask(task)}
                                    text={deleteStatus[task.id] === 'Deleting...' ? 'Deleting...' : 'Delete'}
                                    variant="danger"
                                    className="text-sm py-1 px-3 w-full sm:w-auto"
                                    disabled={!!deleteStatus[task.id] && deleteStatus[task.id] === 'Deleting...'}
                                />
                            </div>
                        ))}
                        {/* Displaying status messages separately to avoid layout shifts within map */}
                        {Object.entries(deleteStatus).map(([id, statusMsg]) => {
                            if (!statusMsg) return null;
                            const task = tasks.find(t => t.id === id);
                            return (
                                <p key={`${id}-status`}
                                    className={`text-xs mt-1 ${statusMsg.includes('successfully') ? 'text-green-400' : 'text-red-400'}`}>
                                    Task "{task ? task.description.substring(0, 20) + '...' : id}": {statusMsg}
                                </p>
                            );
                        })}
                    </div>
                )}
            </div>
            {taskToDeleteId && (
                <ConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={() => { setShowDeleteModal(false); setTaskToDeleteId(null); }}
                    title="Confirm Task Deletion"
                    message={`Are you sure you want to delete the task: "${taskToDeleteDescription}"? This action cannot be undone.`}
                    confirmText="Yes, Delete Task"
                    onConfirm={actualDeleteTaskLogic}
                    cancelText="No, Cancel"
                    confirmButtonVariant="danger"
                />
            )}
        </>
    );
};

export default RemoveTaskPage;
