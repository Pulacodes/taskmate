'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import loadingAnimation from "@/public/Animation.json";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from 'next/navigation';

const Lottie = dynamic(
  () => import('lottie-react'),
  { ssr: false }
);
const AddTask: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [price, setPrice] = useState('');
  const [taskType, setTaskType] = useState('remote');
  const [Duedate, setDuedate] = useState('');
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  

  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files)); // Store selected files
    }
  };

  const addTask = async () => {
    if (!title || !content || !price || !category) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    formData.append("Duedate", Duedate);
    formData.append("taskType", taskType);
    formData.append("location", location);
    formData.append("price", price);
    formData.append("status", "available");

    // Append files
    files.forEach((file) => formData.append("files", file));

    const response = await fetch('/api/tasks', {
      method: 'POST',
      body: formData, // Send FormData instead of JSON
    });

    if (response.ok) {
      alert('Task added successfully');
      setTitle('');
      setContent('');
      setPrice('');
      setDuedate('');
      setCategory('');
      setFiles([]);
      setLoading(false);
      router.push('/viewtask');
    } else {
      alert('Failed to add task');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <Lottie animationData={loadingAnimation} loop className="w-52 h-52" />
      </div>
    );
  }

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
          
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full">
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

          <textarea
            placeholder="Describe the task in detail"
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

          <label className="block text-gray-200 font-medium">
            Task Type:
            <select value={taskType} onChange={(e) => setTaskType(e.target.value)} className="w-full p-2 rounded text-black">
              <option value="remote">Remote</option>
              <option value="physical">Physical</option>
            </select>
          </label>

          {taskType === "physical" && (
            <label className="block text-gray-200 font-medium">
              Location Details:
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2 rounded text-black"
              />
            </label>
          )}

          <label htmlFor="duedate" className="block text-gray-200 font-medium">Due date (optional):</label>
          <input
            type="date"
            id="duedate"
            value={Duedate}
            onChange={(e) => setDuedate(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* File Upload */}
          <label className="block text-gray-200 font-medium">Upload Images or Files:</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full p-2 text-gray-200"
            accept="image/*, .pdf, .docx"
          />

          {/* Show Selected Files */}
          {files.length > 0 && (
            <div className="mt-2">
              <p className="text-gray-300 font-medium">Selected Files:</p>
              <ul className="text-gray-400">
                {files.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}

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
