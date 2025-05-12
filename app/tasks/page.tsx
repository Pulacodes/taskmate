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
import { useDropzone } from "react-dropzone";
import { FiUploadCloud, FiCalendar, FiX, FiFile } from "react-icons/fi";

const AddTask: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [price, setPrice] = useState('');
  const [taskType, setTaskType] = useState('remote');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  const router = useRouter();

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".gif"],
      "application/pdf": [".pdf"],
      "application/msword": [".doc", ".docx"],
      "text/plain": [".txt"],
      "application/vnd.ms-excel": [".xlsx", ".csv"]
    },
    maxSize: 50 * 1024 * 1024,
    onDrop: (acceptedFiles) => {
      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    }
  });

  const removeFile = (fileToRemove: File) => {
    setFiles(files.filter((file) => file !== fileToRemove));
  };

  const addTask = async () => {
    setIsSubmitting(true);
    if (!title || !content || !price || !category) {
      alert('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    formData.append("dueDate", dueDate);
    formData.append("taskType", taskType);
    formData.append("location", location);
    formData.append("price", price);
    formData.append("status", "available");

    files.forEach((file) => formData.append("files", file));

    const response = await fetch('/api/tasks', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      alert('Task added successfully');
      setTitle('');
      setContent('');
      setPrice('');
      setDueDate('');
      setCategory('');
      setLocation('');
      setFiles([]);
      setLoading(false);
      router.push('/viewtask');
    } else {
      alert('Failed to add task');
      setLoading(false);
    }
  };

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-primary/10 to-transparent bg-gray-900 bg-cover bg-center py-30">
      <div className="min-w-screen bg-black rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-center text-gray-200 mb-6">Add New Task</h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block font-body text-gray-200 mb-2">
              Task Title *
            </label>
            <input
              type="text"
              id="title"
              maxLength={100}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-sm border border-gray-600 bg-black focus:outline-none focus:ring-2 focus:ring-ring text-white"
              placeholder="eg. Wash 1 bag of laundry"
            />
          </div>

          <div>
            <label htmlFor="description" className="block font-body text-gray-200 mb-2">
              Description
            </label>
            <textarea
              id="description"
              maxLength={500}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 rounded-sm border border-gray-600 bg-black focus:outline-none focus:ring-2 focus:ring-ring text-white"
              placeholder="Describe task details"
            />
          </div>

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-3 border border-gray-600 bg-black rounded-lg focus:outline-none text-white focus:ring-2 focus:ring-blue-500"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div>
              <label htmlFor="tasktype" className="block text-white font-body text-foreground mb-2">
                Location
              </label>
              <select
                id="tasktype"
                name="tasktype"
                value={taskType} onChange={(e) => setTaskType(e.target.value)}
                className="w-full bg-black border-gray-600 px-4 text-white py-2 rounded-sm border border-input focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="remote">Remote</option>
                <option value="physical">Physical</option>
              </select>
              {taskType === "physical" && (
                <>
                <label htmlFor="location" className="block text-white font-body text-foreground mb-2">
                Location Details
              </label>
              <select
                id="location"
                name="location"
                value={location} onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-black px-4 text-white py-2 rounded-sm border border-gray-600 border-input focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="emu campus">EMU Main Campus</option>
                <option value="south campus">EMU South Campus</option>
                <option value="off campus">Off Campus</option>
              </select>
                </>
              
             
          )} 
            </div>
          <div>
              <label htmlFor="dueDate" className="block text-white font-body text-foreground mb-2">
                Due Date *
              </label>
              <div className="relative">
                <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  id="dueDate"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className={`bg-black text-white pl-10 pr-4 py-2 rounded-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-ring`}
                />
              </div>
            </div>
            <>
            <Select value={category} onValueChange={setCategory} >
            <SelectTrigger className="w-full bg-black border-gray-600 text-gray-400">
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
          </>
            </div>

          
          {/* File Upload */}
          <div {...getRootProps()} className="border-2 border-dashed border-dark-input rounded-sm p-6 text-center hover:border-primary transition-colors cursor-pointer bg-dark-card">
            <input {...getInputProps()} />
            <FiUploadCloud className="mx-auto text-3xl text-dark-accent mb-2" />
            <p className="text-body text-dark-accent">Drag & drop files here, or click to select files</p>
          </div>
          {files.length > 0 && (
              <div className="mt-4 space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-dark-muted p-2 rounded-sm"
                  >
                    <div className="flex items-center">
                      <FiFile className="text-gray-200 mr-2" />
                      <span className="text-sm text-gray-400">{file.name}</span>
                      <span className="text-sm text-gray-400 ml-2">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(file)}
                      className="text-dark-accent hover:text-destructive transition-colors"
                    >
                      <FiX />
                    </button>
                  </div>
                ))}
              </div>
            )}

<div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => {
                router.push('/')
                setFiles([])
              }}
              className="px-6 py-2 rounded-sm bg-black text-dark-secondary-foreground hover:bg-dark-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={addTask}
              disabled={isSubmitting}
              className="px-6 py-2 rounded-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating..." : "Create Task"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTask;
