'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useUser } from '@clerk/nextjs';

interface Task {
  _id: string;
  title: string;
  category: string;
  price: string;
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
              onClick={() => handleCardClick(task._id)}
              className="relative bg-black max-h-60 bg-opacity-80 shadow-md rounded-md cursor-pointer hover:bg-gray-700 transition-colors"
            >
              {/* User Info */}
              {task.user && (
                <div className="flex items-center p-4 border-b border-transparent">
                  <Image
                    src={task.user.avatar}
                    width={50}
                    height={50}
                    alt={`${task.user.username}'s avatar`}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <span className="text-sm text-gray-200 font-semibold">
                    {task.user.username}
                  </span>
                </div>
              )}

              {/* Task Content */}
              <div className="p-4">
                <h3 className="text-lg text-indigo-700 font-bold mb-2">{task.title}</h3>
                <p className="text-gray-400 mb-4">{task.category}</p>
                <p className="text-lg font-bold text-white mb-2">TL {task.price}</p>
                <p className="text-sm text-gray-400">
                  Created At: {new Date(task.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Status Dot */}
              <div className="absolute text-gray-400 bottom-4 right-4">
                {task.status}<Image src={getStatusDot(task.status)} width={30} height={30} alt={task.status} className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
