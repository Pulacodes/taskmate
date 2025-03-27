"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface TaskCompletionProps {
  taskId: string;
  initialRequirements: string[];
  initialStatus: string;
  price: number;
}

const TaskCompletion: React.FC<TaskCompletionProps> = ({ taskId, initialRequirements, price }) => {
  const [requirements, setRequirements] = useState<{ text: string; checked: boolean }[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const router = useRouter();
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setRequirements(initialRequirements.map((req) => ({ text: req, checked: false })));
  }, [initialRequirements]);

  // Handle checkbox toggle
  const handleCheck = (index: number) => {
    const updatedRequirements = [...requirements];
    updatedRequirements[index].checked = !updatedRequirements[index].checked;
    setRequirements(updatedRequirements);

    // Enable "Mark Complete" only when all are checked
    const allChecked = updatedRequirements.every((req) => req.checked);
    setIsComplete(allChecked);
  };

  // Handle file uploads and previews
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      setFiles(selectedFiles);

      // Generate previews for images
      const urls = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(urls);
    }
  };

  // Handle Mark Complete
  const markTaskAsComplete = async () => {
    if (!isComplete) return;

    try {
      const formData = new FormData();
      formData.append("taskId", taskId);

      // Append all selected files
      files.forEach((file) => {
        formData.append("image", file);
      });

      const response = await fetch(`/api/tasks/complete`, {
        method: "POST",
        body: formData, // Sending FormData
      });

      const data = await response.json();
      if (response.ok) {
        alert("Task marked as complete!");
        setIsComplete(false);
        router.refresh();
      } else {
        alert("Failed to mark task as complete: " + data.error);
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  // Calculate amount after deduction
  const amountToReceive = (price * 0.9).toFixed(2); // 90% of price

  return (
    <div className="bg-gray-900 p-6 rounded-md shadow-md text-white max-w-full mx-auto">
      <h2 className="text-2xl font-bold mb-4">Task Requirements</h2>

      <ul className="mb-4">
        {requirements.map((req, index) => (
          <li
            key={index}
            className={`flex items-center space-x-3 cursor-pointer p-2 rounded ${req.checked ? "line-through text-gray-500" : ""}`}
            onClick={() => handleCheck(index)}
          >
            <input type="checkbox" checked={req.checked} onChange={() => handleCheck(index)} className="cursor-pointer" />
            <span>{req.text}</span>
          </li>
        ))}
      </ul>

      <p className="text-lg font-bold mb-4">
        Amount to Receive: <span className="text-green-400">TL {amountToReceive}</span>
      </p>

      <div className="mb-4">
        <label className="block mb-2">Upload Proof of Completion:</label>
        <input type="file" multiple onChange={handleFileChange} className="bg-gray-800 text-white p-2 rounded w-full" />
      </div>

      {/* File Previews */}
      {previewUrls.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {previewUrls.map((url, index) => (
            <Image width={60} height={60} key={index} src={url} alt="Preview" className="w-20 h-20 object-cover rounded-md" />
          ))}
        </div>
      )}

      <button
        className={`w-full p-3 rounded font-bold ${isComplete ? "bg-green hover:bg-green-600" : "bg-gray-700 cursor-not-allowed"}`}
        onClick={markTaskAsComplete}
        disabled={!isComplete}
      >
        Mark Task as Complete
      </button>
    </div>
  );
};

export default TaskCompletion;
