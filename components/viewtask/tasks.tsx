'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Session } from 'inspector/promises';

interface Task {
  _id: string;
  title: string;
  content: string;
  price: string;
  status: string;
  createdAt: string;
  user: {
    avatar: string;
    username: string;
  };
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const router = useRouter();
  const { data: session } = useSession();
  const fetchTasks = async () => {
    const response = await fetch('/api/tasks');
    const data = await response.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCardClick = (taskId: string) => {
    router.push(`/viewtask/${taskId}`);
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'pending':
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
      <h2 className="text-2xl font-bold mb-4">Task List</h2>
      {tasks.length === 0 ? (
        <p className="text-gray-600">No tasks available</p>
      ) : (
        <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div
              key={task._id}
              onClick={() => handleCardClick(task._id)}
              className="relative task !bg-opacity-80 shadow-md rounded-lg border task cursor-pointer hover:bg-gray-100 transition-colors"
            >
              {/* User info */}
              <div className="flex items-center p-4 border-b border-gray-700">
                <img
                  src={'/avatar.svg'}
                  alt={`${session?.user?.email}'s avatar`}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <span className="text-sm text-gray-200 font-semibold">{session?.user?.email}</span>
              </div>

              {/* Task content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{task.title}</h3>
                <p className="text-gray-200 mb-4">{task.content}</p>
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
