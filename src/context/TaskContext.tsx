"use client"
import React, { createContext, useState, ReactNode } from "react";

export interface Task {
    _id?: string;
    title: string;
    description: string;
    dueDate: string;
    status: string;
}

export interface TaskContextType {
    taskList: Task[];
    setTaskList: React.Dispatch<React.SetStateAction<Task[]>>;
    task: Task;
    setTask: React.Dispatch<React.SetStateAction<Task>>;
    editId: string;
    setEditId: React.Dispatch<React.SetStateAction<string>>;
}

export const TaskApi = createContext<TaskContextType | null>(null);

const TaskApiProvider = ({ children }: { children: ReactNode }) => {
    const [taskList, setTaskList] = useState<Task[]>([]);
    const [task, setTask] = useState<Task>({
        title: "",
        description: "",
        dueDate: "",
        status: "pending",
    });

    const [editId, setEditId] = useState('');

    const contextValue: TaskContextType = {
        taskList, setTaskList,
        task, setTask,
        editId, setEditId
    }

    return (
        <TaskApi.Provider value={contextValue}>
            {children}
        </TaskApi.Provider>
    )
}

export default TaskApiProvider;