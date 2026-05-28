import React, { useContext, useState } from "react";
import { CalendarClock, Edit3, Loader2, PlusCircle } from "lucide-react";
import axios from "axios";
import { handleFailure, handleSuccess } from "@/lib/notification";
import { TaskApi } from "@/context/TaskContext";

interface TaskFormProps {
    setShowPopUp: React.Dispatch<React.SetStateAction<boolean>>;
}

const TaskForm: React.FC<TaskFormProps> = ({ setShowPopUp }) => {
    const context = useContext(TaskApi);

    if (!context) {
        throw new Error("TaskForm must be used within a TaskApiProvider");
    }

    const { setTaskList, task, setTask, editId, setEditId } = context;
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTask((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddTask = async () => {
        try {
            setLoading(true);
            const response = await axios.post('/api/tasks', task);
            const { message, success } = response.data;

            if (success) {
                setTaskList((prev) => [response.data.newTask, ...prev]);
                handleSuccess(message);
                setTask({
                    title: "",
                    description: "",
                    dueDate: "",
                    status: "pending",
                });
                setShowPopUp(false);
            }
        } catch (error: any) {
            if (error.response) {
                const data = error.response.data;
                handleFailure(data.error || "Invalid credentials");
            } else {
                console.log('Error in issue submit', error.message);
                handleFailure("Network error something went wrong");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEditTask = async (taskId: string) => {
        try {
            setLoading(true);
            const res = await axios.patch(`/api/tasks/${taskId}`, task);
            const { success, message } = res.data;

            if (success) {
                setTaskList((prev) =>
                    prev.map((t) =>
                        (t._id === taskId) ? { ...t, ...res.data.updatedTask } : t
                    )
                );
                setShowPopUp(false);
                handleSuccess(message);
                setEditId('');
                setTask({
                    title: "",
                    description: "",
                    dueDate: "",
                    status: "pending",
                });
            }
        } catch (error: any) {
            if (error.response) {
                const data = error.response.data;
                handleFailure(data.error);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editId) {
            handleEditTask(editId);
        } else {
            handleAddTask();
        }
    };

  return (
    <div>
        <div className='w-full h-full fixed bg-black opacity-40 top-0 left-1/2 transform -translate-x-1/2 z-99'></div>
        <form onSubmit={handleSubmit}
        className="mx-auto w-full max-w-xl text-black p-6 bg-white backdrop-blur rounded-2xl shadow-lg ring-1 ring-slate-200 dark:ring-slate-800 absolute top-0 md:top-[20%] 
        left-1/2 -translate-x-1/2 z-99999">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="bg-linear-to-br from-indigo-500 to-pink-500 p-2 rounded-full text-white shadow-md">
                        <PlusCircle size={18} />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 ">Add / Edit Task</h3>
                        <p className="text-sm text-black">Create a focused task with a deadline and status</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="relative flex flex-col">
                    <span className="flex items-center gap-2 text-sm text-black font-medium">
                        <Edit3 size={16} /> Title
                    </span>
                    <input onChange={handleChange}
                    name="title"
                    value={task.title}
                    placeholder="e.g. Finish project proposal" 
                    className="mt-2 w-full rounded-lg border 
                    text-black border-slate-200 dark:border-slate-800 px-4 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                
                </label>

                <label className="relative flex flex-col">
                    <span className="flex items-center gap-2 text-sm text-black  font-medium">
                        <CalendarClock size={16} /> Due Date
                    </span>
                    <input onChange={handleChange}
                    type="date" 
                    name="dueDate"
                    value={task.dueDate}
                    className="mt-2 rounded-lg border border-slate-200 dark:border-slate-800 px-4 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </label>

                <label className="sm:col-span-2 flex flex-col">
                    <span className="text-sm text-black  font-medium">Description</span>
                    <input onChange={handleChange}
                    name="description"
                    value={task.description}
                    placeholder="Add more details about the task" 
                    className="mt-2 w-full rounded-lg border border-slate-200 dark:border-slate-800 px-4 py-3 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" />
                </label>

                <label className="flex flex-col">
                    <span className="text-sm text-black  font-medium">Status</span>
                    <select onChange={handleChange}
                    name="status"
                    value={task.status}
                    className="mt-2 rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400">
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </label>

                <div className="flex items-end justify-end sm:col-span-2 gap-2">
                    <button onClick={() => {
                        setShowPopUp(false); 
                        setTask({
                            title: "",
                            description: "",
                            dueDate: "",
                            status: "pending",
                        });
                        setEditId('');
                    }}
                    type="button" 
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm 
                    bg-gray-200 font-medium text-black hover:bg-gray-300">
                        Cancel
                    </button>
                    <button type="submit"  
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-60">
                        {loading ? <Loader2 size={18} className="animate-spin" /> : editId ? 'Edit' : 'Add' }
                    </button>
                </div>
            </div>
        </form>
    </div>
  );
}

export default TaskForm;
