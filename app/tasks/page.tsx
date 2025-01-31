'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from 'next/navigation';


interface Task {
  title: string;
  content: string;
  category: string;
  location: string;
  taskType: string;
  Duedate: string;
  price: number;
  status: string;
}

const AddTask: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [price, setPrice] = useState('');
  const [taskType, setTaskType] = useState(" ");
  const [Duedate, setDuedate] = useState('');
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState('');
  const router = useRouter();

  const addTask = async () => {
    if (!title || !content || !price || !category) {
      alert('Please fill in all fields');
      return;
    }

    const task: Task = { 
      title, 
      content, 
      category,
      Duedate,
      taskType,
      location,
      price: parseFloat(price), 
      status: 'available' // Set default status
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
      setDuedate('');
      setCategory('');
      router.push('/viewtask')
      
    } else {
      alert('Failed to add task');
    }
  };

  return (
    
    <div className="min-h-screen flex items-center justify-center bg-[url('/taskback.jpg')] bg-cover bg-center py-30">
      
      <div className="bg-black bg-opacity-80 shadow-md rounded-lg p-6 max-w-lg w-full">
        <h2 className="text-2xl font-bold text-center text-gray-200 mb-6">Add New Task</h2>
        
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className='space-y-4'>
            <Select value={category} onValueChange={(value) => setCategory(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Academic Support">Academic Support</SelectItem>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Creative Work">Creative Work</SelectItem>
                <SelectItem value="Daily Assistance">Daily Assistance</SelectItem>
                <SelectItem value="Career and Professional Services">Career and Professional Services</SelectItem>
                <SelectItem value="Fitness and Wellness">Fitness and Wellness</SelectItem>
                <SelectItem value="Miscellaneous">Miscellaneous</SelectItem>
                <SelectItem value="Hobbies and Interests">Hobbies and Interests</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <textarea
            placeholder="Please describe the details of the task, list specific points you need fulfilled to avoid confusion"
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
          <label className="block mb-4 text-gray-200 font-medium">
            Task Type:
            <select value={taskType} onChange={(e) => setTaskType(e.target.value)} className="w-full p-2 rounded text-black">
              <option value="remote">Remote</option>
              <option value="physical">Physical</option>
            </select>
          </label>

          {taskType === "physical" && (
          <label className="block mb-4 text-gray-200 font-medium">
            Location Details:
               <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-2 rounded text-black" required />
          </label>
          )}


           <label htmlFor="duedate" className="block text-gray-200 font-medium">Due date:(optionatl)</label>
          <input
            type="date"
            id='duedate'
            value={Duedate}
            onChange={(e) => setDuedate(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={addTask}
            className="w-full py-3 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTask;
