'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface Task {
  _id: string;
  title: string;
  content: string;
  price: string;
  status: string;
  createdAt: string;
  createdBy: string;
  category: string;
  user?: {
    avatarUrl: string;
    username: string;
  };
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const router = useRouter();
  const { data: session } = useSession();

  // Fetch user data by user ID
  const fetchUserData = async (userid: string) => {
    const userRes = await fetch(`/api/users/${userid}`);
    if (!userRes.ok) {
      console.error(`Failed to fetch user data for user ID: ${userid}`);
      return null;
    }
    return await userRes.json();
  };

  // Fetch tasks and include user data
  const fetchTasks = async () => {
    const response = await fetch('/api/tasks/viewtask');
    const data: Task[] = await response.json();

    const availableTasks = data.filter((task) => task.status === 'available');

    // Fetch user data for each task
    const tasksWithUserData = await Promise.all(
      availableTasks.map(async (task) => {
        const userData = await fetchUserData(task.createdBy);
        return {
          ...task,
          user: userData,
        };
      })
    );

    setTasks(tasksWithUserData);

    const uniqueCategories = Array.from(
      new Set(tasksWithUserData.map((task) => task.category))
    );
    setCategories(uniqueCategories);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle filtering tasks by category
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredTasks(tasks);
    } else {
      const filtered = tasks.filter((task) => task.category === selectedCategory);
      setFilteredTasks(filtered);
    }
  }, [selectedCategory, tasks]);

  const handleCardClick = (taskId: string) => {
    router.push(`/viewtask/${taskId}`);
  };

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
        <label className="block text-white text-sm font-medium mb-2" htmlFor="category">
          Filter by Category:
        </label>
        <select
          id="category"
          className="bg-gray-800 text-white border border-gray-600 rounded-md p-2 w-200"
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
        <p className="text-gray-600">No tasks available for the selected category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              onClick={() => handleCardClick(task._id)}
              className="relative bg-black !bg-opacity-80 shadow-md rounded-md cursor-pointer hover:bg-gray-700 transition-colors"
            >
              {/* User info */}
              <div className="flex items-center p-4 border-b border-transparent">
                {task.user && (
                  <>
                    <img
                      src={task.user.avatarUrl}
                      alt={`${task.user.username}'s avatar`}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <span className="text-sm text-gray-200 font-semibold">
                      {task.user.username}
                    </span>
                  </>
                )}
              </div>

              {/* Task content */}
              <div className="p-4">
                <h3 className="text-lg text-indigo-700 font-bold mb-2">{task.title}</h3>
                <p className="text-gray-400 mb-4">{task.content}</p>
                <p className="text-lg font-bold text-white mb-2">TL {task.price}</p>
                <p className="text-sm text-gray-400">
                  Created At: {new Date(task.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Status dot */}
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
