'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiSearch, FiX, FiFilter, FiMapPin, FiClock, FiTag } from "react-icons/fi";
import { useUser } from '@clerk/nextjs';

interface Task {
  _id: string;
  title: string;
  category: string;
  price: string;
  taskType: string;
  status: string;
  createdAt: string;
  AssignedTo?: string;
  user?: {
    email?: string;
    avatar: string;
    username: string;
  };
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const { user } = useUser();
  const router = useRouter();
  

  // Fetch tasks assigned to or created by the user
  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks/mytasks', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tasks.');
      }

      const data: Task[] = await response.json();
      setTasks(data);
      setFilteredTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };
  const userEmail = user?.emailAddresses[0]?.emailAddress;
  // Apply filtering based on user selection
  useEffect(() => {
    
    if (!userEmail) return; // Ensure user email is set before filtering

    if (selectedFilter === 'all') {
      setFilteredTasks(tasks);
    } else if (selectedFilter === 'assigned') {
      setFilteredTasks(tasks.filter((task) => task.AssignedTo === userEmail));
    } else if (selectedFilter === 'created') {
      setFilteredTasks(tasks.filter((task) => task.user?.email === userEmail));
    }
  }, [selectedFilter, tasks, userEmail]);

  // Initial fetch
  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle task card click
  const handleCardClick = (taskId: string) => {
    router.push(`/viewtask/${taskId}`);
  };

  // Map status to color dots
  const getStatusDot = (status: string) => {
    switch (status) {
      case 'available':
        return '/green-dot.png';
      case 'assigned':
        return '/yellow-dot.png';
      case 'complete':
        return '/blue-dot.png';
      default:
        return '';
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Filter Buttons */}
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded-md ${
            selectedFilter === 'all' ? 'bg-blue-600' : 'bg-gray-800'
          } text-white`}
          onClick={() => setSelectedFilter('all')}
        >
          All tasks
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            selectedFilter === 'assigned' ? 'bg-blue-600' : 'bg-gray-800'
          } text-white`}
          onClick={() => setSelectedFilter('assigned')}
        >
          Assigned
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            selectedFilter === 'created' ? 'bg-blue-600' : 'bg-gray-800'
          } text-white`}
          onClick={() => setSelectedFilter('created')}
        >
          My Tasks
        </button>
      </div>

      {/* Task Cards */}
      {filteredTasks.length === 0 ? (
        <p className="text-gray-400">No tasks found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <div
                          key={task._id}
                          
                          className="relative bg-gray-800/60 backdrop-blur-lg rounded-xl p-4 cursor-pointer
                            hover:bg-gray-700/50 transition-all duration-200 shadow-xl"
                        >
                          {task.user && (
                            <div className="flex items-center mb-4 pb-2 border-b border-gray-700">
                              <img
                                src={task.user.avatar}
                                className="w-8 h-8 rounded-full mr-3"
                                alt={`${task.user.username}'s avatar`}
                              />
                              <span className="text-gray-200 font-medium text-sm">
                                {task.user.username}
                              </span>
                            </div>
                          )}
            
            <h3 className="text-lg font-bold text-gray-200 mb-2">{task.title}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <FiTag className="text-primary" />
                    <span className="text-sm text-gray-400">{task.category}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <FiMapPin className="text-primary" />
                    <span className="text-sm text-gray-400">{task.taskType}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <FiClock className="text-primary" />
                    <span className="text-sm text-gray-400">{task.createdAt}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-primary font-bold">${task.price}</span>
                    <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
                    onClick={() => handleCardClick(task._id)}
                    >
                      View Details
                    </button>
                  </div>
                        </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
