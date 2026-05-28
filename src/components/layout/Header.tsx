"use client";

import React, { useContext, useEffect, useState } from 'react';
import { Search, PlusCircle, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { handleFailure, handleSuccess } from '@/lib/notification';
import axios from 'axios';
import { TaskApi, Task } from '@/context/TaskContext';

interface HeaderProps {
  setShowPopUp: React.Dispatch<React.SetStateAction<boolean>>;
  setFilteredTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  selectedStatus: string;
}

const Header: React.FC<HeaderProps> = ({ setShowPopUp, setFilteredTasks, selectedStatus }) => {
  const router = useRouter();
  const context = useContext(TaskApi);

  if (!context) {
    throw new Error("Header must be used within a TaskApiProvider");
  }

  const { taskList } = context;
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = async () => {
    try {
      const res = await axios.get("/api/users/logout");
      const { success, message } = res.data;

      if (success) {
        handleSuccess(message);
        router.push("/login");
      }
    } catch (error: any) {
      if (error.response) {
        handleFailure(error.response.data.error || "Failed to logout");
      } else {
        handleFailure("Network error while logging out");
      } 
    }
  }

  useEffect(() => {
    let filtered = taskList;

    if (selectedStatus !== 'all') {
      filtered = filtered.filter((task) => 
        task.status.toLowerCase() === selectedStatus.toLowerCase()
      );
    }

    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(lower) ||
          task.description.toLowerCase().includes(lower)
      );
    }
    setFilteredTasks(filtered);
    
  }, [searchTerm, taskList, selectedStatus, setFilteredTasks]);

  return (
    <header className="flex items-center justify-between py-4 px-4 md:px-6 bg-white shadow-md">
      <button onClick={() => setShowPopUp(true)}
      className="flex justify-center outline-0 items-center space-x-2 px-4 py-2 bg-linear-to-br from-indigo-500 to-pink-500
       text-white rounded-full shadow-md hover:from-indigo-600 hover:to-pink-600 transition-all duration-200
       cursor-pointer">
        <PlusCircle size={20} />
        <span className="hidden md:block">Add New Task</span>
      </button>

      <div className="grow mx-4 max-w-md relative">
        <input onChange={(e) => setSearchTerm(e.target.value)}
          type="text"
          value={searchTerm}
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2 text-black rounded-full bg-gray-100 border border-gray-200 
          focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>
      <button onClick={handleLogout}
      className='bg-gray-300 text-white p-2 rounded-lg flex items-center gap-2 
      bg-linear-to-br from-indigo-500 to-pink-500
        shadow-md hover:from-indigo-600 hover:to-pink-600 transition-all duration-200 cursor-pointer'>
        <LogOut size={18} />
        <p className='hidden md:block'>LogOut</p>
      </button>
    </header>
  );
};

export default Header;