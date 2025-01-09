'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react'; // Import for session handling
import { useSession } from 'next-auth/react';

interface Task {
  _id: string;
  title: string;
  content: string;
  price: string;
  status: string;
  createdAt: string;
  assignedTo: string; // Add this field for filtering
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { data: session } = useSession();

  const fetchTasks = async () => {
    try {
      const session = await getSession();
      if (!session) {
        setError("You must be logged in to view tasks.");
        return;
      }

      const userId = session.user?.email; // Get logged-in user's ID
      const response = await fetch('/api/tasks/viewtask'); // Fetch all tasks
      const data: Task[] = await response.json();

      // Filter tasks where acceptedBy matches the user's ID
      const userTasks = data.filter((task) => task.assignedTo === userId);
      setTasks(userTasks);
    } catch (err) {
      setError(err+"Failed to fetch tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);
  
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

  if (loading) return <div>Loading tasks...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <section >
      <div className="container mx-auto p-6">

      {tasks.length === 0 ? (
        <p className="text-gray-600">You have not accepted any tasks yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div
              key={task._id}
              onClick={() => handleCardClick(task._id)}
              className="relative bg-white shadow-md rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
            >
              {/* User info */}
              <div className="flex items-center p-4 border-b border-gray-200">
                <img
                  src={'/avatar.svg'}
                  alt={`${session?.user?.email}'s avatar`}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <span className="text-sm font-semibold">{session?.user?.email}</span>
              </div>

              {/* Task content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{task.title}</h3>
                <p className="text-gray-700 mb-4">{task.content}</p>
                <p className="text-md text-green-600 mb-2">Price: {task.price}</p>
                <p className="text-sm text-gray-500">
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
    
    </section>
    
  );
};

export default TaskList;
