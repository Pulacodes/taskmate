'use client';

import { useState } from 'react';

interface Task {
  title: string;
  content: string;
  price: number;
  status: string;
}

const AddTask: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [price, setPrice] = useState('');

  const addTask = async () => {
    if (!title || !content || !price) {
      alert('Please fill in all fields');
      return;
    }

    const task: Task = { 
      title, 
      content, 
      price: parseFloat(price), 
      status: 'Pending' // Set default status
    };

    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });

    if (response.ok) {
      alert('Task added successfully');
      setTitle('');
      setContent('');
      setPrice('');
    } else {
      alert('Failed to add task');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/banner.jpg')] bg-cover bg-center py-20">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-lg w-full">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Add New Task</h2>
        
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Display default status */}
          <div className="text-gray-600">Status: <span className="font-semibold text-blue-500">Pending</span></div>

          <button
            onClick={addTask}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTask;
