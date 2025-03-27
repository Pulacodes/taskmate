/* eslint-disable @next/next/no-img-element */
'use client';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { FiSearch, FiX, FiFilter, FiMapPin, FiClock, FiTag } from "react-icons/fi";
import Image from 'next/image';
import Link from 'next/link';

interface Task {
  _id: string;
  title: string;
  content: string;
  taskType: string;
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
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const router = useRouter();

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks/viewtask', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch tasks.');
      const data: Task[] = await response.json();

      const availableTasks = data.filter(task =>
        task.status.toLowerCase() === 'available'
      );
      setTasks(availableTasks);
      setCategories(Array.from(new Set(availableTasks.map(task => task.category))));
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const filteredTasks = useMemo(() => {
    let result = tasks.filter(task =>
      task.status.toLowerCase() === 'available'
    );

    if (selectedCategory !== 'all') {
      result = result.filter(task => task.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.content.toLowerCase().includes(query) ||
        task.taskType.toLowerCase().includes(query) ||
        task.category.toLowerCase().includes(query)

      );
    }

    return result;
  }, [tasks, selectedCategory, searchQuery]);

  useEffect(() => { fetchTasks(); }, []);

  const handleCardClick = (taskId: string) => {
    router.push(`/viewtask/${taskId}`);
  };



  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl text-center text-white font-bold mb-6">Task Marketplace</h2>

      {/* Search Palette */}
      <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} 
              placeholder="Search for freelance tasks..."
              className="w-full mb-4 bg-gray-800 text-white border border-dark-border rounded-lg py-3 px-12 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-accent hover:text-dark-foreground"
              >
                <FiX />
              </button>
            )}
          </div>

      {/* Filters Section */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4 sm:items-center">
        <div className="flex-1">
          <select
            className="w-mid bg-gray-800 text-white border border-gray-700 rounded-lg p-2
              focus:ring-2 focus:ring-blue-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <Link
          href="/tasks"
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3
            hover:bg-blue-700 transition-colors duration-200 font-semibold"
        >
          Add Task
          <Image src="/plus.svg" width={20} height={20} alt="add" />
        </Link>
      </div>

      {/* Task Grid */}
      {filteredTasks.length === 0 ? (
        <p className="text-gray-400 text-center py-12">No tasks found matching your search criteria.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map(task => (
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
      <p className="text-gray-400 text-sm mb-3">{task.content}</p>
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