"use client"

import Header from '@/components/layout/Header'
import TaskCard from '@/components/ui/TaskCard'
import TaskForm from '@/components/ui/TaskForm'
import { TaskApi } from '@/context/TaskContext'
import { handleFailure, handleSuccess } from '@/lib/notification'
import axios from 'axios'
import { BookX } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'

const page = () => {
  const context = useContext(TaskApi);
  if (!context) {
    throw new Error("Dashboard must be used within a TaskApiProvider");
  }
  const { taskList, setTaskList } = context;
  const [showPopUp, setShowPopUp] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [filteredTasks, setFilteredTasks] = useState(taskList);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getTask = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/tasks");
        const {success, tasks} = res.data;

        if(success) {
          setLoading(false);
          setTaskList(tasks);
        }
      } catch (error: any) {
        if(error.response) {
          setLoading(false);
          const data = error.response.data;
          handleFailure(data.error || "Invalid credentials");
        }
        else {
          console.log('Error in issue submit', error.message);
          handleFailure("Network error something went wrong");
        }
      }
    };
    getTask();
  }, [setTaskList]);

  return (
    <div className='w-full min-h-screen bg-indigo-100 overflow-auto'>
      <Header 
      setShowPopUp={setShowPopUp} 
      setFilteredTasks={setFilteredTasks} 
      selectedStatus={selectedStatus} 
      />
      <div className='p-5 w-full'>
        <div className='px-5 relative'>
          {showPopUp && <TaskForm setShowPopUp={setShowPopUp} />}
        </div>

        {taskList.length > 0 && (<div className="flex flex-col sm:flex-row gap-1 sm:gap-3 my-4 ml-3">
          <label htmlFor="status" className="text-gray-800 text-lg font-semibold">
            Filter by Status:
          </label>

          <select
            id="status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 max-w-[150px] w-full
            shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all duration-200"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>)}

        <h1 className='text-2xl mb-3 sm:mb-0 text-black ml-3 font-semibold underline'>Your Tasks: </h1>
        <div>
            {loading ? (
              <div className="flex flex-col justify-center items-center gap-3 mt-10 text-gray-600 font-medium">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
                <p>Loading tasks...</p>
              </div>
            ) : filteredTasks.length > 0 ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-center 
              place-content-center md:p-5'>
                {filteredTasks.map((task: any) => (
                <TaskCard
                  key={task._id}
                  taskInfo={task}
                  setShowPopUp={setShowPopUp}
                />
              ))}
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center gap-3 mt-4 font-semibold text-gray-600 col-span-full">
                <BookX size={80} />
                <p>No tasks found!</p>
              </div>
            )}
        </div>

      </div>
    </div>
  )
}

export default page