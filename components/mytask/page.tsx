'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Task {
  _id: string;
  title: string;
  content: string;
  price: string;
  status: string;
  createdAt: string;
  category: string;
  user?: {
    avatar: string;
    username: string;
  };
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const router = useRouter();

  // Fetch tasks and handle user data directly from API
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

      // Filter available tasks
      const availableTasks = data.filter((task) => task.status === 'available');
      setTasks(availableTasks);

      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(availableTasks.map((task) => task.category))
      );
      setCategories(uniqueCategories);

      // Set filtered tasks initially to all available tasks
      setFilteredTasks(availableTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Handle filtering tasks by category
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredTasks(tasks);
    } else {
      const filtered = tasks.filter((task) => task.category === selectedCategory);
      setFilteredTasks(filtered);
    }
  }, [selectedCategory, tasks]);

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
      <h2 className="text-2xl text-white font-bold mb-4">Task List</h2>

      {/* Category Filter Dropdown */}
      <div className="mb-6">
        <label
          className="block text-white text-sm font-medium mb-2"
          htmlFor="category"
        >
          Filter by Category:
        </label>
        <select
          id="category"
          className="bg-gray-800 text-white border border-gray-600 rounded-md p-2 w-full"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Task Cards */}
      {filteredTasks.length === 0 ? (
        <p className="text-gray-600">No tasks have been assigned to you yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              onClick={() => handleCardClick(task._id)}
              className="relative bg-black bg-opacity-80 shadow-md rounded-md cursor-pointer hover:bg-gray-700 transition-colors"
            >
              {/* User Info */}
              {task.user && (
                <div className="flex items-center p-4 border-b border-transparent">
                  <img
                    src={task.user.avatar}
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
                <p className="text-gray-400 mb-4">{task.content}</p>
                <p className="text-lg font-bold text-white mb-2">TL {task.price}</p>
                <p className="text-sm text-gray-400">
                  Created At: {new Date(task.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Status Dot */}
              <div className="absolute bottom-4 right-4">
                <img src={getStatusDot(task.status)} alt={task.status} className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
